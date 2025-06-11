// src/lib/types/attendance.ts

export type AttendanceStatus = "출석" | "지각" | "불참";

export interface AttendanceRecord {
  memberId: string;
  status: AttendanceStatus;
}

export interface AttendanceData {
  date: string; // ISO 문자열 ("2025-04-29")
  seasonId: string;
  records: AttendanceRecord[];
}
