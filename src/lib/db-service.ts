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

  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

// NOTE: Table names MUST match the Prisma model names exactly (PascalCase)
// because `prisma db push` creates them that way in PostgreSQL.
// Category → "Category", Product → "Product", StoreSettings → "StoreSettings"

export const DbService = {
  // ─── Store Settings ─────────────────────────────────────────────────────────
  getSettings: async () => {
    const sb = getSupabaseServer();
    if (sb) {
      try {
        const { data, error } = await sb
          .from("StoreSettings")
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
    if (sb) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data, error } = await sb
          .from("StoreSettings")
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
    }
    // No Supabase configured — nothing to persist on the server
    return settings;
  },

  // ─── Categories ─────────────────────────────────────────────────────────────
  getCategories: async () => {
    const sb = getSupabaseServer();
    if (sb) {
      try {
        const { data, error } = await sb
          .from("Category")
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
    if (sb) {
      try {
        const { data, error } = await sb
          .from("Category")
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
    }
    return categories;
  },

  // ─── Products ────────────────────────────────────────────────────────────────
  getProducts: async () => {
    const sb = getSupabaseServer();
    if (sb) {
      try {
        // Join Category relation using Supabase's embedded resource syntax
        const { data, error } = await sb
          .from("Product")
          .select('*, category:Category(name, slug)')
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
    if (sb) {
      try {
        // Strip the joined `category` object — it's a relation, not a column
        const rows = products.map(({ category, ...rest }) => rest);
        const activeIds = rows.map((p) => p.id);

        // Delete products that are no longer in the list
        if (activeIds.length > 0) {
          const { error: delError } = await sb
            .from("Product")
            .delete()
            .not("id", "in", `(${activeIds.map((id) => `'${id}'`).join(",")})`);

          if (delError) {
            console.warn("[DbService] saveProducts delete error:", delError.message);
          }
        }

        const { data, error } = await sb
          .from("Product")
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
    }
    return products;
  },
};
