// lib/utils/getNearestDate.ts
export function getNearestDate(dates: string[]): string {
  const today = new Date();
  const todayDateString = today.toISOString().split("T")[0];

  if (dates.includes(todayDateString)) {
    return todayDateString;
  }

  const futureDates = dates
    .map((d) => new Date(d))
    .filter((d) => d >= today); // ⬅️ 오늘 이후만

  if (futureDates.length === 0) {
    // 미래 날짜 없으면 가장 최근 날짜
    return dates.sort().reverse()[0]; // 가장 늦은 날짜 반환
  }

  const nearestDate = futureDates.reduce((prev, curr) =>
    curr.getTime() < prev.getTime() ? curr : prev
  );

  return nearestDate.toISOString().split("T")[0];
}
