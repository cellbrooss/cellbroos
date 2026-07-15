"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, MessageCircle, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import * as Lucide from "lucide-react";
import { DataService } from "@/lib/data-service";
import ProductCard from "@/components/product/ProductCard";
import BrandsMarquee from "@/components/ui/BrandsMarquee";

// Premium Animation Presets
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as any // Sleek Apple-style cubic-bezier ease-out
    }
  }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

export default function Home() {
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const categories = DataService.getCategories();
  const displayCats = categories.slice(0, 6);

  const goTo = useCallback((idx: number, dir: 1 | -1 = 1) => {
    setDirection(dir);
    setActiveIndex(idx);
  }, []);

  const next = useCallback(() => {
    const nextIdx = (activeIndex + 1) % displayCats.length;
    goTo(nextIdx, 1);
  }, [activeIndex, displayCats.length, goTo]);

  const prev = useCallback(() => {
    const prevIdx = (activeIndex - 1 + displayCats.length) % displayCats.length;
    goTo(prevIdx, -1);
  }, [activeIndex, displayCats.length, goTo]);

  useEffect(() => {
    if (isPaused || displayCats.length <= 1) return;
    timerRef.current = setTimeout(next, 3500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [activeIndex, isPaused, next, displayCats.length]);

  useEffect(() => {
    setStore(DataService.getSettings());
    setProducts(DataService.getProducts());

    const handleDataChange = () => {
      setStore(DataService.getSettings());
      setProducts(DataService.getProducts());
    };

    window.addEventListener("cellbross_data_changed", handleDataChange);
    return () => window.removeEventListener("cellbross_data_changed", handleDataChange);
  }, []);

  if (!store) return null;

  const featuredProducts = products.filter((p) => p.is_featured && p.is_active !== false);

  const renderWhyUsIcon = (iconName: string) => {
    const Icon = (Lucide as any)[iconName] || Lucide.HelpCircle;
    return <Icon className="w-6 h-6 text-surface-900" />;
  };

  const currentBgColor = displayCats[activeIndex]?.bg_color || "#ffffff";

  return (
    <div 
      className="relative overflow-hidden min-h-screen"
      style={{
        backgroundColor: currentBgColor,
        transition: "background-color 1.2s cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
            className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left z-10"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-surface-900 mb-6 leading-[1.1]">
              Teknolojinin <br className="hidden lg:inline" />
              <span className="text-[#0066cc]">En İnce Hali</span> <br />
              Şimdi Mağazamızda
            </h1>
            <p className="text-base sm:text-lg text-surface-500 mb-8 max-w-lg leading-relaxed font-medium">
              En yeni jenerasyon akıllı telefonları fotoğraflarıyla inceleyin. Fiziksel mağazamıza gelmeden önce stok durumunu kontrol edin ve WhatsApp üzerinden anında rezervasyon yapın.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href="/urunler" className="btn-primary w-full sm:w-auto group">
                Ürünleri Keşfet
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href={store.google_maps_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full sm:w-auto"
              >
                <MapPin className="w-4 h-4 text-surface-500" />
                Yol Tarifi Al
              </a>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-surface-200 w-full">
              <div>
                <p className="text-xl font-bold text-surface-900">100%</p>
                <p className="text-[11px] text-surface-500 font-medium mt-0.5">Orijinal Ürünler</p>
              </div>
              <div>
                <p className="text-xl font-bold text-surface-900">Hızlı</p>
                <p className="text-[11px] text-surface-500 font-medium mt-0.5">WhatsApp Yanıtı</p>
              </div>
              <div>
                <p className="text-xl font-bold text-surface-900">Anında</p>
                <p className="text-[11px] text-surface-500 font-medium mt-0.5">WhatsApp Destek</p>
              </div>
            </div>
          </motion.div>

          {/* Hero — Phone Showcase (seamless, giant, floating) */}
          {displayCats.length > 0 && (() => {
            const activeCat = displayCats[activeIndex];
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as any, delay: 0.15 }}
                className="lg:col-span-7 w-full relative flex items-center justify-center"
                style={{ height: "clamp(500px, 75vh, 680px)" }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <AnimatePresence mode="wait">
                  <motion.a
                    key={activeCat?.id ?? activeIndex}
                    href={`/urunler?kategori=${activeCat?.slug}`}
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)", y: 20 }}
                    animate={{ opacity: 1, scale: 1.08, filter: "blur(0px)", y: 0 }}
                    exit={{ opacity: 0, scale: 1.15, filter: "blur(10px)", y: -20 }}
                    transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] as any }}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    style={{ willChange: "transform, opacity, filter" }}
                  >
                    {activeCat?.image_url ? (
                      <motion.div
                        className="relative w-full h-full scale-110"
                        animate={{
                          y: [0, -12, 0],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        whileHover={{ scale: 1.05, y: -18 }}
                      >
                        <Image
                          src={activeCat.image_url}
                          alt={activeCat.name}
                          fill
                          className="object-contain mix-blend-multiply select-none pointer-events-none"
                          sizes="(max-width: 768px) 95vw, 55vw"
                          priority
                        />
                      </motion.div>
                    ) : null}
                  </motion.a>
                </AnimatePresence>
              </motion.div>
            );
          })()}

        </div>
      </section>

      <BrandsMarquee brands={store.brands} />


      {/* Why Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={fadeUp}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-surface-900 tracking-tight mb-4">
            Neden {store.logo_text || store.name || "CellBroos"}?
          </h2>
          <p className="text-surface-500 font-medium text-base">
            Fiziksel mağazamızda müşterilerimize sunduğumuz ayrıcalıkları keşfedin.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {(store.why_us && Array.isArray(store.why_us) ? store.why_us : [
            {
              title: "Garantili & Faturalı",
              desc: "Tüm ürünlerimiz distribütör garantili, orijinal kutusunda ve adınıza faturalı olarak teslim edilir.",
              icon: "Award"
            },
            {
              title: "Güvenilir Alışveriş",
              desc: "Ürünü mağazamızda fiziki olarak test edin, uzman kadromuz eşliğinde güvenle satın alın.",
              icon: "ShieldCheck"
            },
            {
              title: "Satış Sonrası Destek",
              desc: "Veri transferi, kurulum ve aksesuarlarla ilgili her türlü sorunuzda daima yanınızdayız.",
              icon: "HeartHandshake"
            }
          ]).map((item: any, idx: number) => (
            <motion.div key={idx} variants={fadeUp} className="card p-8 hover:border-surface-500 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-surface-50 flex items-center justify-center mb-6 border border-surface-200">
                {renderWhyUsIcon(item.icon)}
              </div>
              <h3 className="text-lg font-bold text-surface-900 mb-3">{item.title}</h3>
              <p className="text-surface-500 text-sm leading-relaxed font-medium">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-surface-200">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4"
        >
          <div>
            <h2 className="text-3xl font-bold text-surface-900 tracking-tight mb-3">
              {store.featured_title || "Öne Çıkan Telefonlar"}
            </h2>
            <p className="text-surface-500 font-medium text-sm max-w-lg">
              Stoklarımıza yeni giren ve en çok talep gören amiral gemisi modelleri inceleyin.
            </p>
          </div>
          <Link
            href="/urunler"
            className="btn-secondary !py-2.5 !px-4 text-xs font-semibold flex items-center gap-1.5 text-surface-950 hover:bg-surface-100"
          >
            Tümünü Gör
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuredProducts.map((product) => (
            <motion.div key={product.id} variants={fadeUp}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* WhatsApp CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="relative overflow-hidden p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 bg-surface-900 text-white rounded-3xl border-0 shadow-lg"
        >
          <div className="z-10 max-w-xl text-center md:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
              Aradığınız Modeli Bulamadınız mı?
            </h2>
            <p className="text-surface-500 text-sm md:text-base leading-relaxed font-medium">
              Özel siparişler, renk seçenekleri veya anlık stok durumu sorgulamaları için WhatsApp destek hattımızdan bizimle hemen iletişime geçin.
            </p>
          </div>
          
          <div className="z-10 flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
            <a
              href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}?text=Merhaba,%20stoktaki%20telefonlar%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full sm:w-auto"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              WhatsApp'tan Yazın
            </a>
            <a
              href={`tel:${store.phone}`}
              className="btn-secondary !bg-white !text-surface-900 !border-0 hover:!bg-surface-100 w-full sm:w-auto"
            >
              <Phone className="w-5 h-5 text-surface-900" />
              Bizi Arayın
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
