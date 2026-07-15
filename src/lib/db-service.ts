import { getPrismaClient } from "./prisma";
import { mockProducts, mockCategories, mockStoreSettings } from "./mock-data";
import fs from "fs";
import path from "path";

const FALLBACK_FILE = path.join(process.cwd(), "src/lib/db-fallback.json");

// Helper to get local JSON database state
function readLocalDb(): { products: any[]; categories: any[]; settings: any } {
  if (!fs.existsSync(FALLBACK_FILE)) {
    return {
      products: mockProducts,
      categories: mockCategories,
      settings: mockStoreSettings,
    };
  }
  try {
    const data = fs.readFileSync(FALLBACK_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return {
      products: mockProducts,
      categories: mockCategories,
      settings: mockStoreSettings,
    };
  }
}

function writeLocalDb(data: any) {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Local DB write error:", e);
  }
}

// Check if database connection is active
async function isDbConnected(): Promise<boolean> {
  const prisma = getPrismaClient();
  if (!prisma) return false;
  try {
    // Quick probe
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (e) {
    return false;
  }
}

export const DbService = {
  // Store Settings
  getSettings: async () => {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        let settings = await prisma.storeSettings.findUnique({
          where: { id: "default" },
        });
        if (!settings) {
          // Initialize default settings in DB
          settings = await prisma.storeSettings.create({
            data: {
              id: "default",
              name: mockStoreSettings.name,
              logo_url: mockStoreSettings.logo_url,
              logo_text: mockStoreSettings.logo_text,
              address: mockStoreSettings.address,
              phone: mockStoreSettings.phone,
              whatsapp: mockStoreSettings.whatsapp,
              working_hours: mockStoreSettings.working_hours as any,
              google_maps_url: mockStoreSettings.google_maps_url,
              social_links: mockStoreSettings.social_links as any,
              why_us: mockStoreSettings.why_us as any,
              brands: mockStoreSettings.brands as any,
              featured_title: mockStoreSettings.featured_title,
              announcement_text: mockStoreSettings.announcement_text,
              announcement_active: mockStoreSettings.announcement_active,
            },
          });
        }
        return settings;
      } catch (e) {
        console.warn("DB query failed, using local fallback:", e);
      }
    }
    return readLocalDb().settings;
  },

  saveSettings: async (settings: any) => {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.storeSettings.upsert({
          where: { id: "default" },
          update: {
            name: settings.name,
            logo_url: settings.logo_url,
            logo_text: settings.logo_text,
            address: settings.address,
            phone: settings.phone,
            whatsapp: settings.whatsapp,
            working_hours: settings.working_hours,
            google_maps_url: settings.google_maps_url,
            social_links: settings.social_links,
            why_us: settings.why_us,
            brands: settings.brands,
            featured_title: settings.featured_title,
            announcement_text: settings.announcement_text,
            announcement_active: settings.announcement_active,
          },
          create: {
            id: "default",
            name: settings.name,
            logo_url: settings.logo_url,
            logo_text: settings.logo_text,
            address: settings.address,
            phone: settings.phone,
            whatsapp: settings.whatsapp,
            working_hours: settings.working_hours,
            google_maps_url: settings.google_maps_url,
            social_links: settings.social_links,
            why_us: settings.why_us,
            brands: settings.brands,
            featured_title: settings.featured_title,
            announcement_text: settings.announcement_text,
            announcement_active: settings.announcement_active,
          },
        });
      } catch (e) {
        console.warn("DB save failed, using local fallback:", e);
      }
    }
    const db = readLocalDb();
    db.settings = settings;
    writeLocalDb(db);
    return settings;
  },

  // Categories
  getCategories: async () => {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        let list = await prisma.category.findMany({
          orderBy: { display_order: "asc" },
        });
        if (list.length === 0) {
          // Auto-seed categories
          await DbService.saveCategories(mockCategories);
          list = await prisma.category.findMany({
            orderBy: { display_order: "asc" },
          });
        }
        return list;
      } catch (e) {
        console.warn("DB query failed, using local fallback:", e);
      }
    }
    return readLocalDb().categories;
  },

  saveCategories: async (categories: any[]) => {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        // Upsert all categories
        for (const cat of categories) {
          await prisma.category.upsert({
            where: { id: cat.id },
            update: {
              name: cat.name,
              slug: cat.slug,
              description: cat.description,
              display_order: cat.display_order,
            },
            create: {
              id: cat.id,
              name: cat.name,
              slug: cat.slug,
              description: cat.description,
              display_order: cat.display_order,
            },
          });
        }
        return categories;
      } catch (e) {
        console.warn("DB save failed, using local fallback:", e);
      }
    }
    const db = readLocalDb();
    db.categories = categories;
    writeLocalDb(db);
    return categories;
  },

  // Products
  getProducts: async () => {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        let list = await prisma.product.findMany({
          include: { category: true },
          orderBy: { display_order: "asc" },
        });
        if (list.length === 0) {
          // Auto-seed categories first, then products
          await DbService.getCategories();
          await DbService.saveProducts(mockProducts);
          list = await prisma.product.findMany({
            include: { category: true },
            orderBy: { display_order: "asc" },
          });
        }
        return list;
      } catch (e) {
        console.warn("DB query failed, using local fallback:", e);
      }
    }
    return readLocalDb().products;
  },

  saveProducts: async (products: any[]) => {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        // Delete products in DB that are not in the new list (to keep sync)
        const activeIds = products.map((p) => p.id);
        await prisma.product.deleteMany({
          where: { id: { notIn: activeIds } },
        });

        // Upsert each product
        for (const p of products) {
          const catId = p.category_id;
          await prisma.product.upsert({
            where: { id: p.id },
            update: {
              name: p.name,
              slug: p.slug,
              description: p.description,
              brand: p.brand,
              model: p.model,
              price: p.price,
              specs: p.specs,
              images: p.images || [],
              stock_status: p.stock_status,
              is_featured: p.is_featured,
              is_active: p.is_active,
              display_order: p.display_order,
              category_id: catId,
            },
            create: {
              id: p.id,
              name: p.name,
              slug: p.slug,
              description: p.description,
              brand: p.brand,
              model: p.model,
              price: p.price,
              specs: p.specs,
              images: p.images || [],
              stock_status: p.stock_status,
              is_featured: p.is_featured,
              is_active: p.is_active,
              display_order: p.display_order,
              category_id: catId,
            },
          });
        }
        return products;
      } catch (e) {
        console.warn("DB save failed, using local fallback:", e);
      }
    }
    const db = readLocalDb();
    db.products = products;
    writeLocalDb(db);
    return products;
  },
};
