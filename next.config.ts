import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: { globalNotFound: true },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 90],
  },
  reactCompiler: true,
};

export default withNextIntl(nextConfig);
