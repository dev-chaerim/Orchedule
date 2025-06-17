export function getLastOpenSchedule(
  schedules: { date: string; isCancelled?: boolean }[]
): string | null {
  const today = new Date();
  const validPastSchedules = schedules
    .filter((s) => !s.isCancelled && new Date(s.date) <= today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return validPastSchedules.length > 0 ? validPastSchedules[0].date : null;
}
