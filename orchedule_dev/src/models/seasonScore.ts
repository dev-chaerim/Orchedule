import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  authorId: { type: String, required: true },    // ✅ authorId 추가
  authorName: { type: String, required: true },  // ✅ authorName (기존 author 대신)
  content: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const SeasonScoreSchema = new mongoose.Schema({
  seasonId: { type: String, required: true },
  title: String,
  author: String,   // 이미지 파일 URL 배열
  content: String,          // 설명 (링크 포함 가능)
  date: String,
  parts: [String],          // PartKey[]
  comments: [CommentSchema],
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

export default mongoose.models.SeasonScore ||
  mongoose.model("SeasonScore", SeasonScoreSchema);
