// lib/mock/joinRequests.ts

export interface JoinRequest {
    id: number;
    name: string;
    part: string;
    group: string;
    email: string;
    password: string;
    createdAt: string;
    status: "대기중" | "승인됨" | "거절됨";
  }
  
  export const mockJoinRequests: JoinRequest[] = [
    {
      id: 1,
      name: "김단원",
      part: "Vn1",
      group: "아람 필하모닉",
      email: "kim@example.com",
      password: "123456",
      createdAt: "2025-04-28",
      status: "대기중",
    },
    {
      id: 2,
      name: "허단원",
      part: "Va",
      group: "아람 필하모닉",
      email: "heo@example.com",
      password: "abcdef",
      createdAt: "2025-04-27",
      status: "승인됨",
    },
  ];
  