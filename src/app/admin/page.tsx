"use client";

import { useState, useEffect } from "react";
import { DataService } from "@/lib/data-service";
import { 
  Smartphone, 
  Layers, 
  Settings as SettingsIcon, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    // Load from unified service
    setProducts(DataService.getProducts());
    setCategories(DataService.getCategories());
    setSettings(DataService.getSettings());

    const handleDataChange = () => {
      setProducts(DataService.getProducts());
      setCategories(DataService.getCategories());
      setSettings(DataService.getSettings());
    };

    window.addEventListener("cellbross_data_changed", handleDataChange);
    return () => window.removeEventListener("cellbross_data_changed", handleDataChange);
  }, []);

  if (!settings) return null;

  // Stats calculation
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const inStockCount = products.filter(p => p.stock_status === "IN_STOCK").length;
  const outOfStockProducts = products.filter(p => p.stock_status === "OUT_OF_STOCK" || p.stock_status === "ON_ORDER");

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-surface-900 tracking-tight">Genel Bakış</h1>
        <p className="text-sm text-surface-500 font-medium mt-1">Mağazanızın durumunu ve stok özetlerini buradan takip edin.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stat 1 */}
        <div className="bg-white rounded-2xl border border-surface-200/80 p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-surface-500 uppercase tracking-wider">Toplam Ürün</p>
            <p className="text-3xl font-black text-surface-900 mt-1">{totalProducts}</p>
            <Link href="/admin/products" className="text-xs text-primary-600 hover:text-primary-700 font-bold inline-flex items-center gap-0.5 mt-2.5">
              Ürünleri Yönet <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Smartphone className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white rounded-2xl border border-surface-200/80 p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-surface-500 uppercase tracking-wider">Kategoriler</p>
            <p className="text-3xl font-black text-surface-900 mt-1">{totalCategories}</p>
            <Link href="/admin/categories" className="text-xs text-primary-600 hover:text-primary-700 font-bold inline-flex items-center gap-0.5 mt-2.5">
              Kategorileri Yönet <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white rounded-2xl border border-surface-200/80 p-6 flex items-center justify-between shadow-sm sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-xs font-bold text-surface-500 uppercase tracking-wider">Aktif Stok Oranı</p>
            <p className="text-3xl font-black text-surface-900 mt-1">
              {totalProducts > 0 ? `${Math.round((inStockCount / totalProducts) * 100)}%` : "0%"}
            </p>
            <p className="text-xs text-surface-400 font-semibold mt-3">
              {inStockCount} ürün stokta aktif satılabilir durumda.
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Stock Alerts */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-surface-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-surface-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Stok Uyarıları & Durumları
              </h2>
              <span className="text-[11px] font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-100">
                {outOfStockProducts.length} Kritik Durum
              </span>
            </div>

            {outOfStockProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-500 mb-3" />
                <p className="font-bold text-surface-900">Mükemmel!</p>
                <p className="text-xs text-surface-500 font-medium mt-0.5">Tüm ürünlerinizin stoğu güncel durumda.</p>
              </div>
            ) : (
              <div className="divide-y divide-surface-100">
                {outOfStockProducts.map((p) => (
                  <div key={p.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg bg-surface-50 border border-surface-200/50 flex items-center justify-center overflow-hidden">
                        <img src={p.image_url} alt={p.name} className="object-contain w-10 h-10 p-1" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-surface-900">{p.name}</p>
                        <p className="text-[11px] text-surface-500 font-medium mt-0.5">{p.brand} · {p.category?.name || "Kategorisiz"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                        p.stock_status === "OUT_OF_STOCK" 
                          ? "bg-red-50 text-red-700 border-red-100" 
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {p.stock_status === "OUT_OF_STOCK" ? "Tükendi" : "Siparişte"}
                      </span>
                      <Link href={`/admin/products`} className="p-1.5 rounded-lg border border-surface-200 text-surface-500 hover:bg-surface-50 hover:text-surface-900 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Store Info & Quick Links */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Info Box */}
          <div className="bg-white rounded-2xl border border-surface-200/80 p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-surface-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" />
              Mağaza Durumu
            </h2>
            
            {/* Active Announcement Banner */}
            {settings.announcement_active && settings.announcement_text && (
              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 space-y-2">
                <span className="text-[9px] font-black tracking-wider uppercase text-blue-700 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-md">
                  Aktif Duyuru Bandı
                </span>
                <p className="text-xs text-blue-900 font-semibold leading-relaxed">
                  "{settings.announcement_text}"
                </p>
              </div>
            )}

            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center text-xs font-semibold text-surface-500 border-b border-surface-50 pb-2">
                <span>Telefon</span>
                <span className="text-surface-800 font-bold">{settings.phone}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-surface-500 border-b border-surface-50 pb-2">
                <span>WhatsApp</span>
                <span className="text-surface-800 font-bold">{settings.whatsapp}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-surface-500">
                <span>Konum</span>
                <span className="text-surface-800 font-bold truncate max-w-[180px]">{settings.address}</span>
              </div>
            </div>

            <Link href="/admin/settings" className="w-full btn-secondary text-sm py-2.5 font-bold flex items-center justify-center gap-1.5 border border-surface-200 hover:bg-surface-50">
              <SettingsIcon className="w-4 h-4" />
              Ayarları Güncelle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
