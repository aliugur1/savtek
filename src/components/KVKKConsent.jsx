import { useState, useEffect } from "react";
import "../styles/kvkk-consent.css";

function KVKKConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem("kvkk-consent");
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("kvkk-consent", "accepted");
    localStorage.setItem("kvkk-consent-date", new Date().toISOString());
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem("kvkk-consent", "rejected");
    localStorage.setItem("kvkk-consent-date", new Date().toISOString());
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      className="kvkk-banner"
      role="dialog"
      aria-label="Çerez ve Gizlilik Bildirimi"
    >
      <div className="kvkk-content">
        <div className="kvkk-text">
          <h4>🍪 Çerezler ve Gizlilik</h4>
          <p>
            Bu web sitesi, deneyiminizi iyileştirmek için çerezler kullanır.
            KVKK kapsamında kişisel verilerinizin korunmasına önem veriyoruz.
            Detaylı bilgi için{" "}
            <a
              href="/gizlilik-politikasi"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Gizlilik Politikamız sayfasını aç"
            >
              Gizlilik Politikamız
            </a>{" "}
            sayfasını ziyaret edebilirsiniz.
          </p>
        </div>
        <div className="kvkk-actions">
          <button
            onClick={handleAccept}
            className="btn-accept"
            aria-label="Çerezleri kabul et"
          >
            Kabul Et
          </button>
          <button
            onClick={handleReject}
            className="btn-reject"
            aria-label="Çerezleri reddet"
          >
            Reddet
          </button>
        </div>
      </div>
    </div>
  );
}

export default KVKKConsent;
