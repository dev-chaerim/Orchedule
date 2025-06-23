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
      <title>Orchedule</title>
    </>
  );
}
