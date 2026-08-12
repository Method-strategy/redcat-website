import { useEffect } from "react";

const SITE_URL = "https://redcateyewear.com";
const DEFAULT_OG_IMAGE = "https://redcateyewear.com/cdn/shop/files/Redcat_BEAST_Aron_in_the_Wild.png";

function setMeta(attr, name, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(path) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

function setSchema(schema) {
  let el = document.getElementById("page-schema");
  if (!el) {
    el = document.createElement("script");
    el.id = "page-schema";
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(schema);
}

export function useSEO({ title, description, keywords, image, schema, path, ogType, articlePublishedTime, articleTags }) {
  useEffect(() => {
    const fullTitle = title.includes("Redcat") ? title : `${title} | Redcat® Eyewear`;
    document.title = fullTitle;

    setMeta("name", "description", description);
    if (keywords) setMeta("name", "keywords", keywords);
    setMeta("name", "robots", "index, follow");

    // Open Graph
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", ogType || "website");
    setMeta("property", "og:url", path ? `${SITE_URL}${path}` : SITE_URL);
    setMeta("property", "og:site_name", "Redcat® Eyewear");
    setMeta("property", "og:image", image || DEFAULT_OG_IMAGE);

    // Article-specific OG tags
    if (articlePublishedTime) setMeta("property", "article:published_time", articlePublishedTime);
    if (articleTags) articleTags.forEach((tag) => setMeta("property", "article:tag", tag));

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image || DEFAULT_OG_IMAGE);

    if (path) setCanonical(path);
    if (schema) setSchema(schema);

    return () => {
      document.getElementById("page-schema")?.remove();
    };
  }, [title, description, keywords, image, path, ogType, articlePublishedTime]);
}
