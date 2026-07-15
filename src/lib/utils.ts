import { type ClassValue, clsx } from "clsx";

// Simple class merge utility (no tailwind-merge dependency needed)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Çalışma saatlerine göre mağazanın açık/kapalı olduğunu hesaplar
 */
export function isStoreOpen(workingHours: Record<string, { open: string; close: string } | null>): {
  isOpen: boolean;
  todayHours: { open: string; close: string } | null;
  nextOpenDay: string | null;
} {
  const now = new Date();
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const todayKey = days[now.getDay()];
  const todayHours = workingHours[todayKey] || null;

  if (!todayHours) {
    // Bugün kapalı, sonraki açık günü bul
    let nextOpenDay: string | null = null;
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (now.getDay() + i) % 7;
      const nextDayKey = days[nextDayIndex];
      if (workingHours[nextDayKey]) {
        const dayNames: Record<string, string> = {
          mon: "Pazartesi",
          tue: "Salı",
          wed: "Çarşamba",
          thu: "Perşembe",
          fri: "Cuma",
          sat: "Cumartesi",
          sun: "Pazar",
        };
        nextOpenDay = dayNames[nextDayKey];
        break;
      }
    }
    return { isOpen: false, todayHours: null, nextOpenDay };
  }

  const [openH, openM] = todayHours.open.split(":").map(Number);
  const [closeH, closeM] = todayHours.close.split(":").map(Number);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  return {
    isOpen: currentMinutes >= openMinutes && currentMinutes < closeMinutes,
    todayHours,
    nextOpenDay: null,
  };
}

/**
 * Fiyatı Türk Lirası formatında gösterir
 */
export function formatPrice(price: number | string | null | undefined): string {
  if (!price) return "";
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
}

/**
 * Slug üretir
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * WhatsApp link oluşturur
 */
export function createWhatsAppLink(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const baseUrl = `https://wa.me/${cleanPhone}`;
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }
  return baseUrl;
}

/**
 * Stok durumu badge metni
 */
export function getStockLabel(status: string): { text: string; color: string } {
  switch (status) {
    case "IN_STOCK":
      return { text: "Stokta", color: "text-emerald-400" };
    case "OUT_OF_STOCK":
      return { text: "Tükendi", color: "text-red-400" };
    case "ON_ORDER":
      return { text: "Siparişte", color: "text-amber-400" };
    default:
      return { text: "Bilinmiyor", color: "text-gray-400" };
  }
}
