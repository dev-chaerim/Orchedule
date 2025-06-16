import { Schema, model, models } from 'mongoose';

const PieceSchema = new Schema({
  title: { type: String, required: true },
  movements: [String], // 예: ["1st", "3rd"]
  isEncore: { type: Boolean, default: false },
  highlight: { type: Boolean, default: false },
  note: { type: String },
});

const PracticeSessionSchema = new Schema({
  time: { type: String, required: true },       // 예: "15:00 - 15:30"
  title: { type: String, required: true },      // 예: "첼로 자리오디션"
  location: { type: String, required: true },   // 예: "아람 1번방"
  conductor: String,
  parts: [String],
  note: String,
});

const OrchestraSessionSchema = new Schema({
  time: { type: String, required: true },
  location: { type: String, required: true },
  conductor: { type: String, required: true },
  pieces: [PieceSchema],
});

const SpecialNoticeSchema = new Schema({
  content: { type: String, required: true },
  level: {
    type: String,
    enum: ["default", "warning", "important"],
    default: "default",
  },
});

const ScheduleSchema = new Schema(
  {
    seasonId: { type: String, required: true },
    date: { type: String, required: true }, // "2025-06-01"
    isCancelled: { type: Boolean, default: false },

    auditionSessions: [PracticeSessionSchema],
    partSessions: [PracticeSessionSchema],
    orchestraSessions: [OrchestraSessionSchema], // ✅ 변경된 부분
    specialNotices: [SpecialNoticeSchema],
  },
  { timestamps: true }
);

export const PracticeSchedule = models.Schedule || model('Schedule', ScheduleSchema);
