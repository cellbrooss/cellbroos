import type { Metadata } from "next";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | CellBroos",
  description: "CellBroos kişisel verilerin korunması kanunu (KVKK) kapsamında hazırlanan aydınlatma metni.",
};

export default function KVKKPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-surface-50 border-b border-surface-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-surface-500 hover:text-surface-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 tracking-tight">
                KVKK Aydınlatma Metni
              </h1>
              <p className="text-sm text-surface-500 font-medium mt-0.5">Son Güncelleme: Ocak 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="prose prose-slate max-w-none space-y-8 text-sm sm:text-base text-surface-700 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">1. Veri Sorumlusunun Kimliği</h2>
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz; veri sorumlusu
              sıfatıyla <strong>CellBroos</strong> tarafından aşağıda açıklanan kapsamda işlenebilecektir.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">2. Kişisel Verilerin İşlenme Amacı</h2>
            <p>Toplanan kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Ürün ve hizmetlerin sunulması, satış süreçlerinin yönetilmesi</li>
              <li>Müşteri ilişkilerinin yürütülmesi ve müşteri memnuniyetinin sağlanması</li>
              <li>WhatsApp ve telefon aracılığıyla iletişimin sağlanması</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi (fatura, garanti belgesi vb.)</li>
              <li>Şikâyet ve taleplerin yönetilmesi</li>
              <li>Güvenliğin sağlanması ve dolandırıcılığın önlenmesi</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">3. İşlenen Kişisel Veri Kategorileri</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Kimlik Bilgileri:</strong> Ad, soyad</li>
              <li><strong>İletişim Bilgileri:</strong> Telefon numarası, e-posta adresi</li>
              <li><strong>İşlem Bilgileri:</strong> Satın alınan ürün, fatura bilgileri</li>
              <li><strong>Konum Bilgileri:</strong> Teslimat adresi (varsa)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">4. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi</h2>
            <p>
              Kişisel verileriniz; mağazamızı ziyaret etmeniz, WhatsApp veya telefon aracılığıyla iletişime geçmeniz,
              ürün satın almanız ya da web sitemizi kullanmanız yoluyla sözlü, yazılı veya elektronik ortamda otomatik
              ya da otomatik olmayan yöntemlerle toplanmaktadır.
            </p>
            <p className="mt-3">
              İşlemin hukuki dayanakları KVKK Madde 5 uyarınca şunlardır:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Açık rızanızın bulunması</li>
              <li>Sözleşmenin kurulması veya ifası için zorunlu olması</li>
              <li>Hukuki yükümlülüklerimizin yerine getirilmesi</li>
              <li>Meşru menfaatlerimizin korunması</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">5. Kişisel Verilerin Aktarımı</h2>
            <p>
              Kişisel verileriniz; yasal zorunluluklar kapsamında kamu kurum ve kuruluşları ile, hizmet alınan iş
              ortaklarımıza (muhasebe, kargo, teknik altyapı sağlayıcıları) KVKK'nın 8. ve 9. maddeleri
              çerçevesinde aktarılabilmektedir.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">6. Kişisel Veri Sahibinin Hakları</h2>
            <p>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme</li>
              <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
              <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
              <li>Silinmesini veya yok edilmesini isteme</li>
              <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi durumunda aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
              <li>Kanuna aykırı işlenmesi sebebiyle zarara uğramanız hâlinde tazminat talep etme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">7. İletişim</h2>
            <p>
              Yukarıda belirtilen haklarınızı kullanmak veya KVKK kapsamında herhangi bir talepte bulunmak için
              mağazamızı ziyaret edebilir ya da WhatsApp hattımızdan bizimle iletişime geçebilirsiniz.
            </p>
            <div className="mt-4 p-4 bg-surface-50 rounded-xl border border-surface-200">
              <p className="font-bold text-surface-900">CellBroos</p>
              <p className="text-surface-600 mt-1">Telefon ve kişisel verilere ilişkin tüm talepleriniz için mağazamızla iletişime geçiniz.</p>
            </div>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-surface-200">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-surface-500 hover:text-surface-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
