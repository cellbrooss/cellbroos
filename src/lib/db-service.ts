import { createClient } from "@supabase/supabase-js";
import { mockProducts, mockCategories, mockStoreSettings } from "./mock-data";

// Server-side Supabase client (uses service role key so it can bypass RLS)
function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return createClient(url, key);
}

export const DbService = {
  // ─── Store Settings ─────────────────────────────────────────────────────────
  getSettings: async () => {
    const sb = getSupabaseServer();
    if (sb) {
      try {
        const { data, error } = await sb
          .from("store_settings")
          .select("*")
          .eq("id", "default")
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 = row not found, ignore it
          console.warn("Supabase getSettings error:", error.message);
        }

        if (data) return data;

        // Row doesn't exist yet → insert defaults
        const { id: _id, ...defaultSettings } = mockStoreSettings as any;
        const { data: created, error: insertError } = await sb
          .from("store_settings")
          .insert({ id: "default", ...defaultSettings })
          .select()
          .single();

        if (insertError) {
          console.warn("Supabase insert settings error:", insertError.message);
        }
        return created ?? mockStoreSettings;
      } catch (e) {
        console.warn("Supabase getSettings exception:", e);
      }
    }
    return mockStoreSettings;
  },

  saveSettings: async (settings: any) => {
    const sb = getSupabaseServer();
    if (sb) {
      try {
        const { data, error } = await sb
          .from("store_settings")
          .upsert({ id: "default", ...settings })
          .select()
          .single();

        if (error) {
          console.warn("Supabase saveSettings error:", error.message);
        }
        return data ?? settings;
      } catch (e) {
        console.warn("Supabase saveSettings exception:", e);
      }
    }
    return settings;
  },

  // ─── Categories ─────────────────────────────────────────────────────────────
  getCategories: async () => {
    const sb = getSupabaseServer();
    if (sb) {
      try {
        const { data, error } = await sb
          .from("categories")
          .select("*")
          .order("display_order", { ascending: true });

        if (error) {
          console.warn("Supabase getCategories error:", error.message);
        }

        if (data && data.length > 0) return data;

        // Auto-seed if empty
        await DbService.saveCategories(mockCategories);
        const { data: seeded } = await sb
          .from("categories")
          .select("*")
          .order("display_order", { ascending: true });
        return seeded ?? mockCategories;
      } catch (e) {
        console.warn("Supabase getCategories exception:", e);
      }
    }
    return mockCategories;
  },

  saveCategories: async (categories: any[]) => {
    const sb = getSupabaseServer();
    if (sb) {
      try {
        const { data, error } = await sb
          .from("categories")
          .upsert(categories, { onConflict: "id" })
          .select();

        if (error) {
          console.warn("Supabase saveCategories error:", error.message);
        }
        return data ?? categories;
      } catch (e) {
        console.warn("Supabase saveCategories exception:", e);
      }
    }
    return categories;
  },

  // ─── Products ────────────────────────────────────────────────────────────────
  getProducts: async () => {
    const sb = getSupabaseServer();
    if (sb) {
      try {
        const { data, error } = await sb
          .from("products")
          .select("*, category:categories(name, slug)")
          .order("display_order", { ascending: true });

        if (error) {
          console.warn("Supabase getProducts error:", error.message);
        }

        if (data && data.length > 0) return data;

        // Auto-seed if empty
        await DbService.getCategories();
        await DbService.saveProducts(mockProducts);
        const { data: seeded } = await sb
          .from("products")
          .select("*, category:categories(name, slug)")
          .order("display_order", { ascending: true });
        return seeded ?? mockProducts;
      } catch (e) {
        console.warn("Supabase getProducts exception:", e);
      }
    }
    return mockProducts;
  },

  saveProducts: async (products: any[]) => {
    const sb = getSupabaseServer();
    if (sb) {
      try {
        // Remove joined 'category' object before upserting (it's a relation, not a column)
        const rows = products.map(({ category, ...rest }) => rest);

        // Delete removed products
        const activeIds = rows.map((p) => p.id);
        await sb.from("products").delete().not("id", "in", `(${activeIds.map((id) => `'${id}'`).join(",")})`);

        const { data, error } = await sb
          .from("products")
          .upsert(rows, { onConflict: "id" })
          .select();

        if (error) {
          console.warn("Supabase saveProducts error:", error.message);
        }
        return data ?? products;
      } catch (e) {
        console.warn("Supabase saveProducts exception:", e);
      }
    }
    return products;
  },
};
