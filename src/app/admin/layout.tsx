"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Smartphone, 
  Layers, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Store
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Auth Check
    const auth = localStorage.getItem("cellbross_admin_auth");
    if (auth !== "true" && pathname !== "/admin/login") {
      router.push("/admin/login");
    } else {
      setAuthorized(true);
    }
  }, [router, pathname]);

  // Don't wrap login page in layout sidebars
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-surface-200 border-t-surface-900 animate-spin" />
          <p className="text-sm font-semibold text-surface-500">Yönetim Paneli Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { href: "/admin", label: "Genel Bakış", icon: LayoutDashboard },
    { href: "/admin/products", label: "Ürün Yönetimi", icon: Smartphone },
    { href: "/admin/categories", label: "Kategori Yönetimi", icon: Layers },
    { href: "/admin/settings", label: "Mağaza Ayarları", icon: Settings },
  ];

  const handleLogout = async () => {
    localStorage.removeItem("cellbross_admin_auth");
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout request failed:", e);
    }
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-surface-200/80 px-4 py-3 sticky top-0 z-50">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center">
            <Smartphone className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-base font-extrabold text-surface-900">CellBroos Panel</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg border border-surface-200 text-surface-700 hover:bg-surface-50"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar - Desktop / Drawer - Mobile */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-surface-200/80 p-6 flex flex-col justify-between transition-transform duration-300
        md:sticky md:translate-x-0
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="space-y-8">
          {/* Logo */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-sm">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-surface-900">
                CellBroos
              </span>
              <span className="block text-[9px] text-surface-500 -mt-0.5 tracking-wider uppercase font-bold">
                Yönetim Paneli
              </span>
            </div>
          </div>

          {/* Nav menu */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                    active 
                      ? "bg-surface-900 text-white shadow-sm shadow-surface-900/10" 
                      : "text-surface-600 hover:text-surface-900 hover:bg-surface-50"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-3 pt-6 border-t border-surface-100">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-surface-600 hover:text-surface-900 hover:bg-surface-50 transition-all"
          >
            <Store className="w-4.5 h-4.5" />
            <span>Mağazayı Gör</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile drawer */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full min-h-[calc(100vh-60px)] md:min-h-screen">
        {children}
      </main>
    </div>
  );
}
