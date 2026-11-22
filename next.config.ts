import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Allow images served from Supabase Storage. The project ref is not known at
    // build time, so this stays intentionally permissive (any *.supabase.co host).
    // Tighten to the exact project host once the Supabase project is created.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Freely-licensed Wikimedia Commons imagery (hero + photo strips).
        // Commons permits hotlinking and is CDN-backed.
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
};

export default nextConfig;
