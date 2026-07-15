import type { Metadata } from "next";
import Link from "next/link";
import { Cookie, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Çerez Politikası | CellBroos",
  description: "CellBroos web sitesinin kullandığı çerezler hakkında bilgi edinmek için çerez politikamızı okuyun.",
};

export default function CerezPolitikasiPage() {
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
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100">
              <Cookie className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 tracking-tight">
                Çerez Politikası
              </h1>
              <p className="text-sm text-surface-500 font-medium mt-0.5">Son Güncelleme: Ocak 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="space-y-8 text-sm sm:text-base text-surface-700 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">1. Çerez Nedir?</h2>
            <p>
              Çerezler, web sitelerinin tarayıcınıza yerleştirdiği küçük metin dosyalarıdır. Bu dosyalar, web sitesinin
              sizi tanımasına, tercihlerinizi hatırlamasına ve deneyiminizi kişiselleştirmesine yardımcı olur.
              Tarayıcınız kapandıktan sonra silinen "oturum çerezleri" ve belirli bir süre tarayıcınızda kalan
              "kalıcı çerezler" olmak üzere iki temel türü bulunmaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">2. Hangi Çerezleri Kullanıyoruz?</h2>

            <div className="space-y-4 mt-4">
              <div className="p-4 bg-surface-50 rounded-xl border border-surface-200">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <div>
                    <p className="font-bold text-surface-900">Zorunlu Çerezler</p>
                    <p className="text-surface-600 text-sm mt-1">
                      Web sitesinin temel işlevlerini (oturum yönetimi, güvenlik) sağlamak için kullanılır.
                      Bu çerezler devre dışı bırakılamaz.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-surface-50 rounded-xl border border-surface-200">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <div>
                    <p className="font-bold text-surface-900">İşlevsel Çerezler</p>
                    <p className="text-surface-600 text-sm mt-1">
                      Tercihlerinizi (dil seçimi, görüntüleme tercihleri gibi) hatırlamak için kullanılır.
                      Bu çerezler olmadan bazı özellikler düzgün çalışmayabilir.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-surface-50 rounded-xl border border-surface-200">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 shrink-0" />
                  <div>
                    <p className="font-bold text-surface-900">Analitik Çerezler</p>
                    <p className="text-surface-600 text-sm mt-1">
                      Ziyaretçilerin sitemizi nasıl kullandığını anlamamıza yardımcı olur. Bu veriler, siteyi
                      geliştirmek amacıyla anonim şekilde toplanır.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">3. Sitemizde Kullanılan Çerezler</h2>
            <div className="overflow-x-auto rounded-xl border border-surface-200 mt-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-200">
                    <th className="text-left px-4 py-3 font-bold text-surface-900 text-xs uppercase tracking-wider">Çerez Adı</th>
                    <th className="text-left px-4 py-3 font-bold text-surface-900 text-xs uppercase tracking-wider">Türü</th>
                    <th className="text-left px-4 py-3 font-bold text-surface-900 text-xs uppercase tracking-wider">Amaç</th>
                    <th className="text-left px-4 py-3 font-bold text-surface-900 text-xs uppercase tracking-wider">Süre</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs text-surface-700">cellbross_admin_auth</td>
                    <td className="px-4 py-3 text-surface-600">Zorunlu</td>
                    <td className="px-4 py-3 text-surface-600">Yönetici oturum güvenliği</td>
                    <td className="px-4 py-3 text-surface-600">Oturum süresi</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs text-surface-700">_session</td>
                    <td className="px-4 py-3 text-surface-600">Zorunlu</td>
                    <td className="px-4 py-3 text-surface-600">Kullanıcı oturumu</td>
                    <td className="px-4 py-3 text-surface-600">Oturum süresi</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs text-surface-700">localStorage</td>
                    <td className="px-4 py-3 text-surface-600">İşlevsel</td>
                    <td className="px-4 py-3 text-surface-600">Site tercihleri ve önbellek</td>
                    <td className="px-4 py-3 text-surface-600">Kalıcı</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">4. Çerezleri Nasıl Kontrol Edebilirsiniz?</h2>
            <p>
              Tarayıcı ayarlarınız aracılığıyla çerezleri kabul etmemeyi ya da çerez alındığında uyarı almayı
              tercih edebilirsiniz. Ancak bazı çerezleri devre dışı bırakmanız durumunda sitemizin belirli
              özelliklerinin düzgün çalışmayabileceğini hatırlatırız.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {[
                { name: "Google Chrome", url: "https://support.google.com/chrome/answer/95647" },
                { name: "Mozilla Firefox", url: "https://support.mozilla.org/tr/kb/cerezleri-silme" },
                { name: "Safari", url: "https://support.apple.com/tr-tr/guide/safari/sfri11471/mac" },
                { name: "Microsoft Edge", url: "https://support.microsoft.com/tr-tr/microsoft-edge/microsoft-edge-te-tanımlama-bilgilerini-silme" },
              ].map((browser) => (
                <a
                  key={browser.name}
                  href={browser.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl border border-surface-200 hover:border-surface-900 transition-colors text-sm font-semibold text-surface-700 hover:text-surface-900"
                >
                  <span className="w-2 h-2 rounded-full bg-surface-400 shrink-0" />
                  {browser.name} — Çerez Ayarları
                </a>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">5. Üçüncü Taraf Çerezleri</h2>
            <p>
              Sitemiz, bazı içerikleri üçüncü taraf servisler aracılığıyla (Google Haritalar vb.) sunabilir.
              Bu servisler, kendi çerez politikaları çerçevesinde çerez yerleştirebilir. Bu üçüncü taraf
              çerezler üzerinde kontrolümüz bulunmamaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">6. Politika Güncellemeleri</h2>
            <p>
              Bu çerez politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler yapıldığında sizi
              web sitemizde duyuracağız. Politikanın en güncel halini düzenli olarak incelemenizi öneririz.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 mb-3">7. İletişim</h2>
            <p>Çerez politikamız hakkında sorularınız için mağazamızla iletişime geçebilirsiniz.</p>
            <div className="mt-4 p-4 bg-surface-50 rounded-xl border border-surface-200">
              <p className="font-bold text-surface-900">CellBroos</p>
              <p className="text-surface-600 mt-1">Tüm gizlilik ve veri sorularınız için iletişim sayfamızı ziyaret edebilirsiniz.</p>
              <Link
                href="/iletisim"
                className="inline-flex items-center gap-1.5 mt-3 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                İletişim Sayfasına Git →
              </Link>
            </div>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-surface-200 flex flex-col sm:flex-row gap-4 items-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-surface-500 hover:text-surface-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/kvkk"
            className="inline-flex items-center gap-2 text-sm font-semibold text-surface-500 hover:text-surface-900 transition-colors"
          >
            KVKK Aydınlatma Metnini Oku →
          </Link>
        </div>
      </div>
    </div>
  );
}
