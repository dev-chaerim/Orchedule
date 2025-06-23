// app/ClientWrapper.tsx
"use client";

import { useEffect } from "react";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("✅ 서비스워커 등록 성공:", registration);
        })
        .catch((error) => {
          console.error("❌ 서비스워커 등록 실패:", error);
        });
    }
  }, []);

  return <>{children}</>;
}
