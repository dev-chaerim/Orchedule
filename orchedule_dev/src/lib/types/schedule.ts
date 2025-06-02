// types/schedule.ts

export interface PracticeSession {
  time: string;          // 예: "15:00 - 15:30"
  title: string;         // 예: "첼로 자리오디션"
  location: string;      // 예: "아람 1번방"
  conductor?: string;    // 담당자
  parts?: string[];      // 해당 파트 (선택)
  note?: string;         // 비고
}

export interface OrchestraPiece {
  title: string;
  movements?: string[];  // 예: ["1악장", "3악장"]
  isEncore?: boolean;
  highlight?: boolean;
  note?: string;
}

export interface OrchestraSession {
  time: string;          // 예: "15:40 - 17:00"
  location: string;      // 예: "아람 메인홀"
  conductor: string;
  pieces: OrchestraPiece[];
}

export interface SpecialNotice {
  content: string;
  level?: "default" | "warning" | "important";
}

export interface PracticeScheduleInput {
  date: string;
  auditionSessions?: PracticeSession[];
  partSessions?: PracticeSession[];
  orchestraSession: OrchestraSession;
  specialNotices?: SpecialNotice[];
}

export interface Schedule extends PracticeScheduleInput {
  _id: string;
  seasonId: string;
}
