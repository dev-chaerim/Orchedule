// src/lib/utils/getNextActiveSchedule.ts

import { Schedule } from "@/src/lib/types/schedule";

/**
 * 오늘 이후의 휴강이 아닌 다음 연습일정을 반환
 * @param schedules PracticeSchedule[]
 * @returns 다음 유효한 일정 또는 undefined
 */
export function getNextActiveSchedule(schedules: Schedule[]) {
  const today = new Date();

  const sorted = schedules
    .filter((s) => !s.isCancelled && new Date(s.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return sorted[0]; // 가장 가까운 유효한 연습일
}
