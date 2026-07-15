"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Smartphone,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";
import { DataService } from "@/lib/data-service";

export default function Footer() {
  const [store, setStore] = useState<any>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setStore(DataService.getSettings());

    const handleDataChange = () => {
      setStore(DataService.getSettings());
    };

    window.addEventListener("cellbross_data_changed", handleDataChange);
    return () => window.removeEventListener("cellbross_data_changed", handleDataChange);
  }, []);

  if (!store) return null;

  return (
    <footer className="relative mt-auto">
      {/* Top glow line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />

      <div className="bg-white/90 backdrop-blur-md border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                {store.logo_url ? (
                  <img src={store.logo_url} alt={store.name} className="w-9 h-9 object-contain rounded-xl" />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-white" />
                  </div>
                )}
                <span className="text-lg font-bold gradient-text">
                  {store.logo_text || store.name || "CellBroos"}
                </span>
              </Link>
              <p className="text-sm text-slate-600 leading-relaxed">
                En yeni akıllı telefonlar, güvenilir hizmet ve uzman kadromuzla
                size en iyi deneyimi sunuyoruz.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                Hızlı Bağlantılar
              </h3>
              <ul className="space-y-2.5">
                {[
                  { href: "/urunler", label: "Tüm Ürünler" },
                  { href: "/urunler?kategori=iphone", label: "iPhone" },
                  { href: "/urunler?kategori=samsung", label: "Samsung" },
                  { href: "/hakkimizda", label: "Hakkımızda" },
                  { href: "/iletisim", label: "İletişim" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-primary-600 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                İletişim
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-600">{store.address}</span>
                </li>
                <li>
                  <a
                     href={`tel:${store.phone}`}
                    className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-primary-600 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                    {store.phone}
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                  <div className="text-sm text-slate-600 space-y-1">
                    {store.working_hours?.mon && (
                      <p>Pzt-Cum: {store.working_hours.mon.open} - {store.working_hours.mon.close}</p>
                    )}
                    {store.working_hours?.sat ? (
                      <p>Cumartesi: {store.working_hours.sat.open} - {store.working_hours.sat.close}</p>
                    ) : (
                      <p>Cumartesi: Kapalı</p>
                    )}
                    {store.working_hours?.sun ? (
                      <p>Pazar: {store.working_hours.sun.open} - {store.working_hours.sun.close}</p>
                    ) : (
                      <p>Pazar: Kapalı</p>
                    )}
                  </div>
                </li>
              </ul>
            </div>

            {/* Social & Map CTA */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                Bizi Takip Edin
              </h3>
              <div className="flex gap-2 mb-6">
                {store.social_links?.instagram && (
                  <a
                    href={store.social_links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-primary-600 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20 group"
                    aria-label="Instagram"
                  >
                    <svg className="w-4 h-4 fill-current text-slate-600 group-hover:text-white" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                )}
                {store.social_links?.facebook && (
                  <a
                    href={store.social_links.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-primary-600 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20 group"
                    aria-label="Facebook"
                  >
                    <svg className="w-4 h-4 fill-current text-slate-600 group-hover:text-white" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
                {store.social_links?.tiktok && (
                  <a
                    href={store.social_links.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-primary-600 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20 group"
                    aria-label="TikTok"
                  >
                    <svg className="w-4 h-4 fill-current text-slate-600 group-hover:text-white" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.43-.43-.64-.67-.07 3.26-.03 6.52-.05 9.77-.04 1.41-.43 2.85-1.22 4.01-1.36 2.05-3.86 3.16-6.31 2.89-2.51-.23-4.83-1.89-5.71-4.27-.97-2.53-.45-5.59 1.35-7.66 1.48-1.75 3.8-2.61 6.09-2.3v4.12c-1.48-.24-3.08.24-3.99 1.48-.9 1.17-.99 2.85-.29 4.14.7 1.34 2.24 2.14 3.76 1.93 1.41-.15 2.62-1.18 2.92-2.58.12-.58.09-1.18.09-1.77V.02z" />
                    </svg>
                  </a>
                )}
              </div>
              <a
                href={store.google_maps_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm w-full"
              >
                <MapPin className="w-4 h-4" />
                Yol Tarifi Al
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              © {currentYear} {store.name}. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <Link
                href="/kvkk"
                className="hover:text-slate-700 transition-colors"
              >
                KVKK Aydınlatma Metni
              </Link>
              <Link
                href="/cerez-politikasi"
                className="hover:text-slate-700 transition-colors"
              >
                Çerez Politikası
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
