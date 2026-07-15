"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface BrandsMarqueeProps {
  brands?: string[];
}

export default function BrandsMarquee({ brands }: BrandsMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const brandList = brands && brands.length > 0
    ? brands.map(name => ({
        name,
        logo: `https://cdn.simpleicons.org/${name.toLowerCase().replace(/\s+/g, "")}/1d1d1f`
      }))
    : [
        { name: "Apple",    logo: "https://cdn.simpleicons.org/apple/1d1d1f" },
        { name: "Samsung",  logo: "https://cdn.simpleicons.org/samsung/1d1d1f" },
        { name: "Xiaomi",   logo: "https://cdn.simpleicons.org/xiaomi/1d1d1f" },
        { name: "Huawei",   logo: "https://cdn.simpleicons.org/huawei/1d1d1f" },
        { name: "Oppo",     logo: "https://cdn.simpleicons.org/oppo/1d1d1f" },
        { name: "OnePlus",  logo: "https://cdn.simpleicons.org/oneplus/1d1d1f" },
        { name: "Realme",   logo: "https://cdn.simpleicons.org/realme/1d1d1f" }
      ];

  return (
    <section className="relative border-y border-surface-200 bg-surface-50/40 py-8 overflow-hidden">
      {/* Left fade edge */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-28 z-10 bg-gradient-to-r from-[#f5f5f7] to-transparent" />
      {/* Right fade edge */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-28 z-10 bg-gradient-to-l from-[#f5f5f7] to-transparent" />

      {/* Outer clip container */}
      <div className="flex overflow-hidden">
        {/* Track — repeated twice for seamless loop */}
        <motion.div
          ref={trackRef}
          className="flex shrink-0 gap-14 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 28,
              ease: "linear",
            },
          }}
          style={{ width: "200%" }}
        >
          {[...brandList, ...brandList].map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              className="flex flex-col items-center gap-2.5 shrink-0 select-none opacity-70 hover:opacity-100 transition-opacity duration-300"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                width={40}
                height={40}
                className="object-contain grayscale hover:grayscale-0 transition-all duration-300"
                unoptimized
              />
              <span className="text-[10px] font-bold tracking-[0.18em] text-surface-500 uppercase">
                {brand.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
