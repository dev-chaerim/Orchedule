import { Schema, model, models } from 'mongoose';

const scoreSchema = new Schema({
  title: { type: String, required: true },
  date: { type: String, required: true }, // 'YYYY-MM-DD'
  isNew: { type: Boolean, default: false },
  author: { type: String, required: true },
  content: { type: String, required: true },
  fileUrl: { type: String, required: true },
  youtubeUrl: { type: String }, // optional
  tags: [{ type: String }], // e.g., ['바이올린', '플룻']
});

const Score = models.Score || model('Score', scoreSchema);
export default Score;
