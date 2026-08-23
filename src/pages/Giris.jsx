import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styles/giris.css";

function Giris() {
  const navigate = useNavigate();
  const {
    user,
    loading,
    signInWithPassword,
    signOut,
    hasSupabaseEnv,
    demoRole,
    clearDemoSession,
  } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (username.trim() === "admin" && password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminToken", "demo-token-" + Date.now());
      setSubmitting(false);
      navigate("/admin");
      return;
    }

    if (username.trim() === "kaptan" && password === "kaptan123") {
      try {
        localStorage.setItem("savtek-demo-role", "captain");
        window.dispatchEvent(new Event("savtek-auth"));
      } catch {
        // ignore
      }
      setSubmitting(false);
      navigate("/panel");
      return;
    }

    if (!hasSupabaseEnv) {
      setError("Supabase yapılandırması eksik.");
      setSubmitting(false);
      return;
    }

    try {
      const identifier = username.trim();
      const email = identifier.includes("@") ? identifier : `${identifier}@savtek.local`;
      const { error: authError } = await signInWithPassword(email, password);
      if (authError) {
        setError("Giriş başarısız. Kullanıcı adı/şifre kontrol edin.");
        setSubmitting(false);
        return;
      }

      setSubmitting(false);
      navigate("/panel");
    } catch {
      setError("Giriş sırasında bir hata oluştu.");
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setError("");
    setSubmitting(true);

    try {
      clearDemoSession();
      await signOut();
      setSubmitting(false);
      navigate("/");
    } catch {
      setError("Çıkış sırasında bir hata oluştu.");
      setSubmitting(false);
    }
  };

  const isLoggedIn = !!user || demoRole === "captain";

  return (
    <main className="giris-page">
      <div className="giris-backdrop" aria-hidden="true" />

      <div className="giris-card" role="region" aria-label="Panel girişi">
        <div className="giris-card-header">
          <div className="giris-logo-row">
            <img src="/logo.png" alt="SAVTEK" className="giris-logo" />
            <div className="giris-title">
              <h1>Panel Girişi</h1>
              <p>Kaptan / Üye erişimi</p>
            </div>
          </div>
        </div>

        {!hasSupabaseEnv && (
          <div className="giris-warning" role="alert">
            Supabase yapılandırması eksik. `.env` içine
            `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` ekleyin.
          </div>
        )}

        {isLoggedIn ? (
          <div className="giris-loggedin">
            <div className="giris-userline">
              <div className="giris-userlabel">Giriş yapan</div>
              <div className="giris-uservalue">
                {user?.email || user?.id || (demoRole === "captain" ? "kaptan" : "")}
              </div>
            </div>

            <div className="giris-actions">
              <button
                type="button"
                className="giris-primary"
                onClick={() => navigate("/panel")}
                disabled={loading}
              >
                Takım Panelim
              </button>
              <button
                type="button"
                className="giris-secondary"
                onClick={handleLogout}
                disabled={submitting}
              >
                {submitting ? "Çıkış..." : "Çıkış Yap"}
              </button>
            </div>

            {error && (
              <div className="giris-error" role="alert">
                {error}
              </div>
            )}
          </div>
        ) : (
          <form className="giris-form" onSubmit={handleLogin}>
            <label className="giris-label">
              Kullanıcı adı
              <input
                className="giris-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                disabled={submitting}
              />
            </label>

            <label className="giris-label">
              Şifre
              <input
                className="giris-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={submitting}
              />
            </label>

            {error && (
              <div className="giris-error" role="alert">
                {error}
              </div>
            )}

            <button
              className="giris-primary"
              type="submit"
              disabled={submitting || loading}
            >
              {submitting ? "Giriş..." : "Giriş Yap"}
            </button>

            <p className="giris-footnote">
              Hesabın yoksa admin tarafından oluşturulacak.
            </p>
          </form>
        )}

        <div className="giris-footer">
          <button
            type="button"
            className="giris-link"
            onClick={() => navigate("/")}
          >
            ← Ana sayfaya dön
          </button>
        </div>
      </div>
    </main>
  );
}

export default Giris;
