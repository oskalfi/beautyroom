import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Check treatment metadata (including notFound) before sending response headers.
  htmlLimitedBots: /.*/,
  async redirects() {
    return [{
      source: "/:path*",
      has: [{ type: "host", value: "www.beautyroomky.com" }],
      destination: "https://beautyroomky.com/:path*",
      permanent: true,
    }];
  },
  experimental: { globalNotFound: true },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 90],
  },
  reactCompiler: true,
};

export default withNextIntl(nextConfig);
