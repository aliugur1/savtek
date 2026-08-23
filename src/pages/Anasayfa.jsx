import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import Sponsors from "../components/Sponsors";
import { getTeams, getEvents, getEkip } from "../lib/dataService";
import "../styles/anasayfa.css";

function Anasayfa() {
  const formRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ text: "", success: false });
  const [featuredTeams, setFeaturedTeams] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [yonetimEkibi, setYonetimEkibi] = useState([]);

  useEffect(() => {
    getTeams().then(teams => {
      setFeaturedTeams(
        teams.filter(t => t.featured).sort((a, b) => (a.order || 999) - (b.order || 999))
      );
    });
    getEvents().then(events => {
      setRecentEvents(
        [...events].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)
      );
    });
    getEkip().then(ekip => {
      setYonetimEkibi(
        ekip.filter(u => u.category === "Yönetim").sort((a, b) => (a.order || 999) - (b.order || 999))
      );
    });
  }, []);

  // EmailJS form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    // EmailJS credentials
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then(() => {
        setSubmitMessage({ text: "Mesajınız başarıyla gönderildi!", success: true });
        formRef.current.reset();
      })
      .catch((error) => {
        setSubmitMessage({ text: "Bir hata oluştu. Lütfen tekrar deneyin.", success: false });
        console.error("EmailJS Error:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Social media links data
  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/ktunsavtek?igsh=YTBjdTQ2Y3czaDRw",
      icon: (
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      ),
    },
    {
      name: "X (Twitter)",
      url: "https://twitter.com/ktunsavtek",
      icon: (
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      ),
    },
    {
      name: "WhatsApp",
      url: "https://chat.whatsapp.com/H08Emi0qWAX8pcGaByQxdD",
      icon: (
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      ),
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/savunma-teknolojileri-toplulu%C4%9Fu/",
      icon: (
        <path d="M20.447 20.452h-3.554v-5.569c0-1.327-.027-3.037-1.851-3.037-1.851 0-2.134 1.445-2.134 2.939v5.667H9.354V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.368-1.85 3.6 0 4.265 2.368 4.265 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
      ),
    },
  ];


  return (
    <main className="home">
      {/* ========================================
          HERO SECTION - GÖRSEL
      ======================================== */}
      <section className="hero-anka">
        <div className="hero-anka-overlay">
          <span className="hero-uni">KONYA TEKNİK ÜNİVERSİTESİ</span>
          <h1 className="hero-title">SAVTEK</h1>
          <span className="hero-sub">Savunma Teknolojileri Topluluğu</span>
        </div>

        {/* Social Media Icons */}
        <div className="hero-socials">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {social.icon}
              </svg>
            </a>
          ))}
        </div>
      </section>

      {/* ========================================
          HERO TEXT SECTION
      ======================================== */}
      <section className="hero-text hero-split">
        <div className="hero-text-left">
          <span className="hero-badge">
            SAVTEK · Savunma Teknolojileri Topluluğu
          </span>

          <h2>
            Geleceğin mühendisleri <span>SAVTEK'te</span> yetişiyor.
          </h2>

          <p>
            İnsansız hava araçları, roket, kara araçları, insansız su üstü / su
            altı sistemleri ve daha fazlası… SAVTEK, mühendislik ve savunma
            teknolojilerini bir araya getiren öğrenci topluluğudur.
          </p>

          <div className="hero-actions">
            <Link to="/takimlar" className="btn-primary btn-primary-active">
              Takımlarımızı keşfet
            </Link>
            <a
              href="https://discord.gg/savtek"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary btn-secondary-hover"
              style={{ backgroundColor: '#5865F2', color: 'white', border: 'none' }}
            >
              Aramıza Katıl (Discord)
            </a>
          </div>

          <div className="hero-stats">
            <span>6+ aktif takım</span>
            <span>Teknofest & TÜBİTAK projeleri</span>
          </div>
        </div>

        <div className="hero-text-right">
          <div className="hero-mini-image" />
        </div>
      </section>

      {/* ========================================
          HAKKIMIZDA SECTION
      ======================================== */}
      <section className="home-about">
        <div className="home-about-inner">
          <div className="about-text">
            <span className="section-label">HAKKIMIZDA</span>

            <h2>
              Savunma teknolojilerinde
              <br />
              öğrenci gücü
            </h2>

            <p>
              SAVTEK, Konya Teknik Üniversitesi bünyesinde faaliyet gösteren,
              savunma ve mühendislik teknolojileri alanında çalışan bir öğrenci
              topluluğudur. Üyelerine teknik bilgi, proje deneyimi ve takım
              çalışması kültürü kazandırmayı hedefler.
            </p>

            <div className="about-highlights">
              <div className="highlight-item">
                <span className="highlight-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                  </svg>
                </span>
                <h4>Proje Odaklı Çalışma</h4>
                <p>Gerçek mühendislik problemlerine çözüm üreten takımlar.</p>
              </div>

              <div className="highlight-item">
                <span className="highlight-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
                  </svg>
                </span>
                <h4>Yarışma & Ar-Ge</h4>
                <p>TEKNOFEST ve TÜBİTAK projeleriyle ulusal arenada yer alıyoruz.</p>
              </div>

              <div className="highlight-item">
                <span className="highlight-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#ff8c00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </span>
                <h4>Takım Kültürü</h4>
                <p>Disiplinler arası ekipler ile birlikte üretme deneyimi.</p>
              </div>
            </div>

            <p className="about-one-liner">
              SAVTEK, öğrenciyi izleyici değil, <strong>üretici</strong> yapan
              bir topluluktur.
            </p>

            <Link to="/hakkimizda" className="btn-outline">
              Hakkımızda daha fazlası →
            </Link>
          </div>

          <div className="about-stats">
            <div className="stat-item">
              <h3>2019</h3>
              <span>Kuruluş</span>
            </div>
            <div className="stat-item">
              <h3>6+</h3>
              <span>Aktif Takım</span>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <span>Aktif Üye</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          YÖNETİM EKİBİ
      ======================================== */}
      <section className="team-section">
        <div className="team-header">
          <h2>Yönetim Ekibimiz</h2>
        </div>

        <div className="team-grid">
          {yonetimEkibi.map((member) => (
            <div key={member.id} className="team-card">
              <div className="team-image">
                <img src={member.photo} alt={member.name} />

                <div className="team-socials">
                  {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.8-3-1.8 0-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.4-.9 1.6-1.8 3.3-1.8 3.6 0 4.3 2.4 4.3 5.4v6.2zM5.3 7.4c-1.2 0-2.1-.9-2.1-2.1s.9-2.1 2.1-2.1 2.1.9 2.1 2.1-.9 2.1-2.1 2.1zM7 20.4H3.5V9H7v11.4z" />
                    </svg>
                  </a>
                  )}
                  {member.instagram && (
                  <a href={member.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  )}
                </div>
              </div>

              <div className="team-info">
                <h4>{member.name}</h4>
                <span>{member.role}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="team-cta">
          <Link to="/ekip" className="btn-outline">
            Ekip Arkadaşlarımızı Gör →
          </Link>
        </div>
      </section>

      {/* ========================================
          ÖNEÇIKAN TAKIMLAR
      ======================================== */}
      <section className="home-teams">
        <div className="container">
          <div className="section-header">
            <span className="section-label">TAKIMLARIMIZ</span>
            <h2>Öne Çıkan Takımlarımız</h2>
            <p>
              SAVTEK bünyesinde farklı disiplinlerde çalışan öne çıkan
              takımlarımız.
            </p>
          </div>

          <div className="teams-grid">
            {featuredTeams.length > 0 ? (
              featuredTeams.map((team) => (
                <Link
                  key={team.id}
                  to={`/takimlar/${team.slug}`}
                  className="team-card-home"
                >
                  <div className="team-image-home">
                    <img src={team.image} alt={team.name} loading="lazy" />
                  </div>
                  <span className="team-category">{team.area}</span>
                  <h4>{team.name}</h4>
                  <p>
                    {team.shortDescription ||
                      team.description ||
                      "Takım açıklaması buraya gelecek."}
                  </p>
                  <span className="team-link">Takımı incele →</span>
                </Link>
              ))
            ) : (
              <div
                style={{ textAlign: "center", padding: "40px", color: "#666" }}
              >
                <p>Yakında takımlarımızı burada görebileceksiniz.</p>
              </div>
            )}
          </div>

          <div className="section-cta">
            <Link to="/takimlar" className="btn-outline">
              Tüm Takımları Gör →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================
          SPONSORLAR
      ======================================== */}
      <Sponsors />

      {/* ========================================
          ETKİNLİKLER (Admin'den Son 3)
      ======================================== */}
      <section className="home-etkinlikler">
        <div className="container">
          <div className="section-header">
            <span className="section-label">ETKİNLİKLER</span>
            <h2>Yaklaşan Etkinliklerimiz</h2>
            <p>
              Workshop'lar, seminerler ve teknik gezilerimiz hakkında güncel
              bilgiler.
            </p>
          </div>

          <div className="etkinlik-grid">
            {recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <article key={event.id} className="etkinlik-card-home">
                  <span className="etkinlik-category">
                    {event.category || "Etkinlik"}
                  </span>
                  <h3>{event.title}</h3>
                  <p>{event.description || event.shortDescription}</p>
                  <span className="etkinlik-date">
                    📅{" "}
                    {new Date(event.date).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <Link
                    to={`/etkinlikler/${event.slug}`}
                    className="etkinlik-link"
                  >
                    Detaylı Bilgi →
                  </Link>
                </article>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#666",
                  gridColumn: "1 / -1",
                }}
              >
                <p>Yaklaşan etkinliklerimiz için bizi takip edin.</p>
              </div>
            )}
          </div>

          <div className="section-cta">
            <Link to="/etkinlikler" className="btn-outline">
              Tüm Etkinlikleri Gör →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================
          SSS (Sıkça Sorulan Sorular)
      ======================================== */}
      <section className="home-faq">
        <div className="container">
          <div className="section-header">
            <span className="section-label">SSS</span>
            <h2>Sıkça Sorulan Sorular</h2>
            <p>Topluluğumuz hakkında merak ettiğiniz soruların cevapları.</p>
          </div>

          <div className="faq-list">
            {[
              { q: "Topluluğa kimler katılabilir?", a: "Konya Teknik Üniversitesi'nde okuyan ve savunma sanayii, teknoloji ve mühendisliğe ilgi duyan her öğrenci topluluğumuza katılabilir." },
              { q: "İHA veya Roket takımına girmek için ne bilmeliyim?", a: "Önceden bir bilgi zorunluluğu yoktur. Temel eğitimler ekiplerimiz tarafından verilmektedir. Önemli olan öğrenmeye istekli olmanızdır." },
              { q: "Üyelik ücretli mi?", a: "Hayır, SAVTEK etkinliklerine katılım ve topluluk üyeliği tamamen ücretsizdir." }
            ].map((faq, idx) => (
              <details key={idx} className="faq-item">
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          İLETİŞİM
      ======================================== */}
      <section className="home-contact" id="iletisim">
        <div className="container">
          <div className="section-header">
            <span className="section-label">İLETİŞİM</span>
            <h2>Bizimle İletişime Geç</h2>
            <p>
              SAVTEK ile ilgili sorularınız, iş birlikleri veya topluluğumuza
              katılım hakkında bizimle iletişime geçebilirsiniz.
            </p>
          </div>

          <div className="contact-grid">
            {/* İletişim Bilgileri */}
            <div className="contact-info">
              <div className="contact-item">
                <h4>E-posta</h4>
                <p>
                  <a href="mailto:savtek@ktun.edu.tr">savtek@ktun.edu.tr</a>
                </p>
              </div>

              <div className="contact-item">
                <h4>Sosyal Medya</h4>
                <div className="contact-socials">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon-link"
                      aria-label={social.name}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        {social.icon}
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              <div className="contact-item">
                <h4>Konum</h4>
                <p className="location-text">
                  Konya Teknik Üniversitesi
                  <br />
                  Mühendislik Fakültesi
                </p>

                <div className="map-container">
                  <iframe
                    src="https://www.google.com/maps?q=Konya+Teknik+Üniversitesi+Mühendislik+Fakültesi&output=embed"
                    width="100%"
                    height="250"
                    style={{ border: 0, borderRadius: "12px" }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="KTÜN Mühendislik Fakültesi"
                  />
                </div>
              </div>
            </div>

            {/* İletişim Formu */}
            <div className="contact-form">
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="from_name" className="form-label">Ad Soyad</label>
                  <input
                    id="from_name"
                    type="text"
                    name="from_name"
                    placeholder="Ad Soyad"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="from_email" className="form-label">E-posta</label>
                  <input
                    id="from_email"
                    type="email"
                    name="from_email"
                    placeholder="ornek@mail.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">Mesajınız</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Mesajınızı buraya yazın..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Gönderiliyor..." : "Mesaj Gönder"}
                </button>

                {submitMessage.text && (
                  <p className={`submit-message ${submitMessage.success ? "success" : "error"}`}>
                    {submitMessage.success ? "✅" : "❌"} {submitMessage.text}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Anasayfa;
