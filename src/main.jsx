import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { applyReducedMotion } from "./utils/accessibility";
import { AuthProvider } from "./context/AuthProvider.jsx";
import "./styles/app.css";
import "./styles/accessibility.css";
import App from "./App.jsx";

// Apply accessibility settings on load
applyReducedMotion();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
