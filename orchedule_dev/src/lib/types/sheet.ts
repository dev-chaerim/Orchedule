// src/lib/types/sheet.ts

export interface AttachmentInput {
  url: string;
  publicId: string;
  pageCount?: number;
  type?: string;
}

export interface Comment {
  _id: string;           // 프론트에서는 string으로 사용 (mongoose toString 처리됨)
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;     // ISO string으로 사용
}

export interface Sheet {
  _id: string;
  title: string;
  date: string;
  author: string;
  content: string;
  attachments: AttachmentInput[];
  parts: string[];
  comments: Comment[]; // ✅ 댓글 필드 추가
}

export interface ScoreCheck {
  _id: string;
  seasonId: string;
  title: string;
  author: string;
  content: string;
  parts: string[];
  date: string;
  attachments?: {
    url: string;
    publicId: string;
    pageCount: number;
    type: string;
  }[];
}
