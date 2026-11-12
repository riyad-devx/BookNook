import type { NextConfig } from "next";

// Same value the app uses through `lib/books-api.ts`. The backend serves the
// GridFS cover images, so the rewrite and image pattern follow it too.
const booksApiUrl = new URL(
  process.env.NEXT_PUBLIC_BOOKS_API_URL ?? "http://localhost:5000",
);

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },

  cacheComponents: true,
  partialPrefetching: true,

  images: {
    remotePatterns: [
      {
        protocol: booksApiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: booksApiUrl.hostname,
        ...(booksApiUrl.port ? { port: booksApiUrl.port } : {}),
        pathname: "/book-image/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/book-image/:id",
        destination: `${booksApiUrl.origin}/book-image/:id`,
      },
    ];
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
