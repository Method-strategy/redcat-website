import { Link } from "react-router-dom";

const CAT_URL = "https://customer-assets-v7afamib.emergentagent.net/job_redcat-astro-build/artifacts/g47ddfql_redcat-silhouette-logo.webp";
const WORDMARK_URL = "https://customer-assets-v7afamib.emergentagent.net/job_redcat-astro-build/artifacts/u05abkcl_redcat-registered-trademark-logotext-only.webp";

export function Logo({ size = "md", linkTo = "/" }) {
  const sz = {
    sm: { cat: "h-4",  wordmark: "h-4" },
    md: { cat: "h-6",  wordmark: "h-6" },
    lg: { cat: "h-8",  wordmark: "h-8" },
  }[size];

  return (
    <Link
      to={linkTo}
      data-testid="logo-lockup"
      aria-label="Redcat Eyewear home"
      className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-rc-red rounded"
    >
      <img
        src={CAT_URL}
        alt=""
        aria-hidden="true"
        width="28"
        height="28"
        className={`${sz.cat} w-auto object-contain flex-shrink-0`}
        loading="eager"
        fetchpriority="high"
      />
      <img
        src={WORDMARK_URL}
        alt="Redcat Eyewear"
        width="160"
        height="28"
        className={`${sz.wordmark} w-auto object-contain flex-shrink-0`}
        loading="eager"
      />
    </Link>
  );
}
