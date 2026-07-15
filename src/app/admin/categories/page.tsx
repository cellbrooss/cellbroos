"use client";

import { useState, useEffect } from "react";
import { DataService } from "@/lib/data-service";
import { Layers, Plus, Trash2, Edit3, X, Save, ImageIcon } from "lucide-react";
import { generateSlug } from "@/lib/utils";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [bgColor, setBgColor] = useState("#f5f5f7");

  useEffect(() => {
    setCategories(DataService.getCategories());
    setProducts(DataService.getProducts());
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setDisplayOrder(categories.length + 1);
    setImageUrl("");
    setBgColor("#f5f5f7");
    setModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setDisplayOrder(cat.display_order || 0);
    setImageUrl(cat.image_url || "");
    setBgColor(cat.bg_color || "#f5f5f7");
    setModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!editingCategory) {
      setSlug(generateSlug(val));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      // Edit mode
      const updatedList = categories.map((cat) =>
        cat.id === editingCategory.id
          ? { ...cat, name, slug, description, display_order: Number(displayOrder), image_url: imageUrl || null, bg_color: bgColor }
          : cat
      );
      DataService.saveCategories(updatedList);
      setCategories(updatedList);
    } else {
      // Add mode
      const newCat = {
        id: `cat-${Date.now()}`,
        name,
        slug,
        description,
        display_order: Number(displayOrder),
        image_url: imageUrl || null,
        bg_color: bgColor,
      };
      const updatedList = [...categories, newCat];
      DataService.saveCategories(updatedList);
      setCategories(updatedList);
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const categoryHasProducts = products.some((p) => p.category_id === id);
    if (categoryHasProducts) {
      alert("Bu kategori silinemez! Çünkü bu kategoriye bağlı ürünler bulunmaktadır.");
      return;
    }

    if (confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
      const updatedList = categories.filter((cat) => cat.id !== id);
      DataService.saveCategories(updatedList);
      setCategories(updatedList);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-surface-900 tracking-tight">Kategori Yönetimi</h1>
          <p className="text-sm text-surface-500 font-medium mt-1">Ürünlerinizi düzenlemek için kategoriler ekleyin ve sıralayın.</p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-primary py-3 px-5 text-sm font-bold flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" />
          Yeni Kategori Ekle
        </button>
      </div>

      {/* Category List */}
      <div className="bg-white rounded-2xl border border-surface-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-50/50 border-b border-surface-200/50">
                <th className="px-6 py-4.5 text-xs font-bold text-surface-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-4.5 text-xs font-bold text-surface-500 uppercase tracking-wider">Slug (URL)</th>
                <th className="px-6 py-4.5 text-xs font-bold text-surface-500 uppercase tracking-wider">Açıklama</th>
                <th className="px-6 py-4.5 text-xs font-bold text-surface-500 uppercase tracking-wider text-center">Sıra No</th>
                <th className="px-6 py-4.5 text-xs font-bold text-surface-500 uppercase tracking-wider text-center">Ürün Sayısı</th>
                <th className="px-6 py-4.5 text-xs font-bold text-surface-500 uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {categories
                .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                .map((cat) => {
                  const productCount = products.filter((p) => p.category_id === cat.id).length;
                  return (
                    <tr key={cat.id} className="hover:bg-surface-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg border border-surface-200/50 flex items-center justify-center overflow-hidden shrink-0" style={{ backgroundColor: cat.bg_color || '#f5f5f7' }}>
                            {cat.image_url ? (
                              <img src={cat.image_url} alt={cat.name} className="object-contain w-8 h-8" />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-surface-400" />
                            )}
                          </div>
                          <span className="text-sm font-bold text-surface-900">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-surface-500 font-semibold">{cat.slug}</td>
                      <td className="px-6 py-4 text-sm text-surface-500 font-medium truncate max-w-xs">{cat.description || "-"}</td>
                      <td className="px-6 py-4 text-sm text-surface-900 font-bold text-center">{cat.display_order}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block bg-surface-50 border border-surface-200/60 text-surface-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                          {productCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(cat)}
                            className="p-1.5 rounded-lg border border-surface-200 text-surface-500 hover:bg-surface-50 hover:text-surface-900 transition-all cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-surface-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-surface-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-surface-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary-600" />
                {editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full border border-surface-200 text-surface-400 hover:text-surface-950 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                  Kategori Adı
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="örn. Kılıflar"
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
                  placeholder="örn. kiliflar"
                  className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                  Açıklama
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kategori hakkında kısa açıklama..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                  Kategori Görseli (URL)
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/categories/headphones.png veya https://..."
                  className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
                />
                {imageUrl && (
                  <div className="mt-2 p-3 bg-surface-50 rounded-xl border border-surface-200/60 flex items-center justify-center" style={{ backgroundColor: bgColor }}>
                    <img src={imageUrl} alt="Kategori Önizleme" className="max-h-24 object-contain" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                    Arka Plan Rengi
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-surface-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      placeholder="#f5f5f7"
                      className="flex-1 px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                    Sıralama Önceliği
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    placeholder="örn. 1"
                    className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-surface-100 flex items-center justify-end gap-3">
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
