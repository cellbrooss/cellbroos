"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  MapPin,
  Smartphone,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { DataService } from "@/lib/data-service";
import { isStoreOpen } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!store) return null;

  return (
    <>
      {/* Announcement Banner */}
      {store.announcement_active && store.announcement_text && (
        <div className="announcement-banner">
          <p>{store.announcement_text}</p>
        </div>
      )}

      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled
          ? "glass-strong shadow-md shadow-slate-100"
          : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                {store.logo_url ? (
                  <img src={store.logo_url} alt={store.name} className="w-11 h-11 object-contain rounded-xl" />
                ) : (
                  <>
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center group-hover:shadow-md group-hover:shadow-primary-500/20 transition-all duration-300">
                      <Smartphone className="w-[22px] h-[22px] text-white" />
                    </div>
                    <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 opacity-0 group-hover:opacity-10 blur-lg transition-opacity duration-300" />
                  </>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <motion.span
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.04, delayChildren: 0.2 },
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                    className="text-2xl sm:text-[27px] font-extrabold tracking-tight text-surface-900 group-hover:text-primary-600 transition-colors flex items-center"
                  >
                    {(store.logo_text || store.name || "CellBroos")
                      .split("")
                      .map((char: string, idx: number) => (
                        <motion.span
                          key={idx}
                          variants={{
                            hidden: { opacity: 0, x: -10, filter: "blur(2px)" },
                            visible: { opacity: 1, x: 0, filter: "blur(0px)" },
                          }}
                          transition={{ type: "spring", stiffness: 180, damping: 12 }}
                          style={{ display: "inline-block", minWidth: char === " " ? "0.3em" : "auto" }}
                        >
                          {char}
                        </motion.span>
                      ))}
                  </motion.span>
                  <span
                    className={`w-2 h-2 rounded-full ${storeStatus.isOpen ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                      }`}
                    title={storeStatus.isOpen ? "Açık" : "Kapalı"}
                  />
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4.5 py-2 text-sm font-bold rounded-full transition-all duration-300 ${isActive
                      ? "bg-surface-900 text-white shadow-sm"
                      : "text-surface-700 hover:text-surface-950 hover:bg-surface-100"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side: Status + Contact + Mobile Menu */}
            <div className="flex items-center gap-3">
              {/* Store Status Badge (Desktop Only) */}
              <div className="hidden lg:block">
                <div
                  className={storeStatus.isOpen ? "badge-open" : "badge-closed"}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${storeStatus.isOpen ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                      }`}
                  />
                  <span className="font-bold">{storeStatus.isOpen ? "Açık" : "Kapalı"}</span>
                </div>
              </div>

              {/* Contact Buttons (Desktop Only) */}
              <div className="hidden lg:block">
                <a
                  href={`tel:${store.phone}`}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-surface-700 hover:text-surface-950 hover:bg-surface-100 rounded-full transition-all duration-300"
                  aria-label="Bizi arayın"
                >
                  <Phone className="w-4 h-4 text-surface-700" />
                  <span>Ara</span>
                </a>
              </div>
              <div className="hidden lg:block">
                <Link
                  href="/iletisim"
                  className="btn-primary text-sm !px-4.5 !py-2.5 font-bold"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Yol Tarifi</span>
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden btn-ghost !p-2 text-surface-900 hover:bg-surface-100 rounded-full"
                aria-label="Menüyü aç/kapat"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden glass-strong border-t border-slate-200 overflow-hidden"
            >
              <nav className="px-4 py-4 space-y-1 bg-white">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${isActive
                        ? "bg-surface-900 text-white"
                        : "text-surface-700 hover:text-surface-950 hover:bg-surface-100"
                        }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <a href={`tel:${store.phone}`} className="btn-secondary text-sm font-bold">
                    <Phone className="w-4 h-4 text-surface-700" />
                    {store.phone}
                  </a>
                  <Link
                    href="/iletisim"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-primary text-sm font-bold"
                  >
                    <MapPin className="w-4 h-4" />
                    Yol Tarifi Al
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
