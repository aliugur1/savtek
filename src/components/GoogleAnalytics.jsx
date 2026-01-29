import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function GoogleAnalytics() {
  const location = useLocation();
  const trackingId = import.meta.env.VITE_GA_TRACKING_ID;

  // Initialize GA script once
  useEffect(() => {
    if (!trackingId) {
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(
      `script[src*="googletagmanager.com/gtag/js"]`
    );

    if (!existingScript) {
      // Load Google Analytics script only once
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      document.head.appendChild(script);

      // Initialize gtag function
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args) {
        window.dataLayer.push(args);
      };
      window.gtag("js", new Date());
      window.gtag("config", trackingId);
    }
  }, [trackingId]);

  // Track page views on route change
  useEffect(() => {
    if (!trackingId || !window.gtag) {
      return;
    }

    window.gtag("config", trackingId, {
      page_path: location.pathname + location.search,
    });
  }, [trackingId, location]);

  return null;
}

export default GoogleAnalytics;
