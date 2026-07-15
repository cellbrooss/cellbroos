"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MessageCircle, Phone, QrCode, ChevronLeft, ChevronRight } from "lucide-react";
import { DataService } from "@/lib/data-service";
import { formatPrice, getStockLabel } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const [productUrl, setProductUrl] = useState("");
  const [showQrModal, setShowQrModal] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setProductUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    const getRelated = (allP: any[], current: any) => {
      const sameCategory = allP.filter(
        (p) => p.category_id === current.category_id && p.slug !== current.slug && p.is_active !== false
      );
      if (sameCategory.length >= 4) return sameCategory.slice(0, 4);
      // top up with other categories (shuffled by display_order)
      const others = allP.filter(
        (p) => p.category_id !== current.category_id && p.slug !== current.slug && p.is_active !== false
      );
      return [...sameCategory, ...others].slice(0, 4);
    };

    const allProducts = DataService.getProducts();
    const foundProduct = allProducts.find((p) => p.slug === slug) || null;
    setProduct(foundProduct);
    setStore(DataService.getSettings());
    if (foundProduct) {
      setActiveImage(foundProduct.image_url || "");
      setRelatedProducts(getRelated(allProducts, foundProduct));
    }
    setLoading(false);

    const handleDataChange = () => {
      const allP = DataService.getProducts();
      const updatedProduct = allP.find((p) => p.slug === slug) || null;
      setProduct(updatedProduct);
      setStore(DataService.getSettings());
      if (updatedProduct) {
        setActiveImage(updatedProduct.image_url || "");
        setRelatedProducts(getRelated(allP, updatedProduct));
      }
    };

    window.addEventListener("cellbross_data_changed", handleDataChange);
    return () => window.removeEventListener("cellbross_data_changed", handleDataChange);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="w-8 h-8 border-4 border-surface-200 border-t-surface-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="card p-10 text-center max-w-md">
          <h2 className="text-xl font-bold text-surface-900 mb-2">Ürün Bulunamadı</h2>
          <p className="text-surface-500 mb-6 font-medium">
            Aradığınız ürün mağazamızda mevcut değil veya kaldırılmış olabilir.
          </p>
          <Link href="/urunler" className="btn-primary w-full">
            Ürünlere Dön
          </Link>
        </div>
      </div>
    );
  }

  const stockInfo = getStockLabel(product.stock_status);
  const isInStock = product.stock_status === "IN_STOCK";
  const waMessage = `Merhaba, ${product.brand} ${product.name} modelinizin stok durumu hakkında detaylı bilgi alabilir miyim?`;
  const waLink = `https://wa.me/${store.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(waMessage)}`;
  const specs = product.specs as Record<string, string> | null;

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Link */}
        <div className="mb-10">
          <Link
            href="/urunler"
            className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Ürün Listesine Dön
          </Link>
        </div>

        {/* Product Details Grid: Left = Images | Right = Info + Specs + CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* ─── Left: Image Gallery ─── */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square bg-surface-50 rounded-3xl border border-surface-200 overflow-hidden flex items-center justify-center p-8 group">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  className="object-contain p-10 transition-all duration-300"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <svg className="w-32 h-32 text-surface-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}

              {/* Prev/Next arrows */}
              {Array.isArray(product.images) && product.images.length > 1 && (() => {
                const imgs: string[] = product.images;
                const currentIdx = imgs.indexOf(activeImage);
                const goPrev = () => setActiveImage(imgs[(currentIdx - 1 + imgs.length) % imgs.length]);
                const goNext = () => setActiveImage(imgs[(currentIdx + 1) % imgs.length]);
                return (
                  <>
                    <button onClick={goPrev} aria-label="Önceki görsel"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/70 hover:bg-white border border-surface-200 flex items-center justify-center text-surface-400 hover:text-surface-900 transition-all opacity-0 group-hover:opacity-100 shadow-sm cursor-pointer backdrop-blur-sm z-10">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={goNext} aria-label="Sonraki görsel"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/70 hover:bg-white border border-surface-200 flex items-center justify-center text-surface-400 hover:text-surface-900 transition-all opacity-0 group-hover:opacity-100 shadow-sm cursor-pointer backdrop-blur-sm z-10">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                );
              })()}

              {/* Out of stock overlay */}
              {!isInStock && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <span className="bg-white border border-surface-200 text-surface-900 text-sm font-bold px-4 py-2 rounded-full shadow">
                    {stockInfo.text}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {Array.isArray(product.images) && product.images.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 rounded-2xl bg-surface-50 border p-2 overflow-hidden flex items-center justify-center transition-all cursor-pointer ${
                      activeImage === img
                        ? "border-surface-900 ring-2 ring-surface-900/10 scale-95"
                        : "border-surface-200 hover:border-surface-400"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} - Görsel ${idx + 1}`} fill className="object-contain p-1" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Right: Info + All Specs + CTA ─── */}
          <div className="lg:col-span-6 flex flex-col gap-6">

            {/* Brand + Stock + Title + Description */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#0066cc] uppercase tracking-widest">{product.brand}</span>
                <span className={`text-xs font-bold uppercase tracking-wider ${isInStock ? "text-emerald-600" : "text-amber-600"}`}>
                  {stockInfo.text}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight mb-4 leading-tight">
                {product.name}
              </h1>
              <p className="text-surface-500 font-medium leading-relaxed text-sm">
                {product.description}
              </p>
            </div>

            {/* All Specs — full list in right column */}
            {specs && Object.keys(specs).length > 0 && (
              <div className="bg-surface-50 rounded-2xl border border-surface-200/60 overflow-hidden">
                <div className="px-4 py-3 border-b border-surface-200/60">
                  <p className="text-[10px] font-bold text-surface-500 uppercase tracking-widest">Teknik Özellikler</p>
                </div>
                <div className="divide-y divide-surface-200/40">
                  {Object.entries(specs).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between px-4 py-3">
                      <span className="text-xs font-semibold text-surface-500 capitalize shrink-0">{key}</span>
                      <span className="text-xs font-bold text-surface-900 text-right ml-4 leading-snug">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="border-y border-surface-100 py-5">
              <p className="text-[10px] text-surface-500 uppercase tracking-widest font-semibold mb-1">
                Yaklaşık Başlangıç Fiyatı
              </p>
              <p className="text-4xl font-bold text-surface-900 tracking-tight">
                {product.price ? formatPrice(product.price) : "Lütfen Sorunuz"}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3">
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="btn-whatsapp w-full justify-center py-3.5 text-sm font-semibold">
                <MessageCircle className="w-5 h-5 fill-current" />
                WhatsApp ile Sor / Rezervasyon Yap
              </a>
              <a href={`tel:${store.phone}`} className="btn-secondary w-full justify-center py-3.5 text-sm font-semibold">
                <Phone className="w-4 h-4 text-surface-500" />
                Mağazayı Ara
              </a>
            </div>

            {/* QR Code trigger */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowQrModal(true)}
                className="btn-ghost text-xs text-surface-500 hover:text-surface-900 flex items-center gap-1.5"
              >
                <QrCode className="w-4 h-4" />
                Mağaza İçi QR Kod Oluştur
              </button>
            </div>
          </div>
        </div>

        {/* ─── Related Products ─── */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-surface-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-extrabold text-surface-900 tracking-tight">Benzer Ürünler</h2>
              <Link href="/urunler" className="text-sm font-bold text-surface-500 hover:text-surface-900 transition-colors">
                Tümünü Gör →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => {
                const relStock = getStockLabel(rel.stock_status);
                const relInStock = rel.stock_status === "IN_STOCK";
                return (
                  <Link
                    key={rel.id}
                    href={`/urunler/${rel.slug}`}
                    className="group bg-white rounded-2xl border border-surface-200 hover:border-surface-300 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-surface-50 flex items-center justify-center p-4">
                      {rel.image_url ? (
                        <Image
                          src={rel.image_url}
                          alt={rel.name}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <svg className="w-12 h-12 text-surface-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      )}
                      {/* Stock badge */}
                      <span className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        relInStock
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {relStock.text}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-3 flex flex-col gap-1 flex-1">
                      <span className="text-[10px] font-bold text-[#0066cc] uppercase tracking-widest">{rel.brand}</span>
                      <p className="text-sm font-bold text-surface-900 leading-snug line-clamp-2">{rel.name}</p>
                      <p className="text-sm font-extrabold text-surface-900 mt-auto pt-2">
                        {rel.price ? formatPrice(rel.price) : "Sorunuz"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-surface-100 shadow-2xl max-w-xs w-full p-8 flex flex-col items-center text-center">
            <h3 className="text-base font-bold text-surface-900 mb-2">Mağaza İçi QR Kodu</h3>
            <p className="text-xs text-surface-500 mb-6 font-medium">
              Fiziksel mağazamızda bu ürün sayfasını telefonunuzdan açmak için taratın.
            </p>
            <div className="bg-surface-50 p-4 rounded-2xl mb-6 border border-surface-100">
              {productUrl && <QRCodeSVG value={productUrl} size={160} level="M" />}
            </div>
            <button onClick={() => setShowQrModal(false)} className="btn-secondary w-full text-xs py-2.5">
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
