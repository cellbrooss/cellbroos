import { mockProducts, mockCategories, mockStoreSettings } from "./mock-data";

const IS_SERVER = typeof window === "undefined";

function getLocalStorage<T>(key: string, fallback: T): T {
  if (IS_SERVER) return fallback;
  const val = localStorage.getItem(key);
  if (!val) return fallback;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
}

function setLocalStorage<T>(key: string, value: T): void {
  if (IS_SERVER) return;
  localStorage.setItem(key, JSON.stringify(value));
}

// In-memory cache for client to prevent multiple requests
let cachedProducts: any[] | null = null;
let cachedCategories: any[] | null = null;
let cachedSettings: any | null = null;

export const DataService = {
  // Store Settings
  getSettings: () => {
    if (cachedSettings) return cachedSettings;
    const fallback = getLocalStorage("cellbross_settings", mockStoreSettings);
    
    if (!IS_SERVER) {
      fetch("/api/settings")
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            cachedSettings = data;
            setLocalStorage("cellbross_settings", data);
            window.dispatchEvent(new Event("cellbross_data_changed"));
          }
        })
        .catch(() => {});
    }
    
    return fallback;
  },
  
  saveSettings: async (settings: any) => {
    cachedSettings = settings;
    setLocalStorage("cellbross_settings", settings);
    
    if (!IS_SERVER) {
      try {
        const res = await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        });
        const data = await res.json();
        if (data && !data.error) {
          cachedSettings = data;
          setLocalStorage("cellbross_settings", data);
        }
      } catch (e) {
        console.warn("API save failed, using local storage:", e);
      }
      window.dispatchEvent(new Event("cellbross_data_changed"));
    }
  },

  // Categories
  getCategories: () => {
    if (cachedCategories) return cachedCategories;
    const fallback = getLocalStorage("cellbross_categories", mockCategories);
    
    if (!IS_SERVER) {
      fetch("/api/categories")
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data)) {
            cachedCategories = data;
            setLocalStorage("cellbross_categories", data);
            window.dispatchEvent(new Event("cellbross_data_changed"));
          }
        })
        .catch(() => {});
    }
    
    return fallback;
  },
  
  saveCategories: async (categories: any[]) => {
    cachedCategories = categories;
    setLocalStorage("cellbross_categories", categories);
    
    if (!IS_SERVER) {
      try {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categories),
        });
        const data = await res.json();
        if (data && Array.isArray(data)) {
          cachedCategories = data;
          setLocalStorage("cellbross_categories", data);
        }
      } catch (e) {
        console.warn("API save failed, using local storage:", e);
      }
      window.dispatchEvent(new Event("cellbross_data_changed"));
    }
  },

  // Products
  getProducts: () => {
    if (cachedProducts) return cachedProducts;
    const fallback = getLocalStorage("cellbross_products", mockProducts);
    
    if (!IS_SERVER) {
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data)) {
            cachedProducts = data;
            setLocalStorage("cellbross_products", data);
            window.dispatchEvent(new Event("cellbross_data_changed"));
          }
        })
        .catch(() => {});
    }
    
    return fallback;
  },
  
  saveProducts: async (products: any[]) => {
    cachedProducts = products;
    setLocalStorage("cellbross_products", products);
    
    if (!IS_SERVER) {
      try {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(products),
        });
        const data = await res.json();
        if (data && Array.isArray(data)) {
          cachedProducts = data;
          setLocalStorage("cellbross_products", data);
        }
      } catch (e) {
        console.warn("API save failed, using local storage:", e);
      }
      window.dispatchEvent(new Event("cellbross_data_changed"));
    }
  },
};
