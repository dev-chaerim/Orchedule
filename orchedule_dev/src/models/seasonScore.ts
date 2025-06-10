import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  author: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SeasonScoreSchema = new mongoose.Schema({
  seasonId: { type: String, required: true },
  title: String,
  author: String,
  attachments: [String],    // 이미지 파일 URL 배열
  content: String,          // 설명 (링크 포함 가능)
  date: String,
  parts: [String],          // PartKey[]
  comments: [CommentSchema],
});

export default mongoose.models.SeasonScore ||
  mongoose.model("SeasonScore", SeasonScoreSchema);
