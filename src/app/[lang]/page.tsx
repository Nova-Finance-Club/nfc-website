import type { Metadata } from "next";

import { PageTransition } from "@/components/page-transition";
import { langFrom, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-data";
import { HomeContent } from "./home-content";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const lang = langFrom((await params).lang);
  return pageMetadata(lang, "/", {
    descriptionKey: "meta.site.description",
    description:
      "Nova Finance Club (NFC) is the student-run finance club of NOVA School of Science and Technology (NOVA FCT): a virtual investment fund, quantitative finance projects, market analysis and events.",
  });
}

// Tells Google the site's name for search results. Without it, Google
// falls back to the host and labels results "Vercel" (from vercel.app).
// WebSite has to live on the home page; Organization adds the logo and
// social profiles.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: siteConfig.name,
      alternateName: [siteConfig.shortName, `${siteConfig.name} ${siteConfig.institution}`],
      url: `${siteConfig.url}/`,
    },
    {
      "@type": "Organization",
      name: siteConfig.name,
      alternateName: siteConfig.shortName,
      url: `${siteConfig.url}/`,
      logo: `${siteConfig.url}/brand/nfc-mark-navy.png`,
      email: siteConfig.email,
      foundingDate: String(siteConfig.foundedYear),
      sameAs: [siteConfig.instagram, siteConfig.linkedin, siteConfig.github],
    },
  ],
};

export default function Page() {
  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <HomeContent />
    </PageTransition>
  );
}
