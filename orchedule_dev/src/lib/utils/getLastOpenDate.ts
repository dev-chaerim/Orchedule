/**
 * getLastOpenDate
 * 
 * 오늘 날짜를 기준으로, 과거에 있었던 연습일 중
 * "마지막으로 열린 연습일"의 날짜를 반환한다.
 * (미래 날짜와 취소된 일정은 제외)
 * 
 * 사용 예시: 출석 통계 기준일 텍스트, 지난 연습일 필터링 등
 * 
 * @param dates 날짜 문자열 배열 (ISO 형식: yyyy-mm-dd)
 * @returns 마지막 연습일 날짜 문자열 또는 null
 */

export function getLastOpenDate(dates: string[]): string | null {
  const today = new Date();

  const pastDates = dates
    .filter((d) => new Date(d) <= today)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return pastDates.length > 0 ? pastDates[0] : null;
}
