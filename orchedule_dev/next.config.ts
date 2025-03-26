import withPWAInit from "next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  buildExcludes: [/\.next[\\/]trace/],
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default withPWA(nextConfig);
