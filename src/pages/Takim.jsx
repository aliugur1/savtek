import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sponsors from "../components/Sponsors";
import SEOMeta from "../components/SEOMeta";
import { getTeams } from "../lib/dataService";
import "../styles/takim.css";

function Takimlar() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    getTeams().then(setTeams);
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
