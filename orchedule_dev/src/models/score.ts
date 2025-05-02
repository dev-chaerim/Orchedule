import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema({
  title: String,
  author: String,
  fileUrl: String,
  parts: [String],
  isNewScore: Boolean, // ← 이름 변경
  tag: String,
  date: String,
  type: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Score || mongoose.model("Score", ScoreSchema);
