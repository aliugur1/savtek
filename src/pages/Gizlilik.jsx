import SEOMeta from "../components/SEOMeta";
import "../styles/gizlilik.css";

function Gizlilik() {
  return (
    <>
      <SEOMeta
        title="Gizlilik Politikası | SAVTEK"
        description="SAVTEK gizlilik politikası, kişisel verilerin korunması ve çerez kullanımı hakkında bilgiler."
        url={typeof window !== "undefined" ? window.location.href : ""}
      />
      <main className="gizlilik-page">
        {/* HERO */}
        <section className="gizlilik-hero">
          <div className="container">
            <h1>Gizlilik Politikası</h1>
            <p className="hero-subtitle">
              Kişisel verilerinizin güvenliği bizim için önemlidir.
            </p>
          </div>
        </section>

        {/* İÇERİK */}
        <section className="gizlilik-content">
          <div className="container">
            {/* GİRİŞ */}
            <div className="content-section">
              <h2>Giriş</h2>
              <p>
                SAVTEK (Savunma Teknolojileri Topluluğu) olarak, kişisel
                verilerinizin gizliliğine saygı duyuyor ve korunmasını
                önemsiyoruz. Bu gizlilik politikası, web sitemizi ziyaret
                ettiğinizde toplanan bilgilerin nasıl kullanıldığını
                açıklamaktadır.
              </p>
            </div>

            {/* KİŞİSEL VERİLERİN KORUNMASI */}
            <div className="content-section">
              <h2>Kişisel Verilerin Korunması</h2>
              <p>
                6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)
                kapsamında, toplanan kişisel verileriniz yasal çerçevede
                korunmakta ve işlenmektedir.
              </p>
              <h3>Toplanan Bilgiler:</h3>
              <ul>
                <li>İsim ve iletişim bilgileri (iletişim formu üzerinden)</li>
                <li>E-posta adresi</li>
                <li>Web sitesi kullanım verileri (çerezler aracılığıyla)</li>
                <li>IP adresi ve tarayıcı bilgileri</li>
              </ul>
            </div>

            {/* VERİ KULLANIMI */}
            <div className="content-section">
              <h2>Verilerin Kullanım Amacı</h2>
              <p>Toplanan kişisel veriler aşağıdaki amaçlarla kullanılır:</p>
              <ul>
                <li>İletişim taleplerinin yanıtlanması</li>
                <li>Etkinlik ve duyuru bildirimleri</li>
                <li>Web sitesi performansının iyileştirilmesi</li>
                <li>İstatistiksel analizler</li>
                <li>Hukuki yükümlülüklerin yerine getirilmesi</li>
              </ul>
            </div>

            {/* ÇEREZ POLİTİKASI */}
            <div className="content-section">
              <h2>Çerez Politikası</h2>
              <p>
                Web sitemizde kullanıcı deneyimini geliştirmek ve site
                performansını ölçmek için çerezler kullanıyoruz.
              </p>
              <h3>Kullanılan Çerez Türleri:</h3>
              <ul>
                <li>
                  <strong>Zorunlu Çerezler:</strong> Site fonksiyonelliği için
                  gerekli
                </li>
                <li>
                  <strong>Analitik Çerezler:</strong> Google Analytics
                  (opsiyonel)
                </li>
                <li>
                  <strong>Performans Çerezleri:</strong> Site hızı ve
                  optimizasyon
                </li>
              </ul>
              <p>
                Çerez ayarlarınızı tarayıcınızdan yönetebilir veya footer'daki
                "Çerezler" butonuna tıklayarak tercihlerinizi
                değiştirebilirsiniz.
              </p>
            </div>

            {/* VERİ GÜVENLİĞİ */}
            <div className="content-section">
              <h2>Veri Güvenliği</h2>
              <p>
                Kişisel verileriniz, yetkisiz erişim, kayıp veya kötüye
                kullanıma karşı uygun teknik ve idari güvenlik önlemleriyle
                korunmaktadır. Verileriniz üçüncü kişilerle paylaşılmaz.
              </p>
            </div>

            {/* HAKLARINIZ */}
            <div className="content-section">
              <h2>KVKK Kapsamında Haklarınız</h2>
              <p>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
              <ul>
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                <li>
                  İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını
                  öğrenme
                </li>
                <li>
                  Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri
                  bilme
                </li>
                <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
                <li>Silinmesini veya yok edilmesini isteme</li>
                <li>
                  Yapılan düzeltme, silme ve yok etme işlemlerinin üçüncü
                  kişilere bildirilmesini isteme
                </li>
                <li>
                  Münhasıran otomatik sistemler ile analiz edilmesi nedeniyle
                  aleyhinize bir sonuç doğmasına itiraz etme
                </li>
                <li>
                  Kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız
                  hâlinde zararın giderilmesini talep etme
                </li>
              </ul>
            </div>

            {/* DEĞİŞİKLİKLER */}
            <div className="content-section">
              <h2>Politika Değişiklikleri</h2>
              <p>
                Bu gizlilik politikası zaman zaman güncellenebilir. Önemli
                değişiklikler olduğunda web sitemizde duyuru yapılacaktır.
              </p>
              <p className="update-date">
                <strong>Son Güncelleme:</strong> Aralık 2024
              </p>
            </div>

            {/* İLETİŞİM */}
            <div className="content-section contact-section">
              <h2>İletişim</h2>
              <p>
                Gizlilik politikamız veya kişisel verileriniz hakkında
                sorularınız için bizimle iletişime geçebilirsiniz:
              </p>
              <div className="contact-info">
                <p>
                  <strong>E-posta:</strong> savtek@ktun.edu.tr
                </p>
                <p>
                  <strong>Adres:</strong> Konya Teknik Üniversitesi,
                  Selçuklu/Konya
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Gizlilik;
