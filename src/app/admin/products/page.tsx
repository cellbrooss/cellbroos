"use client";

import { useState, useEffect } from "react";
import { DataService } from "@/lib/data-service";
import { Smartphone, Plus, Trash2, Edit3, X, Save, Search, AlertCircle, Upload } from "lucide-react";
import { generateSlug, formatPrice } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [stockStatus, setStockStatus] = useState("IN_STOCK");
  const [imageUrl, setImageUrl] = useState("");
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const handleAddImageUrl = () => {
    setImagesList((prev) => [...prev, ""]);
  };

  const handleRemoveImageUrl = (index: number) => {
    setImagesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUrlChange = (index: number, val: string) => {
    setImagesList((prev) => prev.map((item, i) => (i === index ? val : item)));
  };

  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    try {
      if (!supabase) {
        throw new Error("Supabase client is not initialized.");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from("cellbross")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("cellbross")
        .getPublicUrl(filePath);

      handleImageUrlChange(index, publicUrl);
    } catch (err: any) {
      console.warn("Supabase Storage upload failed, using local Base64 fallback:", err);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handleImageUrlChange(index, base64String);
        alert(
          "Not: Supabase Storage üzerinde 'cellbross' adında bir public bucket oluşturulmamış veya erişim izni yok. Görsel şimdilik yerel veri olarak (Base64 formatında) kaydedildi. Ürünü kaydettiğinizde çalışacaktır."
        );
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingIndex(null);
    }
  };

  // Specs states (structured as key-value list for simple UI mapping)
  const [specsList, setSpecsList] = useState<{ key: string; val: string }[]>([]);

  useEffect(() => {
    setProducts(DataService.getProducts());
    setCategories(DataService.getCategories());
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setSlug("");
    setDescription("");
    setBrand("");
    setModel("");
    setPrice(0);
    setCategoryId(categories[0]?.id || "");
    setStockStatus("IN_STOCK");
    setImageUrl("/products/iphone-16-pro-max.png"); // default fallback template
    setImagesList(["/products/iphone-16-pro-max.png"]);
    setIsFeatured(false);
    setIsActive(true);
    setSpecsList([
      { key: "ekran", val: "" },
      { key: "islemci", val: "" },
      { key: "ram", val: "" },
      { key: "depolama", val: "" },
      { key: "kamera", val: "" },
      { key: "pil", val: "" },
      { key: "os", val: "" },
    ]);
    setModalOpen(true);
  };

  const openEditModal = (prod: any) => {
    setEditingProduct(prod);
    setName(prod.name);
    setSlug(prod.slug);
    setDescription(prod.description || "");
    setBrand(prod.brand || "");
    setModel(prod.model || "");
    setPrice(prod.price || 0);
    setCategoryId(prod.category_id || "");
    setStockStatus(prod.stock_status || "IN_STOCK");
    setImageUrl(prod.image_url || "");
    setImagesList(Array.isArray(prod.images) && prod.images.length > 0 ? prod.images : [prod.image_url || ""]);
    setIsFeatured(prod.is_featured || false);
    setIsActive(prod.is_active !== false);

    // Map specs object to list
    const currentSpecs = prod.specs || {};
    const mapped = Object.entries(currentSpecs).map(([key, val]) => ({
      key,
      val: String(val),
    }));
    setSpecsList(mapped.length > 0 ? mapped : [
      { key: "ekran", val: "" },
      { key: "islemci", val: "" },
      { key: "ram", val: "" },
      { key: "depolama", val: "" },
      { key: "kamera", val: "" },
      { key: "pil", val: "" },
      { key: "os", val: "" },
    ]);
    setModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!editingProduct) {
      setSlug(generateSlug(val));
    }
  };

  const handleAddSpecRow = () => {
    setSpecsList((prev) => [...prev, { key: "", val: "" }]);
  };

  const handleRemoveSpecRow = (index: number) => {
    setSpecsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: "key" | "val", value: string) => {
    setSpecsList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert specs list back to key-value object
    const specsObj: Record<string, string> = {};
    specsList.forEach((item) => {
      if (item.key.trim()) {
        specsObj[item.key.trim()] = item.val.trim();
      }
    });

    const categoryObj = categories.find((c) => c.id === categoryId);

    const finalImagesList = imagesList.filter(url => url.trim().length > 0);
    const finalImageUrl = finalImagesList[0] || imageUrl || "";

    if (editingProduct) {
      // Edit
      const updatedList = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name,
              slug,
              description,
              brand,
              model,
              price: Number(price),
              category_id: categoryId,
              category: categoryObj ? { name: categoryObj.name, slug: categoryObj.slug } : undefined,
              stock_status: stockStatus,
              image_url: finalImageUrl,
              images: finalImagesList,
              is_featured: isFeatured,
              is_active: isActive,
              specs: specsObj,
            }
          : p
      );
      DataService.saveProducts(updatedList);
      setProducts(updatedList);
    } else {
      // Add new
      const newProd = {
        id: `prod-${Date.now()}`,
        name,
        slug,
        description,
        brand,
        model,
        price: Number(price),
        category_id: categoryId,
        category: categoryObj ? { name: categoryObj.name, slug: categoryObj.slug } : undefined,
        stock_status: stockStatus,
        image_url: finalImageUrl,
        images: finalImagesList,
        is_featured: isFeatured,
        is_active: isActive,
        specs: specsObj,
        display_order: products.length + 1,
        meta_title: `${name} | CellBroos`,
        meta_description: `${name} en uygun fiyatlarla CellBroos mağazasında.`,
      };
      const updatedList = [...products, newProd];
      DataService.saveProducts(updatedList);
      setProducts(updatedList);
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      const updatedList = products.filter((p) => p.id !== id);
      DataService.saveProducts(updatedList);
      setProducts(updatedList);
    }
  };

  // Filter & Search Logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.model && p.model.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategoryFilter === "all" || p.category_id === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-surface-900 tracking-tight">Ürün Yönetimi</h1>
          <p className="text-sm text-surface-500 font-medium mt-1">Telefonlar, kulaklıklar ve diğer tüm aksesuarları ekleyin veya güncelleyin.</p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-primary py-3 px-5 text-sm font-bold flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" />
          Yeni Ürün Ekle
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-surface-200/80 p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4.5 h-4.5 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Ürün adı, marka veya model arayın..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-surface-50 border border-surface-200/60 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-60">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-surface-50 border border-surface-200/60 focus:border-surface-900 focus:bg-white rounded-xl text-surface-700 text-sm font-bold transition-all outline-none cursor-pointer"
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-surface-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-50/50 border-b border-surface-200/50">
                <th className="px-6 py-4.5 text-xs font-bold text-surface-500 uppercase tracking-wider">Ürün</th>
                <th className="px-6 py-4.5 text-xs font-bold text-surface-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-4.5 text-xs font-bold text-surface-500 uppercase tracking-wider">Fiyat</th>
                <th className="px-6 py-4.5 text-xs font-bold text-surface-500 uppercase tracking-wider text-center">Stok</th>
                <th className="px-6 py-4.5 text-xs font-bold text-surface-500 uppercase tracking-wider text-center">Vitrin</th>
                <th className="px-6 py-4.5 text-xs font-bold text-surface-500 uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {filteredProducts.map((p) => {
                const categoryName = categories.find((c) => c.id === p.category_id)?.name || p.category?.name || "-";
                return (
                  <tr key={p.id} className="hover:bg-surface-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-50 border border-surface-200/50 flex items-center justify-center overflow-hidden shrink-0">
                          <img src={p.image_url} alt={p.name} className="object-contain w-8 h-8 p-0.5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-surface-900 leading-tight">{p.name}</p>
                          <p className="text-[10px] text-surface-400 font-bold mt-0.5">{p.brand} {p.model ? `· ${p.model}` : ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-600 font-semibold">{categoryName}</td>
                    <td className="px-6 py-4 text-sm text-surface-900 font-extrabold">{p.price ? formatPrice(p.price) : "-"}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        p.stock_status === "IN_STOCK"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : p.stock_status === "OUT_OF_STOCK"
                          ? "bg-red-50 text-red-700 border-red-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {p.stock_status === "IN_STOCK" ? "Stokta" : p.stock_status === "OUT_OF_STOCK" ? "Tükendi" : "Siparişte"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        p.is_featured 
                          ? "bg-blue-50 text-blue-700 border border-blue-100" 
                          : "bg-surface-50 text-surface-400 border border-surface-200/50"
                      }`}>
                        {p.is_featured ? "Evet" : "Hayır"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg border border-surface-200 text-surface-500 hover:bg-surface-50 hover:text-surface-900 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-surface-200 shadow-2xl w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-surface-100 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-surface-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary-600" />
                {editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full border border-surface-200 text-surface-400 hover:text-surface-950 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Scroll Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-left">
              {/* Basic Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                    Ürün Adı
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="örn. AirPods Pro 2. Nesil"
                    className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(generateSlug(e.target.value))}
                    placeholder="örn. airpods-pro-2"
                    className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                    Kategori
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none cursor-pointer"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                    Marka
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="örn. Apple"
                    className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                    Model
                  </label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="örn. AirPods Pro 2"
                    className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                    Fiyat (₺)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="9999"
                    className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                    Stok Durumu
                  </label>
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none cursor-pointer"
                  >
                    <option value="IN_STOCK">Stokta Var</option>
                    <option value="OUT_OF_STOCK">Tükendi</option>
                    <option value="ON_ORDER">Siparişte / Yakında</option>
                  </select>
                </div>

                <div className="sm:col-span-2 border-y border-surface-100 py-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider">
                      Ürün Görselleri (Çoklu)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="btn-secondary py-1.5 px-3 text-xs font-bold border border-surface-200 flex items-center gap-1 cursor-pointer"
                    >
                      + Görsel Ekle
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {imagesList.map((imgUrl, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-surface-500 w-16 shrink-0">
                          {index === 0 ? "Kapak Görseli" : `Görsel ${index + 1}`}
                        </span>
                        <input
                          type="text"
                          placeholder="Dosya seçin veya URL girin..."
                          value={imgUrl}
                          onChange={(e) => handleImageUrlChange(index, e.target.value)}
                          className="flex-1 px-4 py-2 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-xs font-semibold transition-all outline-none"
                          required
                        />
                        <label className="btn-secondary py-2 px-3 text-xs font-bold border border-surface-200 rounded-xl cursor-pointer hover:bg-surface-50 flex items-center gap-1 shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingIndex === index ? "Yükleniyor..." : "Dosya Seç"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(index, e)}
                            className="hidden"
                            disabled={uploadingIndex !== null}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRemoveImageUrl(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-red-100 shrink-0"
                          disabled={imagesList.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                    Ürün Açıklaması
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Müşterilere göstermek üzere ürünün kısa ve vurucu açıklamasını girin..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none resize-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-6 py-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded border-surface-300 text-surface-900 focus:ring-surface-900 w-4 h-4"
                    />
                    <span className="text-xs font-bold text-surface-700 uppercase tracking-wider">Ana Sayfada Vitrin</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded border-surface-300 text-surface-900 focus:ring-surface-900 w-4 h-4"
                    />
                    <span className="text-xs font-bold text-surface-700 uppercase tracking-wider">Aktif (Sitede Göster)</span>
                  </label>
                </div>
              </div>

              {/* Technical Specifications Section */}
              <div className="border-t border-surface-100 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-surface-900 uppercase tracking-wider">Teknik Özellikler</h4>
                  <button
                    type="button"
                    onClick={handleAddSpecRow}
                    className="btn-secondary py-1.5 px-3 text-xs font-bold border border-surface-200 flex items-center gap-1 cursor-pointer"
                  >
                    + Özellik Ekle
                  </button>
                </div>

                <div className="space-y-2.5">
                  {specsList.map((spec, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="Örn. ekran veya ram"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                        className="flex-1 px-3 py-2 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-lg text-surface-900 text-xs font-bold transition-all outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Örn. 8 GB"
                        value={spec.val}
                        onChange={(e) => handleSpecChange(index, "val", e.target.value)}
                        className="flex-1 px-3 py-2 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-lg text-surface-900 text-xs font-semibold transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecRow(index)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-100 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-5 border-t border-surface-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary py-2.5 px-4 text-xs font-bold border border-surface-200 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2.5 px-5 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
