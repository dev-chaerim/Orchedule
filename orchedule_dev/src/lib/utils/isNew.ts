export function isNew(dateString: string, daysThreshold: number = 3): boolean {
  const now = new Date();
  const postDate = new Date(`${dateString}T00:00:00`); // ⭐️ timezone 문제 보완
  const diffInDays = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays < daysThreshold;
}
