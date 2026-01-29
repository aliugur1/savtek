import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sponsors from "../components/Sponsors";
import SEOMeta from "../components/SEOMeta";
import { getActiveItems } from "../utils/softDelete";
import "../styles/takim.css";

function Takimlar() {
  const [teams, setTeams] = useState([]);

  // LocalStorage'dan takımları yükle
  useEffect(() => {
    const savedTakimlar = localStorage.getItem("takimlar");
    if (savedTakimlar) {
      // Sadece aktif (silinmemiş) takımları göster
      setTeams(getActiveItems("takimlar"));
    } else {
      // Varsayılan dummy data
      const dummyTeams = [
        {
          id: 1,
          name: "ALTAY",
          area: "TEKNOFEST · Kara Araçları",
          description: "İnsansız kara aracı geliştirme ve yarışma takımı",
          image: "/hero-anka.png",
          badge: "Aktif Takım",
          slug: "altay",
        },
        {
          id: 2,
          name: "DEVİNİM",
          area: "TEKNOFEST · Mekanik Tasarım",
          description: "Mekanik sistem tasarım ve üretim takımı",
          image: "/hero-anka.png",
          badge: "Aktif Takım",
          slug: "devinim",
        },
        {
          id: 3,
          name: "Su Altı Sistemleri",
          area: "Su Altı Araçları",
          description: "İnsansız su altı aracı geliştirme takımı",
          image: "/hero-anka.png",
          badge: "Takım Adı Belirlenecek",
          slug: "su-alti",
        },
        {
          id: 4,
          name: "Model Uydu Yarışmaları",
          area: "Model Uydu",
          description: "Model uydu tasarım ve yarışma takımı",
          image: "/hero-anka.png",
          badge: "Takım Adı Belirlenecek",
          slug: "model-uydu",
        },
        {
          id: 5,
          name: "TÜBİTAK Projeleri",
          area: "Ar-Ge ve İnovasyon",
          description: "TÜBİTAK destekli projeler geliştiren takım",
          image: "/hero-anka.png",
          badge: "Takım Adı Belirlenecek",
          slug: "tubitak",
        },
        {
          id: 6,
          name: "Sosyal Fayda Projeleri",
          area: "İnsanlık Yararına",
          description: "Toplumsal fayda odaklı proje geliştirme takımı",
          image: "/hero-anka.png",
          badge: "Takım Adı Belirlenecek",
          slug: "insanlik-yararina",
        },
        {
          id: 7,
          name: "İnsansız Hava Araçları",
          area: "İHA Sistemleri",
          description: "İnsansız hava aracı geliştirme takımı",
          image: "/hero-anka.png",
          badge: "Takım Adı Belirlenecek",
          slug: "iha",
        },
        {
          id: 8,
          name: "İnsansız Kara Araçları",
          area: "İKA Sistemleri",
          description: "Otonom kara aracı geliştirme takımı",
          image: "/hero-anka.png",
          badge: "Takım Adı Belirlenecek",
          slug: "ika",
        },
        {
          id: 9,
          name: "Roket Sistemleri",
          area: "Roket Yarışmaları",
          description: "Roket tasarım ve yarışma takımı",
          image: "/hero-anka.png",
          badge: "Takım Adı Belirlenecek",
          slug: "roket",
        },
      ];
      setTeams(dummyTeams);
      localStorage.setItem("takimlar", JSON.stringify(dummyTeams));
    }
  }, []);

  return (
    <>
      <SEOMeta
        title="Takımlar | SAVTEK"
        description="SAVTEK bünyesinde faaliyet gösteren takımlarımız. İnsansız hava araçları, roket, kara araçları, su altı sistemleri ve daha fazlası."
        image="/logo.png"
        url={typeof window !== "undefined" ? window.location.href : ""}
      />
      <main className="takimlar-page">
        {/* HERO */}
        <section className="takimlar-hero">
          <div className="container">
            <span className="section-label">TAKIMLARIMIZ</span>
            <h1>SAVTEK Takımları</h1>
            <p className="hero-subtitle">
              Farklı disiplinlerde araştırma, geliştirme ve yarışma faaliyetleri
              yürüten teknik ekiplerimiz.
            </p>
          </div>
        </section>

        {/* TAKIMLAR GRİD */}
        <section className="teams-section">
          <div className="container">
            <div className="teams-grid">
              {teams.map((team) => (
                <Link
                  key={team.id}
                  to={`/takimlar/${team.slug}`}
                  className="team-card"
                >
                  <div className="team-image">
                    <img src={team.image} alt={team.name} loading="lazy" />
                    <div
                      className={`team-badge ${
                        team.badge === "Aktif Takım"
                          ? "badge-active"
                          : "badge-pending"
                      }`}
                    >
                      {team.badge}
                    </div>
                  </div>
                  <div className="team-content">
                    <span className="team-area">{team.area}</span>
                    <h3>{team.name}</h3>
                    <p>{team.shortDescription || team.description}</p>
                    <span className="team-link">Detaylı Bilgi →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SPONSORLAR */}
        <Sponsors showHeader={false} />
      </main>
    </>
  );
}

export default Takimlar;
