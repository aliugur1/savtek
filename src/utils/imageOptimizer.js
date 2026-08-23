/**
 * Image Optimization Utility
 * Provides WebP support with fallback to original format
 */

/**
 * Get optimized image source with WebP support
 * @param {string} src - Original image source
 * @param {string} fallback - Fallback format (default: original)
 * @returns {string} Optimized image source
 */
export function getOptimizedImage(src, fallback = null) {
  if (!src) return "";

  // If already a full URL, return as is
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // Check if browser supports WebP
  const supportsWebP = checkWebPSupport();

  if (supportsWebP && src) {
    // Try to use WebP version if available
    // In production, you would convert images to WebP and serve both formats
    // For now, we return the original but this structure allows easy WebP integration
    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, ".webp");
    return webpSrc;
  }

  return fallback || src;
}

/**
 * Check if browser supports WebP format
 * @returns {boolean} True if WebP is supported
 */
export function checkWebPSupport() {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
}

/**
 * Lazy load image with WebP support
 * Note: This is a utility function. For React component, import React separately.
 * @param {string} src - Image source
 * @param {string} alt - Alt text
 * @param {object} props - Additional img props
 * @returns {JSX.Element} Optimized img element
 */
export function OptimizedImage({ src }) {
  // This function requires React to be imported in the component file
  // Example usage in component:
  // import { useState, useEffect } from 'react';
  // const [imageSrc, setImageSrc] = useState("");
  // useEffect(() => { ... }, [src]);

  // For now, return a simple implementation
  const supportsWebP =
    typeof document !== "undefined" ? checkWebPSupport() : false;
  const optimizedSrc =
    supportsWebP && src ? src.replace(/\.(jpg|jpeg|png)$/i, ".webp") : src;

  return { src: optimizedSrc, fallback: src };
}

// React component version (requires React import)
export function createOptimizedImageComponent(React) {
  const { useState, useEffect } = React;

  return function OptimizedImageComponent({ src, alt, ...props }) {
    const [imageSrc, setImageSrc] = useState("");
    const [error] = useState(false);

    useEffect(() => {
      if (!src) return;

      const supportsWebP = checkWebPSupport();
      const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, ".webp");

      if (supportsWebP) {
        // Try WebP first
        const img = new Image();
        img.onload = () => setImageSrc(webpSrc);
        img.onerror = () => {
          // Fallback to original if WebP doesn't exist
          setImageSrc(src);
        };
        img.src = webpSrc;
      } else {
        // Use original format
        setImageSrc(src);
      }
    }, [src]);

    if (error || !imageSrc) {
      return <img src={src} alt={alt} {...props} />;
    }

    return <img src={imageSrc} alt={alt} {...props} />;
  };
}

/**
 * Preload images for better performance
 * @param {string[]} imageSources - Array of image sources to preload
 */
export function preloadImages(imageSources) {
  imageSources.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}
