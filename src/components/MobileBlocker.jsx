import { useEffect, useState } from "react";
import "../styles/admin.css";

function MobileBlocker({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setIsMobile(width < 1024); // 1024px altı mobil/tablet olarak kabul
    };
    // İlk kontrol
    checkMobile();
    // Resize listener
    window.addEventListener("resize", checkMobile);
    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="mobile-blocked">
        <div className="mobile-blocked-content">
          <div className="blocked-icon">🖥️</div>
          <h2>Admin Paneli Sadece Masaüstünden Erişilebilir</h2>
          <p>
            Admin panelini kullanmak için lütfen bir bilgisayar veya daha büyük
            ekranlı bir cihazdan giriş yapın.
          </p>

          <div className="blocked-info">
            <p>
              <strong>Minimum Ekran Genişliği:</strong> 1024px
            </p>
            <p>
              <strong>Mevcut Ekran:</strong> {screenWidth}px
            </p>
            <p>
              <strong>Kalan:</strong> {1024 - screenWidth}px daha büyük ekran
              gerekli
            </p>
          </div>

          <div className="blocked-tips">
            <p>
              <strong>💡 İpucu:</strong>
            </p>
            <ul>
              <li>Bilgisayarınızdan tekrar deneyin</li>
              <li>Tablet kullanıyorsanız yatay moda geçin</li>
              <li>Tarayıcı pencerenizi tam ekran yapın</li>
            </ul>
          </div>

          <a
            href="/"
            className="btn-back-home"
            style={{
              display: "inline-block",
              marginTop: "24px",
              padding: "12px 24px",
              background: "#ff8c00",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
          >
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    );
  }

  return children;
}

export default MobileBlocker;
