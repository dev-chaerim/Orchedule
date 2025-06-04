import { Schema, model, models } from 'mongoose';

const noticeSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  pinned: { type: Boolean, default: false },
  author: { type: String, required: true },
  isNew: { type: Boolean, default: false },
  season: { type: Schema.Types.ObjectId, ref: 'Season', required: true },
  isGlobal: { type: Boolean, default: false },
  imageUrl: { type: String, default: "" },
});

const Notice = models.Notice || model('Notice', noticeSchema);
export default Notice;
