import { Component } from "react";
import "../styles/error-boundary.css";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h1>⚠️ Bir Hata Oluştu</h1>
            <p>
              Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin
              veya ana sayfaya dönün.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details className="error-details">
                <summary>Hata Detayları (Sadece Geliştirme Modu)</summary>
                <pre>{this.state.error.toString()}</pre>
                {this.state.errorInfo && (
                  <pre>{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            )}
            <div className="error-actions">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Sayfayı Yenile
              </button>
              <a
                href="/"
                className="btn-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/";
                }}
              >
                Ana Sayfaya Dön
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
