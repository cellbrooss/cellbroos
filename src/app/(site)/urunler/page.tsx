"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, X, Layers } from "lucide-react";
import { DataService } from "@/lib/data-service";
import ProductCard from "@/components/product/ProductCard";
import { formatPrice } from "@/lib/utils";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedStock, setSelectedStock] = useState<string>("all");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    setProducts(DataService.getProducts());
    setCategories(DataService.getCategories());

    const handleDataChange = () => {
      setProducts(DataService.getProducts());
      setCategories(DataService.getCategories());
    };

    window.addEventListener("cellbross_data_changed", handleDataChange);
    return () => window.removeEventListener("cellbross_data_changed", handleDataChange);
  }, []);

  // Brands extracted from products
  const brands = useMemo(() => {
    const allBrands = products.map((p) => p.brand);
    return ["all", ...Array.from(new Set(allBrands))];
  }, [products]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const productCategorySlug = product.category?.slug || "";
      const matchesCategory =
        selectedCategory === "all" || productCategorySlug === selectedCategory;
      
      const matchesBrand =
        selectedBrand === "all" || product.brand === selectedBrand;

      const matchesStock =
        selectedStock === "all" || product.stock_status === selectedStock;

      return matchesSearch && matchesCategory && matchesBrand && matchesStock && product.is_active !== false;
    });
  }, [products, searchQuery, selectedCategory, selectedBrand, selectedStock]);

  const handleCompareToggle = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 3) {
        alert("En fazla 3 ürünü karşılaştırabilirsiniz.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const clearCompare = () => {
    setCompareIds([]);
  };

  const compareProducts = useMemo(() => {
    return products.filter((p) => compareIds.includes(p.id));
  }, [compareIds, products]);

  return (
    <div className="min-h-screen py-12 bg-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="mb-12 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 mb-4">
            Tüm <span className="gradient-text">Ürünler</span>
          </h1>
          <p className="text-surface-500 text-sm sm:text-base max-w-xl font-medium">
            Telefonlar, kulaklıklar, kılıflar ve daha fazlası. Özelliklerini karşılaştırın, stok durumunu öğrenin.
          </p>
        </div>

        {/* Filters and Search Grid */}
        <div className="card p-6 mb-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Marka, model veya özellik ara..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all font-semibold"
              />
            </div>

            {/* Brand Dropdown */}
            <div>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all cursor-pointer font-semibold"
              >
                <option value="all">Tüm Markalar</option>
                {brands.filter((b) => b !== "all").map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Dropdown */}
            <div>
              <select
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all cursor-pointer font-semibold"
              >
                <option value="all">Tüm Stok Durumları</option>
                <option value="IN_STOCK">Stokta Olanlar</option>
                <option value="ON_ORDER">Siparişte Olanlar</option>
                <option value="OUT_OF_STOCK">Tükenenler</option>
              </select>
            </div>
          </div>

          {/* Category Quick Filter Tabs */}
          <div className="border-t border-surface-100 pt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                selectedCategory === "all"
                  ? "bg-surface-900 text-white"
                  : "bg-white border border-surface-200 text-surface-500 hover:text-surface-900 hover:border-surface-500"
              }`}
            >
              Tümü
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                  selectedCategory === category.slug
                    ? "bg-surface-900 text-white"
                    : "bg-white border border-surface-200 text-surface-500 hover:text-surface-900 hover:border-surface-500"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onCompareToggle={handleCompareToggle}
                isComparing={compareIds.includes(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-slate-600 mb-2 font-semibold">Arama kriterlerinize uygun ürün bulunamadı.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedBrand("all");
                setSelectedStock("all");
              }}
              className="text-xs text-primary-600 font-bold hover:underline"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}

        {/* Bottom Floating Compare Bar */}
        {compareIds.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl p-4 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Karşılaştırma Modülü</p>
                <p className="text-xs text-slate-500 font-medium">
                  {compareIds.length} / 3 ürün seçildi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearCompare}
                className="btn-ghost !px-3 !py-1.5 text-xs text-slate-500 hover:text-slate-800"
              >
                Temizle
              </button>
              <button
                onClick={() => setShowCompareModal(true)}
                className="btn-primary !px-4 !py-2 text-xs"
              >
                Karşılaştır
              </button>
            </div>
          </div>
        )}

        {/* Comparison Modal */}
        {showCompareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="card max-w-4xl w-full bg-white border border-slate-200 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-bold text-slate-900">Ürün Karşılaştırma</h3>
                </div>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="btn-ghost !p-1.5 text-slate-500 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Compare Table */}
              <div className="p-6 overflow-x-auto">
                <table className="w-full border-collapse text-left min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-1/4">
                        ÖZELLİKLER
                      </th>
                      {compareProducts.map((p) => (
                        <th key={p.id} className="py-4 px-4 text-sm font-bold text-slate-900 w-1/4">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-primary-600 font-bold uppercase mb-0.5">
                              {p.brand}
                            </span>
                            <span>{p.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* Price Row */}
                    <tr>
                      <td className="py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Fiyat
                      </td>
                      {compareProducts.map((p) => (
                        <td key={p.id} className="py-4 px-4 text-sm font-extrabold text-slate-900">
                          {p.price ? formatPrice(p.price) : "Fiyat Sorun"}
                        </td>
                      ))}
                    </tr>
                    {/* Specs Rows */}
                    {["ekran", "islemci", "ram", "depolama", "kamera", "pil", "os"].map((specKey) => (
                      <tr key={specKey}>
                        <td className="py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          {specKey.toUpperCase()}
                        </td>
                        {compareProducts.map((p) => {
                          const specVal = (p.specs as unknown as Record<string, string>)[specKey];
                          return (
                            <td key={p.id} className="py-4 px-4 text-sm text-slate-700">
                              {specVal || "-"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
