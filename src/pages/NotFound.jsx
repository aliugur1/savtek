import { Link } from "react-router-dom";
import "../styles/not-found.css";

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-number">404</div>
        <h1>Sayfa Bulunamadı</h1>
        <p>
          Aradığınız sayfa mevcut değil veya taşınmış olabilir. Lütfen URL'yi
          kontrol edin veya ana sayfaya dönün.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn-primary">
            Ana Sayfaya Dön
          </Link>
          <Link to="/etkinlikler" className="btn-secondary">
            Etkinlikleri Gör
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
