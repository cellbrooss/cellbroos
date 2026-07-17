import { createClient } from "@supabase/supabase-js";
import { mockProducts, mockCategories, mockStoreSettings } from "./mock-data";

// ─── Supabase server-side client ─────────────────────────────────────────────
// Uses service role key when available (bypasses RLS for admin writes).
function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("[DbService] Supabase credentials missing on server side!", {
      urlExists: !!url,
      keyExists: !!key,
    });
    return null;
  }
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

// ─── Auto-Seed Database on Empty ─────────────────────────────────────────────
let isSeeding = false;
async function checkAndSeed(sb: any) {
  if (isSeeding) return;
  isSeeding = true;
  try {
    // 1. Seed Settings
    const { data: settings, error: sErr } = await sb
      .from("store_settings")
      .select("id")
      .eq("id", "default")
      .maybeSingle();

    if (!sErr && !settings) {
      console.log("[DbService] Seeding default store settings...");
      await sb.from("store_settings").insert(mockStoreSettings);
    }

    // 2. Seed Categories
    const { data: categories, error: cErr } = await sb
      .from("categories")
      .select("id")
      .limit(1);

    if (!cErr && (!categories || categories.length === 0)) {
      console.log("[DbService] Seeding default categories...");
      await sb.from("categories").insert(mockCategories);
    }

    // 3. Seed Products
    const { data: products, error: pErr } = await sb
      .from("products")
      .select("id")
      .limit(1);

    if (!pErr && (!products || products.length === 0)) {
      console.log("[DbService] Seeding default products...");
      const rows = mockProducts.map(({ category, ...rest }) => rest);
      await sb.from("products").insert(rows);
    }
  } catch (err) {
    console.error("[DbService] checkAndSeed failed:", err);
  } finally {
    isSeeding = false;
  }
}

export const DbService = {
  // ─── Store Settings ─────────────────────────────────────────────────────────
  getSettings: async () => {
    const sb = getSupabaseServer();
    if (sb) {
      await checkAndSeed(sb);
      try {
        const { data, error } = await sb
          .from("store_settings")
          .select("*")
          .eq("id", "default")
          .single();

        if (error) {
          // PGRST116 = no rows found, everything else is a real error
          if (error.code !== "PGRST116") {
            console.warn("[DbService] getSettings error:", error.message, error.code);
          }
        }

        // Only return DB data if it actually came back — never auto-seed
        if (data) return data;
      } catch (e) {
        console.warn("[DbService] getSettings exception:", e);
      }
    }
    // Supabase unavailable or row not found → return in-memory mock (read-only fallback)
    return mockStoreSettings;
  },

  saveSettings: async (settings: any) => {
    const sb = getSupabaseServer();
    if (!sb) {
      throw new Error("Veritabanı bağlantısı kurulamadı. Lütfen sunucu ortam değişkenlerini kontrol edin.");
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error } = await sb
        .from("store_settings")
        .upsert({ id: "default", ...settings }, { onConflict: "id" })
        .select()
        .single();

      if (error) {
        console.error("[DbService] saveSettings error:", error.message, error.code);
        // Throw so the API route can return a proper 500 to the client
        throw new Error(error.message);
      }
      return data ?? settings;
    } catch (e) {
      console.error("[DbService] saveSettings exception:", e);
      throw e; // propagate — don't silently swallow
    }
  },

  // ─── Categories ─────────────────────────────────────────────────────────────
  getCategories: async () => {
    const sb = getSupabaseServer();
    if (sb) {
      await checkAndSeed(sb);
      try {
        const { data, error } = await sb
          .from("categories")
          .select("*")
          .order("display_order", { ascending: true });

        if (error) {
          console.warn("[DbService] getCategories error:", error.message, error.code);
        }

        // Return DB data if we got any rows (even 0 rows is valid — don't auto-seed)
        if (!error) return data ?? [];
      } catch (e) {
        console.warn("[DbService] getCategories exception:", e);
      }
    }
    return mockCategories;
  },

  saveCategories: async (categories: any[]) => {
    const sb = getSupabaseServer();
    if (!sb) {
      throw new Error("Veritabanı bağlantısı kurulamadı. Lütfen sunucu ortam değişkenlerini kontrol edin.");
    }
    try {
      const { data, error } = await sb
        .from("categories")
        .upsert(categories, { onConflict: "id" })
        .select();

      if (error) {
        console.error("[DbService] saveCategories error:", error.message, error.code);
        throw new Error(error.message);
      }
      return data ?? categories;
    } catch (e) {
      console.error("[DbService] saveCategories exception:", e);
      throw e;
    }
  },

  // ─── Products ────────────────────────────────────────────────────────────────
  getProducts: async () => {
    const sb = getSupabaseServer();
    if (sb) {
      await checkAndSeed(sb);
      try {
        // Join Category relation using Supabase's embedded resource syntax
        const { data, error } = await sb
          .from("products")
          .select('*, category:categories(name, slug)')
          .order("display_order", { ascending: true });

        if (error) {
          console.warn("[DbService] getProducts error:", error.message, error.code);
        }

        if (!error) return data ?? [];
      } catch (e) {
        console.warn("[DbService] getProducts exception:", e);
      }
    }
    return mockProducts;
  },

  saveProducts: async (products: any[]) => {
    const sb = getSupabaseServer();
    if (!sb) {
      throw new Error("Veritabanı bağlantısı kurulamadı. Lütfen sunucu ortam değişkenlerini kontrol edin.");
    }
    try {
      // Strip the joined `category` object — it's a relation, not a column
      const rows = products.map(({ category, ...rest }) => rest);
      const activeIds = rows.map((p) => p.id);

      // Delete products that are no longer in the list
      if (activeIds.length > 0) {
        const { error: delError } = await sb
          .from("products")
          .delete()
          .not("id", "in", `(${activeIds.map((id) => `'${id}'`).join(",")})`);

        if (delError) {
          console.warn("[DbService] saveProducts delete error:", delError.message);
        }
      }

      const { data, error } = await sb
        .from("products")
        .upsert(rows, { onConflict: "id" })
        .select();

      if (error) {
        console.error("[DbService] saveProducts error:", error.message, error.code);
        throw new Error(error.message);
      }
      return data ?? products;
    } catch (e) {
      console.error("[DbService] saveProducts exception:", e);
      throw e;
    }
  },
};
