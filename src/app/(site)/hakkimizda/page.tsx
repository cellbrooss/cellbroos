"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Smartphone, Award, Star, Compass } from "lucide-react";
import { DataService } from "@/lib/data-service";

export default function AboutPage() {
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    setStore(DataService.getSettings());

    const handleDataChange = () => {
      setStore(DataService.getSettings());
    };

    window.addEventListener("cellbross_data_changed", handleDataChange);
    return () => window.removeEventListener("cellbross_data_changed", handleDataChange);
  }, []);

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="w-8 h-8 border-4 border-surface-200 border-t-surface-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden grid-pattern min-h-screen py-16 bg-slate-50/20">
      {/* Glow effect */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Hakkımızda — <span className="gradient-text">CellBroos</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
            Güvenilir mobil teknolojinin yerel adresi.
          </p>
        </div>

        {/* Brand Story */}
        <div className="card p-8 md:p-10 mb-10 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary-600" />
            Biz Kimiz?
          </h2>
          <p className="text-slate-700 text-sm md:text-base leading-relaxed">
            CellBroos, mobil cihaz ve teknoloji sektöründeki geniş deneyimimizle, en son akıllı telefon modellerini, premium aksesuarları ve kaliteli danışmanlık hizmetini fiziksel mağazamızda müşterilerimizle buluşturmak amacıyla kuruldu.
          </p>
          <p className="text-slate-700 text-sm md:text-base leading-relaxed">
            E-ticaretin getirdiği sanal bariyerler yerine, müşterilerimizi doğrudan fiziksel mağazamıza çekerek alacakları cihaza dokunmalarını, onu test etmelerini ve veri transferinden kuruluma kadar her türlü işlemde yüz yüze kaliteli hizmet almalarını hedefliyoruz.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="card p-6">
            <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-600 mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Vizyonumuz</h3>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
              En son teknolojiye sahip cihazları şeffaf fiyatlandırma politikasıyla ve kusursuz müşteri odaklı yaklaşımımızla sunarak bölgenin en çok tercih edilen yerel teknoloji noktası olmak.
            </p>
          </div>

          <div className="card p-6">
            <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center text-accent-600 mb-4">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Misyonumuz</h3>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
              Müşterilerimizin bütçesine ve ihtiyacına en uygun cihazı belirlemek, satış öncesinde ve sonrasında tüm veri aktarımı ile cihaz kurulum işlemlerinde uzman destek sağlayarak güven aşılamak.
            </p>
          </div>
        </div>

        {/* In-Store Callout */}
        <div className="card p-8 bg-gradient-to-r from-primary-50/50 via-white to-white border-slate-200 text-center flex flex-col items-center gap-6 shadow-md">
          <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-600">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Sizi Mağazamıza Bekliyoruz</h3>
            <p className="text-slate-600 text-xs md:text-sm max-w-md mx-auto mb-6 font-semibold">
              Özel modellerimizi yerinde incelemek, fiyat teklifi almak ve güler yüzlü ekibimizle tanışmak için bizi ziyaret edin.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/iletisim" className="btn-primary text-xs py-2 px-5">
                Konum ve Çalışma Saatleri
              </Link>
              <a href={`tel:${store.phone}`} className="btn-secondary text-xs py-2 px-5">
                Mağazayı Ara
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
