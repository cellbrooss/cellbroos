"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { formatPrice, getStockLabel } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string;
    price: number | null;
    stock_status: string;
    image_url?: string | null;
    category: { name: string; slug: string };
  };
  onCompareToggle?: (id: string) => void;
  isComparing?: boolean;
}

export default function ProductCard({
  product,
  onCompareToggle,
  isComparing = false,
}: ProductCardProps) {
  const stockInfo = getStockLabel(product.stock_status);
  const isInStock = product.stock_status === "IN_STOCK";

  return (
    <div className="card-hover overflow-hidden flex flex-col h-full group relative">
      {/* Compare Checkbox */}
      {onCompareToggle && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCompareToggle(product.id);
          }}
          className={`absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border ${
            isComparing
              ? "bg-surface-900 border-surface-900 text-white"
              : "bg-white/90 border-surface-200 text-surface-500 hover:border-surface-900 hover:text-surface-900"
          }`}
          title="Karşılaştır"
        >
          {isComparing ? (
            <Check className="w-4 h-4" />
          ) : (
            <span className="text-sm font-semibold leading-none">+</span>
          )}
        </button>
      )}

      {/* Product Image */}
      <Link href={`/urunler/${product.slug}`} className="block relative aspect-square w-full bg-surface-50 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-surface-200 group-hover:text-surface-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Stock badge overlay */}
        {!isInStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-white border border-surface-200 text-surface-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              {stockInfo.text}
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-bold text-surface-500 uppercase tracking-widest">
            {product.brand}
          </span>
          {isInStock && (
            <span className="text-[10px] font-bold tracking-wider text-emerald-600 uppercase">
              Stokta Var
            </span>
          )}
        </div>

        <h3 className="text-sm font-bold text-surface-900 mb-4 group-hover:text-[#0066cc] transition-colors duration-200 line-clamp-1">
          {product.name}
        </h3>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-surface-100">
          <div>
            <p className="text-[10px] text-surface-500 uppercase tracking-wider font-medium">Başlangıç</p>
            <p className="text-base font-bold text-surface-900 mt-0.5">
              {product.price ? formatPrice(product.price) : "Fiyat Sorun"}
            </p>
          </div>
          <Link
            href={`/urunler/${product.slug}`}
            className="w-9 h-9 rounded-full bg-surface-50 group-hover:bg-[#0066cc] flex items-center justify-center transition-all duration-300 border border-surface-200 group-hover:border-[#0066cc]"
          >
            <ArrowRight className="w-4 h-4 text-surface-900 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
