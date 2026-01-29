import "../styles/loading-spinner.css";

function LoadingSpinner({ fullScreen = false, message = "Yükleniyor..." }) {
  if (fullScreen) {
    return (
      <div className="loading-spinner-fullscreen">
        <div className="loading-spinner-container">
          <div className="spinner"></div>
          <p className="loading-message">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-spinner-inline">
      <div className="spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;
