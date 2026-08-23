import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { createLog } from "../utils/adminLogger";
import "../styles/admin.css";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 1000;

function getAttempts() {
  try {
    const raw = localStorage.getItem("login-attempts");
    return raw ? JSON.parse(raw) : { count: 0, lockedUntil: null };
  } catch {
    return { count: 0, lockedUntil: null };
  }
}

function saveAttempts(data) {
  try {
    localStorage.setItem("login-attempts", JSON.stringify(data));
  } catch {
    // ignore
  }
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithPassword } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const attempts = getAttempts();
    if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
      const secs = Math.ceil((attempts.lockedUntil - Date.now()) / 1000);
      setError(`Çok fazla hatalı giriş. ${secs} saniye bekleyin.`);
      return;
    }

    setLoading(true);
    const { error: authError } = await signInWithPassword(email, password);

    if (authError) {
      const newCount = (attempts.count || 0) + 1;
      const lockedUntil = newCount >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : null;
      saveAttempts({ count: newCount, lockedUntil });
      setError(
        newCount >= MAX_ATTEMPTS
          ? `Çok fazla hatalı giriş. 60 saniye bekleyin.`
          : "Hatalı e-posta veya şifre."
      );
      createLog("login", "system", null, { success: false, reason: authError.message });
    } else {
      saveAttempts({ count: 0, lockedUntil: null });
      createLog("login", "system", null, { success: true });
      navigate("/admin");
    }

    setLoading(false);
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
            <label htmlFor="email">E-posta</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="admin@savtek.ktun.edu.tr"
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
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
        </div>
      </div>
    </div>
  );
}

export default Login;
