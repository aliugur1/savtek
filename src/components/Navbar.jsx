import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // Body scroll kilidi - menü açıkken scroll engelle
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);
  // Scroll algılama
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Menü kapatma fonksiyonu
  const closeMenu = () => setMenuOpen(false);
  // NavLink için active class
  const navLinkClass = ({ isActive }) => `nav-item ${isActive ? "active" : ""}`;

  return (
    <header className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="container nav-container">
        {/* LOGO */}
        <NavLink to="/" className="nav-logo" onClick={closeMenu}>
          <img src="/logo.png" alt="SAVTEK Logo" />
          <img src="/yazi.png" alt="SAVTEK yazı" />
        </NavLink>
        {/* DESKTOP MENU */}
        <nav className="nav-links" aria-label="Ana menü">
          <NavLink to="/" className={navLinkClass}>
            Anasayfa
          </NavLink>
          <NavLink to="/hakkimizda" className={navLinkClass}>
            Hakkımızda
          </NavLink>
          <NavLink to="/takimlar" className={navLinkClass}>
            Takımlar
          </NavLink>
          <NavLink to="/etkinlikler" className={navLinkClass}>
            Etkinlikler
          </NavLink>
          <NavLink to="/TG" className={navLinkClass}>
            TG'25
          </NavLink>
          <NavLink to="/ekip" className={navLinkClass}>
            Ekibimiz
          </NavLink>
          <a href="/#iletisim" className="nav-item">
            İletişim
          </a>
        </nav>
        {/* HAMBURGER BUTTON */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <nav aria-label="Mobil menü">
          <NavLink to="/" onClick={closeMenu} className={navLinkClass}>
            Anasayfa
          </NavLink>

          <NavLink
            to="/hakkimizda"
            onClick={closeMenu}
            className={navLinkClass}
          >
            Hakkımızda
          </NavLink>

          <NavLink to="/takimlar" onClick={closeMenu} className={navLinkClass}>
            Takımlar
          </NavLink>

          <NavLink
            to="/etkinlikler"
            onClick={closeMenu}
            className={navLinkClass}
          >
            Etkinlikler
          </NavLink>

          <NavLink to="/ekip" onClick={closeMenu} className={navLinkClass}>
            Ekibimiz
          </NavLink>

          <a href="/#iletisim" onClick={closeMenu}>
            İletişim
          </a>
        </nav>
      </div>
      {/* OVERLAY - Menü açıkken arka planı karart */}
      {menuOpen && (
        <div
          className="mobile-overlay"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
}

export default Navbar;
