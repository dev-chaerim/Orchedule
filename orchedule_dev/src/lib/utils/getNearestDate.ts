// lib/utils/getNearestDate.ts
export function getNearestDate(dates: string[]): string {
    const today = new Date();
    const todayDateString = today.toISOString().split("T")[0];
  
    // 날짜 문자열을 Date 객체로 변환
    const dateObjects = dates.map((date) => new Date(date));
  
    // 오늘 날짜와 동일한 연습일이 있는지 먼저 확인
    if (dates.includes(todayDateString)) {
      return todayDateString;
    }
  
    // 가장 가까운 날짜를 찾기
    const nearestDate = dateObjects.reduce((prev, curr) => {
      return Math.abs(curr.getTime() - today.getTime()) <
        Math.abs(prev.getTime() - today.getTime())
        ? curr
        : prev;
    });
  
    return nearestDate.toISOString().split("T")[0];
  }
  