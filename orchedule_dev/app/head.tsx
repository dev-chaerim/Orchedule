// app/head.tsx

export default function Head() {
  return (
    <>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      <meta name="robots" content="noindex, nofollow" />{" "}
      {/* ✅ 검색엔진 차단 */}
      <meta name="theme-color" content="#ffffff" /> {/* ✅ 상태바 색상 설정 */}
      <meta name="apple-mobile-web-app-title" content="Orchedule" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/apple-icon.png" />
      <link rel="icon" href="/favicon.ico" />
      <title>Orchedule</title>
    </>
  );
}
