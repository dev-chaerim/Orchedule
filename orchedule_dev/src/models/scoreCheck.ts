import mongoose from "mongoose";

const ScoreCheckSchema = new mongoose.Schema({
  seasonId: { type: String, required: true },
  title: String,
  author: String,
  fileUrl: String, // PDF 파일 경로
  attachments: [String], // 이미지 파일 경로들
  content: String,
  parts: [String], // 파트 체크 기능
  date: String,
});

export default mongoose.models.ScoreCheck ||
  mongoose.model("ScoreCheck", ScoreCheckSchema);
