// /models/notice.ts
import { Schema, model, models } from 'mongoose';

const noticeSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true }, // '2024-05-05' 형식 문자열 그대로 저장
  pinned: { type: Boolean, default: false },
  author: { type: String, required: true },
  isNew: { type: Boolean, default: false },
  season: { type: String, required: true }, // season 필드 유지
  isGlobal: { type: Boolean, default: false }, 
});

const Notice = models.Notice || model('Notice', noticeSchema);
export default Notice;
