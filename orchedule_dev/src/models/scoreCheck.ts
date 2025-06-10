import mongoose from "mongoose";

const ScoreCheckSchema = new mongoose.Schema({
  seasonId: { type: String, required: true },
  title: { type: String, required: true }, // 곡 제목
  author: String,
  content: String,
  parts: [String], // 대상 파트 (빈 배열이면 전체 대상)
  date: String,
  attachments: {
    type: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        pageCount: { type: Number, required: true },
        type: { type: String, required: true }, // ex: "application/pdf", "image/png" 등
      },
    ],
    required: false,
  },
});

export default mongoose.models.ScoreCheck ||
  mongoose.model("ScoreCheck", ScoreCheckSchema);
