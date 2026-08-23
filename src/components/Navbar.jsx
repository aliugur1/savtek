import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import ThemeToggle from "./ThemeToggle";
import "../styles/navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const { user, demoRole, signOut, clearDemoSession } = useAuth();

  const isSignedIn = !!user || demoRole === "captain";
  const authPath = useMemo(() => (isSignedIn ? "/panel" : "/giris"), [isSignedIn]);
  const authLabel = useMemo(() => (isSignedIn ? "Panel" : "Giriş"), [isSignedIn]);

  const handleLogout = async () => {
    if (!window.confirm("Çıkış yapmak istiyor musunuz?")) return;
    try {
      clearDemoSession?.();
      await signOut?.();
    } catch {
      // ignore
    }
    closeMenu();
    navigate("/");
  };

  // Body scroll kilidi - menü veya modal açıkken scroll engelle
  useEffect(() => {
    const shouldLock = menuOpen;
    document.body.style.overflow = shouldLock ? "hidden" : "auto";

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
          <NavLink to="/tg" className={navLinkClass}>
            TG'25
          </NavLink>
          <NavLink to="/ekip" className={navLinkClass}>
            Ekibimiz
          </NavLink>
          <NavLink to="/galeri" className={navLinkClass}>
            Galeri
          </NavLink>
          <NavLink to="/projeler" className={navLinkClass}>
            Projeler
          </NavLink>
          <NavLink to="/basvuru" className={navLinkClass}>
            Başvuru
          </NavLink>
          <a href="/#iletisim" className="nav-item">
            İletişim
          </a>
        </nav>

        {/* AUTH LINK (DESKTOP) */}
        <div className="nav-auth-wrapper">
          <ThemeToggle />
          <NavLink to={authPath} className="nav-auth-link" aria-label={authLabel}>
            <span className="nav-auth-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 12a4.25 4.25 0 1 0-4.25-4.25A4.25 4.25 0 0 0 12 12Zm0 2.25c-4.05 0-7.5 2.06-7.5 4.5 0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25 0-2.44-3.45-4.5-7.5-4.5Z"
                />
              </svg>
            </span>
            <span className="nav-auth-text">{authLabel}</span>
          </NavLink>

          {isSignedIn && (
            <div className="nav-auth-dropdown" role="menu" aria-label="Hesap">
              <button
                type="button"
                className="nav-auth-dropdown-item"
                onClick={handleLogout}
                role="menuitem"
              >
                Çıkış Yap
              </button>
            </div>
          )}
        </div>

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

          <NavLink to="/tg" onClick={closeMenu} className={navLinkClass}>
            TG'25
          </NavLink>

          <NavLink to="/ekip" onClick={closeMenu} className={navLinkClass}>
            Ekibimiz
          </NavLink>

          <NavLink to="/galeri" onClick={closeMenu} className={navLinkClass}>
            Galeri
          </NavLink>

          <NavLink to="/projeler" onClick={closeMenu} className={navLinkClass}>
            Projeler
          </NavLink>

          <NavLink to="/basvuru" onClick={closeMenu} className={navLinkClass}>
            Başvuru
          </NavLink>

          <a href="/#iletisim" onClick={closeMenu}>
            İletişim
          </a>

          <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
            <ThemeToggle />
          </div>

          <button
            className="mobile-auth-btn"
            type="button"
            onClick={() => {
              closeMenu();
              navigate(authPath);
            }}
          >
            {isSignedIn ? "Panel" : "Giriş"}
          </button>

          {isSignedIn && (
            <button
              className="mobile-auth-btn"
              type="button"
              onClick={handleLogout}
            >
              Çıkış Yap
            </button>
          )}
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
