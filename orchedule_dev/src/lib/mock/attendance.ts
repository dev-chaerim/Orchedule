// mock/attendance.ts

import type { Member } from './members';

// 출석 상태를 enum 혹은 union 타입으로 정의
export type AttendanceStatus = '출석' | '지각' | '불참';

// 각 날짜별 출석 데이터(예시: 오늘)
export interface AttendanceRecord {
  date: string;               // '2025-04-27' 처럼 ISO string
  records: {
    memberId: Member['id'];   // members.ts 의 id 필드와 연결
    status: AttendanceStatus;
  }[];
}

// 예시 데이터: 오늘자
export const todayAttendance: AttendanceRecord = {
  date: new Date().toISOString().split('T')[0],
  records: [
    { memberId: 'Vn1-02', status: '지각' },   // 허주희
    { memberId: 'Vn2-05', status: '불참' },   // 예: 권채림
    { memberId: 'Va-02',  status: '불참' },   // 김정호
    // … 필요만큼 추가 …
  ]
};
