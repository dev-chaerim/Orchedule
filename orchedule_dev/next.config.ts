import withPWAInit from "next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  buildExcludes: [/\.next[\\/]trace/],
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", "orchestra-schedule-pdf.s3.us-east-2.amazonaws.com"] 
  },
  // reactStrictMode: true,
  // swcMinify: true,
};

export default withPWA(nextConfig);
