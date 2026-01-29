import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLog } from "../utils/adminLogger";
import "../styles/admin.css";

function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      // Admin password from environment variable (production için güvenli)
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

      if (password === adminPassword) {
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminToken", "demo-token-" + Date.now());

        // Log successful login
        createLog("login", "system", null, { success: true });

        navigate("/admin");
      } else {
        setError("Hatalı şifre! Lütfen tekrar deneyin.");
        // Log failed login attempt
        createLog("login", "system", null, {
          success: false,
          reason: "wrong_password",
        });
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <img src="/logo.png" alt="SAVTEK" className="login-logo" />
          <h1>Admin Paneli</h1>
          <p>Devam etmek için giriş yapın</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(""); // Clear error on input
              }}
              placeholder="Şifrenizi girin"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2025 SAVTEK - Tüm hakları saklıdır</p>
          {import.meta.env.DEV && (
            <p className="login-hint">Demo şifre: admin123</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
