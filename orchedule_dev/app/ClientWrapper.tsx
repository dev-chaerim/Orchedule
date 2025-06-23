// app/ClientWrapper.tsx
"use client";

import { useEffect } from "react";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" && // ✅ 배포일 때만
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("✅ 서비스워커 등록 성공:", registration);
        })
        .catch((error) => {
          console.error("❌ 서비스워커 등록 실패:", error);
        });
    } else {
      console.log("🛑 개발 환경에서는 Service Worker 등록 생략");
    }
  }, []);

  return <>{children}</>;
}
