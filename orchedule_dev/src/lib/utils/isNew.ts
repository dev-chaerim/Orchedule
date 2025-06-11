export function isNew(dateStr: string, days = 4): boolean {
  const now = new Date();
  const targetDate = new Date(dateStr);

  // 오늘 기준 00:00 시점으로 비교
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );

  const diffInMs = today.getTime() - targetDay.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  return diffInDays <= days;
}
