/* eslint-disable @typescript-eslint/no-require-imports */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  reactStrictMode: true,
//   swcMinify: true,
  images: {
    domains: ["res.cloudinary.com", "orchestra-schedule-pdf.s3.us-east-2.amazonaws.com"],
  },
});
