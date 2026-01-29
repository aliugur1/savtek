import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**ScrollToTop Component
 * Sayfa değişikliklerinde otomatik scroll yönetimi:
 * - Hash varsa (#iletisim gibi) o elemana scroll yapar
 * - Hash yoksa sayfa başına scroll yapar
 * - Navbar offset'i hesaba katar*/
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Hash varsa (örn: #iletisim), o bölüme scroll yap
    if (hash) {
      // Sayfa geçiş animasyonunu bekle
      const timer = setTimeout(() => {
        const element = document.querySelector(hash);

        if (element) {
          // Navbar yüksekliği kadar offset (navbar sticky olduğu için)
          const navbarHeight = 85;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        } else {
          // Element bulunamazsa sayfa başına git
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      }, 400); // Framer Motion animasyonu için bekle (300ms + 100ms buffer)

      return () => clearTimeout(timer);
    } else {
      // Hash yoksa sayfa başına scroll yap
      // Instant scroll - yeni sayfa açılışı için
      window.scrollTo({
        top: 0,
        behavior: "instant", // Instant for page changes, smooth for hash
      });
    }
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
