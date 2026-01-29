import Sponsors from "../components/Sponsors";
import SEOMeta from "../components/SEOMeta";
import "../styles/hakkimizda.css";

function Hakkimizda() {
  return (
    <>
      <SEOMeta
        title="Hakkımızda | SAVTEK"
        description="SAVTEK - Savunma Teknolojileri Topluluğu hakkında bilgiler. Vizyonumuz, misyonumuz, tarihçemiz ve değerlerimiz."
        image="/logo.png"
        url={typeof window !== "undefined" ? window.location.href : ""}
      />
      <main className="hakkimizda-page">
        {/* HERO - BİZ KİMİZ */}
        <section className="about-hero">
          <div className="container">
            <div className="hero-split-grid">
              {/* SOL - METİN */}
              <div className="hero-text-content">
                <span className="section-label">HAKKIMIZDA</span>
                <h1>Biz Kimiz?</h1>
                <div className="hero-content">
                  <p className="lead">
                    <strong>SAVTEK – Savunma Teknolojileri Topluluğu</strong>,
                    Konya Teknik Üniversitesi bünyesinde faaliyet gösteren;
                    mühendislik bilgisini savunma teknolojileri odağında üretime
                    dönüştürmeyi amaçlayan bir öğrenci topluluğudur.
                  </p>
                  <p>
                    Topluluğumuz, teorik bilgiyi projelerle pekiştiren,
                    disiplinler arası ekip çalışmasını merkeze alan ve
                    öğrencileri yalnızca öğrenen değil,{" "}
                    <strong>üreten bireyler</strong> haline getirmeyi hedefleyen
                    bir yapı üzerine kuruludur.
                  </p>
                  <p>
                    SAVTEK için savunma teknolojileri; sadece bir alan değil,{" "}
                    <strong>sorumluluk bilinciyle yaklaşılması gereken</strong>{" "}
                    bir mühendislik kültürüdür.
                  </p>
                </div>
              </div>

              {/* SAĞ - GÖRSEL */}
              <div className="hero-visual">
                <img src="/hero-anka.png" alt="SAVTEK" className="hero-image" />
              </div>
            </div>
          </div>
        </section>

        {/* TARİHÇE */}
        <section className="about-section tarihce">
          <div className="container">
            <div className="section-grid">
              <div className="section-left">
                <span className="section-label">TARİHÇE</span>
                <h2>Başlangıçtan Bugüne</h2>
              </div>
              <div className="section-right">
                <p className="year-highlight">
                  <strong>2019</strong>
                </p>
                <p>
                  SAVTEK, <strong>2019 yılında</strong> savunma ve mühendislik
                  teknolojilerine ilgi duyan öğrenciler tarafından kurulmuştur.
                </p>
                <p>
                  Kuruluş amacı; üniversite öğrencilerinin savunma sanayisine
                  yönelik proje geliştirme süreçlerinde aktif rol
                  alabilecekleri, teknik yetkinliklerini artırabilecekleri ve
                  takım çalışması kültürünü deneyimleyebilecekleri bir ortam
                  oluşturmaktı.
                </p>

                <div className="timeline-items">
                  <div className="timeline-item">
                    <div className="timeline-badge">
                      <span className="badge-year">2019</span>
                    </div>
                    <div className="timeline-content">
                      <span className="timeline-icon">📈</span>
                      <p>Takım sayısını artırmış</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-badge">
                      <span className="badge-year">2021</span>
                    </div>
                    <div className="timeline-content">
                      <span className="timeline-icon">🔧</span>
                      <p>Proje tabanlı çalışmaları yaygınlaştırmış</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-badge">
                      <span className="badge-year">2023</span>
                    </div>
                    <div className="timeline-content">
                      <span className="timeline-icon">🏆</span>
                      <p>
                        Ulusal yarışmalar ve Ar-Ge faaliyetleriyle aktif bir
                        yapı haline gelmiştir
                      </p>
                    </div>
                  </div>
                </div>

                <p className="highlight-text">
                  Bugün SAVTEK, yalnızca bir topluluk değil;{" "}
                  <strong>sürekli gelişen bir mühendislik ekosistemi</strong>{" "}
                  olarak faaliyetlerini sürdürmektedir.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VİZYON & MİSYON */}
        <section className="about-section vizyon-misyon">
          <div className="container">
            <div className="vm-grid">
              {/* VİZYON */}
              <div className="vm-card vizyon">
                <span className="vm-icon">🎯</span>
                <h3>Vizyonumuz</h3>
                <p>
                  Savunma teknolojileri alanında bilgi üreten, proje geliştiren
                  ve sektörle güçlü bağlar kuran; mezunlarıyla fark yaratan öncü
                  bir öğrenci topluluğu olmak.
                </p>
              </div>

              {/* MİSYON */}
              <div className="vm-card misyon">
                <span className="vm-icon">🚀</span>
                <h3>Misyonumuz</h3>
                <ul>
                  <li>
                    Öğrencilere gerçek mühendislik problemleri üzerinde çalışma
                    imkânı sunmak
                  </li>
                  <li>Teorik eğitimi proje ve uygulamalarla desteklemek</li>
                  <li>
                    Takım çalışması, disiplin ve sorumluluk bilinci kazandırmak
                  </li>
                  <li>
                    Savunma sanayisine nitelikli ve bilinçli mühendisler
                    yetişmesine katkı sağlamak
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* KÜLTÜR & DEĞERLERİMİZ */}
        <section className="about-section degerler">
          <div className="container">
            <div className="section-header-center">
              <span className="section-label">KÜLTÜR & DEĞERLERİMİZ</span>
              <h2>Nasıl Çalışıyoruz?</h2>
              <p>
                SAVTEK kültürü, yalnızca teknik bilgiye değil; nasıl
                çalıştığımıza da odaklanır.
              </p>
            </div>

            <div className="degerler-grid">
              <div className="deger-card">
                <span className="deger-icon">💡</span>
                <h4>Üretmek</h4>
                <p>Fikirleri projeye, projeleri somut çıktılara dönüştürmek</p>
              </div>

              <div className="deger-card">
                <span className="deger-icon">⚡</span>
                <h4>Disiplin</h4>
                <p>Mühendislik süreçlerinde ciddiyet ve süreklilik</p>
              </div>

              <div className="deger-card">
                <span className="deger-icon">🤝</span>
                <h4>Takım Ruhu</h4>
                <p>Farklı disiplinleri ortak bir hedefte birleştirmek</p>
              </div>

              <div className="deger-card">
                <span className="deger-icon">🎯</span>
                <h4>Sorumluluk</h4>
                <p>Yapılan işin teknik ve etik sorumluluğunu taşımak</p>
              </div>
            </div>

            <p className="degerler-footer">
              Bu değerler; takımlarımızın, etkinliklerimizin ve içerik
              üretimlerimizin temelini oluşturur.
            </p>
          </div>
        </section>

        {/* SPONSORLAR */}
        <Sponsors showHeader={false} />

        {/* EKİP */}
        <section className="about-section ekip">
          <div className="container">
            <div className="section-header-center">
              <span className="section-label">EKİP</span>
              <h2>Birlikte Üretiyoruz</h2>
              <p>
                SAVTEK, farklı mühendislik disiplinlerinden gelen öğrencilerin
                oluşturduğu geniş ve dinamik bir ekipten oluşur.
              </p>
            </div>

            <div className="ekip-structure">
              <div className="structure-item">
                <span className="structure-number">01</span>
                <h4>Yönetim Ekibi</h4>
                <p>Topluluğun stratejik yönünü belirleyen liderlik kadrosu</p>
              </div>

              <div className="structure-item">
                <span className="structure-number">02</span>
                <h4>Aktif Proje Takımları</h4>
                <p>Teknofest ve TÜBİTAK projelerinde çalışan teknik ekipler</p>
              </div>

              <div className="structure-item">
                <span className="structure-number">03</span>
                <h4>Gönüllü Üyeler</h4>
                <p>
                  Etkinlik, sosyal medya ve organizasyonda destek veren ekip
                </p>
              </div>
            </div>

            <div className="ekip-photo-placeholder">
              <div className="photo-overlay">
                <p>📸 Ekip Fotoğrafı</p>
                <span>Toplu ekip fotoğrafı buraya eklenecek</span>
              </div>
            </div>

            <p className="ekip-footer">
              Tek bir ekip olarak ortak hedefimiz;{" "}
              <strong>öğrenmek, üretmek ve birlikte gelişmektir.</strong>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default Hakkimizda;
