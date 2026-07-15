# Telefon Mağazası Web Sitesi — Proje Planı

**Amaç:** Satış yapılmayan, müşteriyi fiziksel mağazaya çekmeyi hedefleyen, etkileyici 3D tasarımlı bir tanıtım sitesi + arka planda ürün/stok/mağaza yönetimi yapılan admin panel.

---

## 1. 3D Tasarımın Yeri ve Yönetimi

Sitenin tamamını 3D yapmak hem geliştirme maliyetini hem de mobil performans riskini ciddi artırır. Bunun yerine **iki noktada güçlü, odaklı 3D kullanımı** uygulanacaktır:

- **Ana sayfa / Hero bölümü:** Yavaşça dönen, ışıklandırılmış bir veya birkaç telefon modeli (fare ile hafif etkileşimli — mouse hareketine göre hafif dönüş). Ziyaretçinin siteye girdiği ilk 3 saniyede "vay" dedirtecek kısım burası.
- **Ürün detay sayfası:** Seçilen telefonun 360° döndürülüp incelenebildiği interaktif model (renk seçenekleri arasında geçiş yapılabilirse bonus etki yaratır — örn. siyah/mavi/altın renk butonları).

**3D Model Kaynağı ve Optimizasyonu:**
- Öne çıkan/amiral gemi birkaç model için hazır GLTF/GLB modeller kullanılacaktır (Sketchfab, TurboSquid vb. kaynaklardan, jenerik "akıllı telefon" tasarımları — gerçek marka model 3D'si telif riski taşımayacak şekilde veya marka detayları basitleştirilerek).
- Modeller sisteme yüklenmeden önce **Draco Compression** (Draco Sıkıştırması) ile optimize edilerek dosya boyutları %70-80 oranında düşürülecektir.
- Mobilde performans kaybını önlemek için 3D yerine statik görsel/basit dönen görsel fallback'i (yedek mekanizma) sunulacaktır. 3D modeller lazy-load (tembel yükleme) ile sahne görünür olduğunda yüklenecektir.

---

## 2. Önerilen Teknoloji Yığını

| Katman | Teknoloji | Neden / Detay |
|---|---|---|
| Frontend | **Next.js (React) - App Router** | SEO dostu, hızlı. 3D bileşenler tarayıcı tarafında `dynamic(() => import(...), { ssr: false })` ile yüklenecektir. |
| 3D | **React Three Fiber (R3F) / Three.js** | React ile doğal entegrasyon, geniş topluluk desteği. |
| Stil | **Tailwind CSS** | Hızlı, tutarlı, modern görünüm. |
| Backend | **Next.js Route Handlers (API)** | Aynı repo içinde basitlik ve sunucusuz mimari. |
| Veritabanı | **Supabase (PostgreSQL)** | İlişkisel veri, hızlı entegrasyon ve bulut tabanlı hazır yapı. |
| Kimlik Doğrulama | **Supabase Auth** | `/admin` panel güvenliği için hazır, hızlı ve güvenli üyelik/giriş altyapısı. |
| Dosya Depolama | **Supabase Storage** | Ürün resimleri ve `.glb`/`.gltf` 3D modellerinin saklanması ve CDN üzerinden hızlı sunumu. |
| ORM | **Prisma** | DB şema yönetimini ve veritabanı sorgularını hızlandırır. |
| Hosting | **Vercel** | Next.js projeleri için en optimize, hızlı ve ücretsiz/düşük maliyetli barındırma. |

---

## 3. Veritabanı Şeması (Supabase & Prisma Uyumlu)

```prisma
// schema.prisma taslağı

model Category {
  id             String    @id @default(uuid())
  name           String
  slug           String    @unique
  description    String?
  image_url      String?
  display_order  Int       @default(0) // Admin panelden kategori sıralama önceliği
  products       Product[]
  created_at     DateTime  @default(now())
  updated_at     DateTime  @updatedAt
}

model Product {
  id                  String   @id @default(uuid())
  name                String
  slug                String   @unique
  description         String
  brand               String
  model               String
  price               Decimal? // Gösterim amaçlı ("Yaklaşık Fiyat" veya "Başlayan Fiyatlar")
  specs               Json     // Teknik detaylar (RAM, depolama, ekran, kamera, pil vb. esnek JSON)
  images              String[] // Ürün görselleri url listesi (Supabase Storage)
  
  // 3D Model Bilgileri
  has_3d_model        Boolean  @default(false)
  model_3d_url        String?  // GLB dosya url'i (Supabase Storage)
  model_scale         Float    @default(1.0) // Model ölçek çarpanı
  model_rotation      Json?    // Varsayılan X, Y, Z dönüş açısı örn: {x:0, y:1.5, z:0}
  model_camera_pos    Json?    // Varsayılan kamera pozisyonu örn: {x:0, y:0, z:5}
  
  // Stok & Vitrin
  stock_status        String   @default("IN_STOCK") // IN_STOCK, OUT_OF_STOCK, ON_ORDER
  is_featured         Boolean  @default(false)      // Ana sayfadaki 3D hero veya vitrinde listelensin mi?
  is_active           Boolean  @default(true)       // false = taslak/yayından kaldırılmış (silmeden gizleme)
  display_order       Int      @default(0)          // Kategori içi ve vitrin sıralama önceliği
  
  // SEO Meta Bilgileri
  meta_title          String?
  meta_description    String?

  category_id         String
  category            Category @relation(fields: [category_id], references: [id])
  
  created_at          DateTime @default(now())
  updated_at          DateTime @updatedAt
}

model StoreSettings {
  id                  String   @id @default("default") // Tek mağaza ayarı olacağı için tek satır tutulacak
  name                String   @default("CellBross")
  logo_url            String?  // Mağaza logosu (Supabase Storage)
  favicon_url         String?  // Tarayıcı sekme ikonu
  address             String
  phone               String
  whatsapp            String
  working_hours       Json     // Gün bazlı yapılandırılmış saat: {mon:{open:"09:00",close:"20:00"}, sun:null}
  map_coordinates     String?  // Google Maps koordinatları veya harita iframe URL'i
  google_maps_url     String?  // "Yol Tarifi Al" için doğrudan link
  social_links        Json?    // Sosyal medya linkleri: {instagram:"...", facebook:"...", tiktok:"..."}

  // Duyuru Bandı
  announcement_text   String?  // Üst banner duyuru metni (örn: "Yeni iPhone 16 stokta!")
  announcement_active Boolean  @default(false) // Duyuru bandı aktif mi?

  updated_at          DateTime @updatedAt
}

model AdminUser {
  id         String   @id @default(uuid())
  email      String   @unique
  role       String   @default("ADMIN")
  created_at DateTime @default(now())
}
```

---

## 4. Site Sayfa Yapısı ve Dönüşüm Özellikleri

1. **Ana Sayfa**
   - **Duyuru Bandı (Opsiyonel):** Admin panelden açılıp kapatılabilen, sayfanın en üstünde dikkat çekici bir banner ("Yeni iPhone 16 stokta!" gibi).
   - **3D Hero Alanı:** Yavaşça dönen, etkileşimli 3D telefon modeli.
   - **Canlı Mağaza Durumu:** Mağazanın o an açık/kapalı olduğunu gösteren dinamik badge (yapılandırılmış `working_hours` JSON verisine göre otomatik hesaplanır).
   - **Öne Çıkan Ürünler:** Vitrinde 3D model desteği olan veya olmayan popüler cihazlar (`display_order` sırasına göre).
   - **Konuma Yönlendiren CTA:** Google Maps ile entegre "Yol Tarifi Al" butonu.
2. **Ürünler Sayfası**
   - Kategoriye göre filtrelenebilir liste (marka, fiyat aralığı, stok durumu filtreleri).
   - Basit bir **Ürün Karşılaştırma Modülü** (kullanıcının 2 telefonu yan yana teknik özellikleriyle kıyaslayabilmesi için).
3. **Ürün Detay Sayfası**
   - Çoklu görsel galerisi.
   - **3D Model İnceleme Alanı (Varsa):** 360° dönebilen ve renk seçimine göre dinamik olarak güncellenen model.
   - Teknik özellik tablosu.
   - **"WhatsApp'tan Sor" / "Mağazadan Sor" Butonları:** Hızlı iletişim ve fiziksel mağazaya yönlendirme.
   - **QR Kod:** Fiziksel mağazadaki ziyaretçiler için telefonun yanına konulacak, doğrudan bu ürün sayfasına yönlendiren dinamik QR kod oluşturucu.
4. **Hakkımızda Sayfası**
   - Mağaza hikayesi, kalite ve güven unsurları.
5. **İletişim / Konum Sayfası**
   - İnteraktif harita, telefon, çalışma saatleri ve mobil uygulamalara (Google Maps, Apple Maps, Yandex) doğrudan yönlendiren "Yol Tarifi Al" butonları.
6. **Admin Panel** (`/admin`, Supabase Auth korumalı)
   - **Dashboard:** Ürün sayısı, aktif 3D modeller ve stok durumu özetleri.
   - **Ürün Yönetimi:** CRUD işlemleri, çoklu resim yükleme ve `.glb` 3D model yükleme (Supabase Storage entegrasyonlu), 3D kamera ve ölçek (scale) ayarları.
   - **Kategori Yönetimi:** Ekleme/düzenleme/silme işlemleri.
   - **Mağaza Bilgileri & Çalışma Saatleri Düzenleme:** Tek bir arayüzden tüm sitenin iletişim ve çalışma saatlerini güncelleme.

---

## 5. Geliştirme Fazları

| Faz | İçerik | Detay / Çıktı | Tahmini Süre |
|---|---|---|---|
| 1 | **Tasarım & 3D Hazırlık** | Tasarım (wireframe + UI/UX), 3D modellerin (GLB) bulunması ve Draco sıkıştırması ile optimize edilmesi. | 1-2 hafta |
| 2 | **Supabase Entegrasyonu & Admin Panel** | DB şemasının uygulanması, Supabase Auth ve Storage (Medya/3D klasörleri) kurulumu. Admin CRUD (ürün, kategori, stok ve mağaza ayarları) ekranlarının kodlanması. | 2-3 hafta |
| 3 | **Frontend & UI Geliştirme** | Ana sayfa, ürün listesi, karşılaştırma modülü ve detay sayfalarının Next.js App Router ile statik/dinamik oluşturulması. SEO yapılandırmaları. | 2 hafta |
| 4 | **3D Entegrasyonu (R3F)** | Hero alanı ve ürün detayındaki 3D sahnelerin, kamera ve ışıklandırma ayarlarının, mobil fallback ekranlarının entegre edilmesi. | 1-2 hafta |
| 5 | **Test, Optimizasyon & Analiz** | Performans testleri (Lighthouse / Core Web Vitals), 3D lazy-loading kontrolleri, tarayıcı cache ayarları. Google Analytics / Umami dönüşüm takip event'lerinin kurulması (WhatsApp / Konum tıklamaları). | 1 hafta |
| 6 | **Yayına Alma** | Vercel üzerinde canlıya geçiş, Supabase production DB geçişi, alan adı yönlendirme. | 2-3 gün |

---

## 6. Dikkat Edilmesi Gereken Noktalar ve En İyi Uygulamalar (Best Practices)

- **Mobil Performans ve Fallback:** 3D modeller mobilde donmalara sebep olabilir. Dokunmatik ekranlarda sayfa kaydırma ile 3D model döndürme çakışmamalıdır. Mobilde varsayılan olarak 3D yerine statik görsel gösterilmeli veya 3D alanı "Etkileşime Geçmek İçin Tıkla" şeklinde pasif başlatılmalıdır.
- **Draco & Önbellekleme:** Model boyutları minimumda tutulmalı (maksimum 2-3 MB) ve CDN / tarayıcı önbelleği (Cache-Control: `public, max-age=2592000`) aktif edilerek sunucudan veri tasarrufu sağlanmalıdır.
- **Marka ve Telif Riski:** Jenerik telefon tasarımları veya marka logoları basitleştirilmiş modeller seçilmelidir.
- **Dönüşüm Odaklılık:** E-ticaret satışı olmadığı için sitenin her kritik noktasında "WhatsApp'tan Sor" veya "Yol Tarifi Al" butonları ön planda olmalıdır. Bu butonların tıklanma sayıları analytics üzerinden düzenli izlenmelidir.
- **SEO & Schema Markup:** Yerel SEO için `LocalBusiness` şeması (adres, telefon, çalışma saatleri) ve her ürün sayfası için `Product` schema markup verileri otomatik olarak sayfa HTML'ine gömülmelidir.
- **KVKK:** İletişim bilgisi veya analiz çerezleri toplandığı için basit bir KVKK aydınlatma metni ve çerez bilgilendirmesi eklenmelidir.
- **Erişilebilirlik (a11y):** Tüm görsellerde anlamlı `alt` text'ler, interaktif elemanlarda `aria-label` tanımları, klavye ile navigasyon desteği ve yeterli renk kontrastı sağlanmalıdır. 3D alanlar erişilebilir olmadığından, her 3D sahnenin yanında aynı bilgiyi sunan alternatif metin/görsel bulunmalıdır.