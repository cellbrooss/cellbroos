"use client";

import { useState, useEffect } from "react";
import { DataService } from "@/lib/data-service";
import { Settings, Save, AlertCircle, Image as ImageIcon, Link as LinkIcon, HelpCircle, Award, ShieldCheck, HeartHandshake } from "lucide-react";

const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const dayNames: Record<string, string> = {
  mon: "Pazartesi",
  tue: "Salı",
  wed: "Çarşamba",
  thu: "Perşembe",
  fri: "Cuma",
  sat: "Cumartesi",
  sun: "Pazar",
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementActive, setAnnouncementActive] = useState(false);
  const [workingHours, setWorkingHours] = useState<Record<string, { open: string; close: string } | null>>({});

  // Dynamic parameters
  const [logoUrl, setLogoUrl] = useState("");
  const [logoText, setLogoText] = useState("");
  const [featuredTitle, setFeaturedTitle] = useState("");
  const [brandsText, setBrandsText] = useState("");
  const [socialLinks, setSocialLinks] = useState({ instagram: "", facebook: "", tiktok: "" });

  // Why Us Cards (Exactly 3)
  const [whyUs, setWhyUs] = useState<any[]>([
    { title: "", desc: "", icon: "Award" },
    { title: "", desc: "", icon: "ShieldCheck" },
    { title: "", desc: "", icon: "HeartHandshake" }
  ]);

  useEffect(() => {
    const data = DataService.getSettings();
    if (data) {
      setSettings(data);
      setName(data.name || "CellBroos");
      setPhone(data.phone || "");
      setWhatsapp(data.whatsapp || "");
      setAddress(data.address || "");
      setGoogleMapsUrl(data.google_maps_url || "");
      setAnnouncementText(data.announcement_text || "");
      setAnnouncementActive(data.announcement_active || false);
      setWorkingHours(data.working_hours || {});

      setLogoUrl(data.logo_url || "");
      setLogoText(data.logo_text || "CellBroos");
      setFeaturedTitle(data.featured_title || "Öne Çıkan Telefonlar");
      setBrandsText(Array.isArray(data.brands) ? data.brands.join(", ") : "Apple, Samsung, Xiaomi, Huawei, OnePlus, Oppo, Realme");
      setSocialLinks({
        instagram: data.social_links?.instagram || "",
        facebook: data.social_links?.facebook || "",
        tiktok: data.social_links?.tiktok || "",
      });

      if (Array.isArray(data.why_us) && data.why_us.length === 3) {
        setWhyUs(data.why_us);
      } else {
        setWhyUs([
          { title: "Garantili & Faturalı", desc: "Tüm ürünlerimiz distribütör garantili, orijinal kutusunda ve adınıza faturalı olarak teslim edilir.", icon: "Award" },
          { title: "Güvenilir Alışveriş", desc: "Ürünü mağazamızda fiziki olarak test edin, uzman kadromuz eşliğinde güvenle satın alın.", icon: "ShieldCheck" },
          { title: "Satış Sonrası Destek", desc: "Veri transferi, kurulum ve aksesuarlarla ilgili her türlü sorunuzda daima yanınızdayız.", icon: "HeartHandshake" }
        ]);
      }
    }
  }, []);

  const handleWorkingHourToggle = (day: string) => {
    setWorkingHours((prev) => {
      const current = prev[day];
      return {
        ...prev,
        [day]: current ? null : { open: "09:00", close: "20:00" },
      };
    });
  };

  const handleWorkingHourChange = (day: string, field: "open" | "close", val: string) => {
    setWorkingHours((prev) => {
      const current = prev[day];
      if (!current) return prev;
      return {
        ...prev,
        [day]: {
          ...current,
          [field]: val,
        },
      };
    });
  };

  const handleWhyUsChange = (index: number, field: string, value: string) => {
    setWhyUs((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedBrands = brandsText
      .split(",")
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    const updatedSettings = {
      ...settings,
      name,
      phone,
      whatsapp,
      address,
      google_maps_url: googleMapsUrl,
      announcement_text: announcementText,
      announcement_active: announcementActive,
      working_hours: workingHours,
      logo_url: logoUrl || null,
      logo_text: logoText || null,
      featured_title: featuredTitle,
      brands: parsedBrands,
      social_links: socialLinks,
      why_us: whyUs,
    };

    DataService.saveSettings(updatedSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!settings) return null;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-surface-900 tracking-tight">Mağaza Ayarları</h1>
        <p className="text-sm text-surface-500 font-medium mt-1">İletişim bilgilerini, tasarım ögelerini ve çalışma saatlerini buradan düzenleyin.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* General Box */}
          <div className="bg-white rounded-2xl border border-surface-200/80 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-surface-900 border-b border-surface-50 pb-3 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary-600" />
              Genel Bilgiler
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                  Mağaza Adı
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                  Telefon Numarası
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+90 212 555 0042"
                  className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                  WhatsApp Hattı (Numara olarak)
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+905551234567"
                  className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                  Mağaza Açık Adresi
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none resize-none"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                  Google Haritalar Yol Tarifi Bağlantısı (URL)
                </label>
                <input
                  type="url"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Design & Logo Settings */}
          <div className="bg-white rounded-2xl border border-surface-200/80 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-surface-900 border-b border-surface-50 pb-3 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-600" />
              Logo ve Tasarım Ayarları
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                  Logo Görseli (URL)
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="/images/logo.png veya boş bırakın"
                  className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                  Logo Yazısı (Görsel yoksa kullanılır)
                </label>
                <input
                  type="text"
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                  Öne Çıkanlar Bölümü Başlığı
                </label>
                <input
                  type="text"
                  value={featuredTitle}
                  onChange={(e) => setFeaturedTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                  Akan Logolar (Markalar - Virgülle ayırın)
                </label>
                <input
                  type="text"
                  value={brandsText}
                  onChange={(e) => setBrandsText(e.target.value)}
                  placeholder="Apple, Samsung, Xiaomi, Huawei"
                  className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
                  required
                />
                <span className="text-[10px] text-surface-400 font-bold block mt-1">Girdiğiniz markaların logoları otomatik olarak cdn.simpleicons.org üzerinden çekilir.</span>
              </div>
            </div>
          </div>

          {/* Why Us / Neden Biz */}
          <div className="bg-white rounded-2xl border border-surface-200/80 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-surface-900 border-b border-surface-50 pb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              Neden Biz? Bölümü Kartları
            </h2>

            <div className="space-y-6">
              {whyUs.map((card, idx) => (
                <div key={idx} className="p-4 bg-surface-50/50 rounded-xl border border-surface-200/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-surface-900 uppercase">Kart #{idx + 1}</span>
                    <div className="flex items-center gap-1 bg-white border border-surface-200 px-2 py-0.5 rounded text-xs font-bold">
                      <span>İkon:</span>
                      <select
                        value={card.icon}
                        onChange={(e) => handleWhyUsChange(idx, "icon", e.target.value)}
                        className="bg-transparent border-none outline-none font-bold cursor-pointer"
                      >
                        <option value="Award">Ödül (Award)</option>
                        <option value="ShieldCheck">Kalkan (ShieldCheck)</option>
                        <option value="HeartHandshake">El Sıkışma (HeartHandshake)</option>
                        <option value="Smartphone">Telefon (Smartphone)</option>
                        <option value="Award">Yıldız (Award)</option>
                        <option value="Zap">Şimşek (Zap)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="block text-[10px] font-bold text-surface-600 uppercase mb-1">Başlık</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => handleWhyUsChange(idx, "title", e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-surface-200 focus:border-surface-900 rounded-lg text-surface-900 text-xs font-semibold outline-none"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-surface-600 uppercase mb-1">Açıklama</label>
                      <input
                        type="text"
                        value={card.desc}
                        onChange={(e) => handleWhyUsChange(idx, "desc", e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-surface-200 focus:border-surface-900 rounded-lg text-surface-900 text-xs font-semibold outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Working Hours */}
          <div className="bg-white rounded-2xl border border-surface-200/80 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-surface-900 border-b border-surface-50 pb-3 flex items-center gap-2">
              Çalışma Saatleri
            </h2>

            <div className="space-y-4">
              {dayKeys.map((day) => {
                const hour = workingHours[day];
                const isOpen = hour !== null;
                return (
                  <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-50/50 border border-surface-200/40 p-3 rounded-xl">
                    <div className="flex items-center justify-between sm:justify-start gap-4">
                      <span className="text-sm font-bold text-surface-900 w-24">{dayNames[day]}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isOpen}
                          onChange={() => handleWorkingHourToggle(day)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-surface-900"></div>
                      </label>
                    </div>

                    {isOpen && hour ? (
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <input
                          type="text"
                          value={hour.open}
                          onChange={(e) => handleWorkingHourChange(day, "open", e.target.value)}
                          placeholder="09:00"
                          className="w-16 px-2 py-1 text-center bg-white border border-surface-200 rounded-lg text-xs font-bold outline-none focus:border-surface-900"
                        />
                        <span className="text-xs text-surface-400 font-bold">-</span>
                        <input
                          type="text"
                          value={hour.close}
                          onChange={(e) => handleWorkingHourChange(day, "close", e.target.value)}
                          placeholder="20:00"
                          className="w-16 px-2 py-1 text-center bg-white border border-surface-200 rounded-lg text-xs font-bold outline-none focus:border-surface-900"
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-red-500 font-bold bg-red-50 border border-red-100 px-3 py-1 rounded-lg self-end sm:self-auto">
                        Kapalı
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white rounded-2xl border border-surface-200/80 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-surface-900 border-b border-surface-50 pb-3 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-blue-500" />
              Sosyal Medya Bağlantıları
            </h2>

             <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                  Instagram
                </label>
                <input
                  type="url"
                  value={socialLinks.instagram}
                  onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                  placeholder="https://instagram.com/cellbroos"
                  className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                  Facebook
                </label>
                <input
                  type="url"
                  value={socialLinks.facebook}
                  onChange={(e) => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))}
                  placeholder="https://facebook.com/cellbroos"
                  className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                  TikTok
                </label>
                <input
                  type="url"
                  value={socialLinks.tiktok}
                  onChange={(e) => setSocialLinks(prev => ({ ...prev, tiktok: e.target.value }))}
                  placeholder="https://tiktok.com/@cellbroos"
                  className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Announcement Box */}
          <div className="bg-white rounded-2xl border border-surface-200/80 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-surface-50 pb-3">
              <h2 className="text-base font-bold text-surface-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Duyuru Bandı
              </h2>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={announcementActive}
                  onChange={(e) => setAnnouncementActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-surface-900"></div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-1.5">
                Duyuru Metni
              </label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Örn. Yeni modellerimiz mağazamızda!"
                className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 focus:border-surface-900 focus:bg-white rounded-xl text-surface-900 text-sm font-semibold transition-all outline-none"
                disabled={!announcementActive}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col gap-3">
            {saveSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-3 text-center text-xs font-bold animate-in fade-in duration-200">
                Ayarlar Başarıyla Kaydedildi! Sitedeki tüm bilgiler güncellendi.
              </div>
            )}
            <button
              type="submit"
              className="w-full btn-primary py-3.5 text-sm font-bold flex items-center justify-center gap-1.5 shadow-md shadow-surface-900/10 cursor-pointer"
            >
              <Save className="w-5 h-5" />
              Ayarları Kaydet
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
