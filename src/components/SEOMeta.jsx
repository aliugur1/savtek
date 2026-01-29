import { useEffect } from "react";

function SEOMeta({
  title = "SAVTEK - Savunma Teknolojileri Topluluğu",
  description = "Konya Teknik Üniversitesi Savunma Teknolojileri Topluluğu. İnsansız hava araçları, roket, kara araçları ve daha fazlası...",
  image = "/logo.png",
  url = "",
  type = "website",
}) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Get or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", content);
    };

    // Basic meta tags
    updateMetaTag("description", description);
    updateMetaTag(
      "keywords",
      "SAVTEK, savunma teknolojileri, KTO Karatay Üniversitesi, TEKNOFEST, mühendislik, öğrenci topluluğu"
    );

    // Open Graph tags
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const currentUrl =
      typeof window !== "undefined" ? window.location.href : "";

    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag(
      "og:image",
      image.startsWith("http") ? image : `${origin}${image}`,
      true
    );
    updateMetaTag("og:url", url || currentUrl, true);
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:site_name", "SAVTEK", true);

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag(
      "twitter:image",
      image.startsWith("http") ? image : `${origin}${image}`
    );

    // Additional meta tags
    updateMetaTag("author", "SAVTEK");
    updateMetaTag("robots", "index, follow");
  }, [title, description, image, url, type]);

  return null;
}

export default SEOMeta;
