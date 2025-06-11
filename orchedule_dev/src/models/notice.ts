import { Schema, model, models } from 'mongoose';

const noticeSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  pinned: { type: Boolean, default: false },
  author: { type: String, required: true },
  season: { type: Schema.Types.ObjectId, ref: 'Season', required: true },
  isGlobal: { type: Boolean, default: false },
  isSeatNotice: { type: Boolean, default: false },
  attachments: {
    type: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        pageCount: { type: Number, required: true },
        type: { type: String, required: true },
      },
    ],
    required: false,
  },
});

const Notice = models.Notice || model('Notice', noticeSchema);
export default Notice;
