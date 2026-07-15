"use client";

import { useState, useEffect } from "react";
import { MapPin, Phone, MessageCircle, Clock, Navigation } from "lucide-react";
import { DataService } from "@/lib/data-service";
import { isStoreOpen } from "@/lib/utils";

export default function ContactPage() {
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    setStore(DataService.getSettings());

    const handleDataChange = () => {
      setStore(DataService.getSettings());
    };

    window.addEventListener("cellbross_data_changed", handleDataChange);
    return () => window.removeEventListener("cellbross_data_changed", handleDataChange);
  }, []);

  const storeStatus = store
    ? isStoreOpen(store.working_hours as Record<string, { open: string; close: string } | null>)
    : { isOpen: false };

  const dayNames: Record<string, string> = {
    mon: "Pazartesi",
    tue: "Salı",
    wed: "Çarşamba",
    thu: "Perşembe",
    fri: "Cuma",
    sat: "Cumartesi",
    sun: "Pazar",
  };

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="w-8 h-8 border-4 border-surface-200 border-t-surface-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden grid-pattern min-h-screen py-16 bg-slate-50/20">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Bize <span className="gradient-text">Ulaşın</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
            Fiziksel mağazamıza ait iletişim kanalları, çalışma saatleri ve yol tarifi bilgileri.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="card p-6 md:p-8 space-y-6">
              {/* Live Status Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-sm font-bold text-slate-800">Mağaza Durumu</span>
                <div className={storeStatus.isOpen ? "badge-open" : "badge-closed"}>
                  <span className={`w-1.5 h-1.5 rounded-full ${storeStatus.isOpen ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                  <span>{storeStatus.isOpen ? "Şu An Açık" : "Şu An Kapalı"}</span>
                </div>
              </div>

              {/* Info Items */}
              <div className="space-y-4">
                {/* Phone */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-600 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Müşteri Hattı</p>
                    <a href={`tel:${store.phone}`} className="text-sm font-bold text-slate-900 hover:text-primary-600 transition-colors">
                      {store.phone}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">WhatsApp Destek</p>
                    <a
                      href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors"
                    >
                      {store.whatsapp}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-600 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Mağaza Adresi</p>
                    <p className="text-sm font-bold text-slate-900 leading-relaxed">
                      {store.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media Link Box */}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-3 font-semibold">Sosyal Medyada Biz</p>
                <div className="flex gap-2">
                  <a
                    href={store.social_links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-primary-600 flex items-center justify-center transition-all group"
                  >
                    <svg className="w-4 h-4 fill-current text-slate-600 group-hover:text-white" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                  <a
                    href={store.social_links.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-primary-600 flex items-center justify-center transition-all group"
                  >
                    <svg className="w-4 h-4 fill-current text-slate-600 group-hover:text-white" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Navigation / Navigation Apps Link */}
            <div className="card p-6 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-primary-600" />
                Harita Uygulamalarıyla Aç
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={store.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary !py-2.5 text-xs text-center font-bold"
                >
                  Google Haritalar
                </a>
                <a
                  href={`https://maps.apple.com/?daddr=${store.map_coordinates}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary !py-2.5 text-xs text-center font-bold"
                >
                  Apple Haritalar
                </a>
              </div>
            </div>
          </div>

          {/* Working Hours & Map Layout */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Working Hours Card */}
            <div className="card p-6 md:p-8">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-6">
                <Clock className="w-4 h-4 text-primary-600" />
                Haftalık Çalışma Saatleri
              </h3>
              <div className="space-y-3">
                {Object.entries(store.working_hours).map(([dayKey, hours]: [string, any]) => (
                  <div key={dayKey} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-xs font-semibold text-slate-500">{dayNames[dayKey]}</span>
                    <span className="text-xs font-bold text-slate-800">
                      {hours ? `${hours.open} - ${hours.close}` : "Kapalı"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Mock/Placeholder with styling */}
            <div className="card h-[300px] overflow-hidden relative bg-white border border-slate-200 flex items-center justify-center p-6 text-center shadow-lg shadow-slate-100/50">
              <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent pointer-events-none" />
              <div className="z-10">
                <MapPin className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-bounce" />
                <h4 className="text-sm font-bold text-slate-900 mb-2">CellBroos Merkez Şubesi</h4>
                <p className="text-xs text-slate-500 max-w-sm mb-4 font-semibold">
                  {store.address}
                </p>
                <a
                  href={store.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
                >
                  Tarif Al
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
