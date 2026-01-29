import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { applyReducedMotion } from "./utils/accessibility";
import "./styles/app.css";
import "./styles/accessibility.css";
import App from "./App.jsx";

// Apply accessibility settings on load
applyReducedMotion();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
