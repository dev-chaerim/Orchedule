/* eslint-disable @typescript-eslint/no-require-imports */
const runtimeCaching = [
  {
    // 시즌, 공지, 악보체크 API 캐싱
    urlPattern: /^\/api\/(seasons|notices|score-checks|season-scores).*$/,
    handler: "NetworkFirst",
    options: {
      cacheName: "read-api-cache",
      expiration: {
        maxEntries: 30,
        maxAgeSeconds: 300, // 5분
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  {
    // Google Fonts 캐싱
    urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
    handler: "CacheFirst",
    options: {
      cacheName: "google-fonts",
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1년
      },
    },
  },
];

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching, // ✅ 추가된 부분
});

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: [
      "res.cloudinary.com",
      "orchestra-schedule-pdf.s3.us-east-2.amazonaws.com",
    ],
  },
  compiler: {
    removeConsole: {
      exclude: ["error", "warn"],
    },
  },
  
});
