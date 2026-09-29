import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // The app has one root layout per language (app/[lang]/layout.tsx), so
    // unmatched URLs need a standalone 404: app/global-not-found.tsx.
    globalNotFound: true,
  },
  images: {
    // Next 16 requires an explicit allowlist — the default is [75] only,
    // meaning every <Image quality={...}> was silently clamped back down
    // to 75 regardless of what was requested. 90 covers member/department
    // photos (real photography, worth the extra bytes); 75 stays available
    // as the default for everything else (badges, banners).
    qualities: [75, 90, 100],
  },
};

export default nextConfig;
