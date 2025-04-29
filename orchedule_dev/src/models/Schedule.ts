import { Schema, model, models } from 'mongoose';

const PieceSchema = new Schema({
  time: { type: String, required: true }, // "3:40~4:05"
  title: { type: String, required: true },
  note: { type: String },
});

const ScheduleSchema = new Schema(
  {
    seasonId: { type: String, required: true },
    date: { type: String, required: true }, // "2025-04-05"
    pieces: { type: [PieceSchema], required: true },
  },
  { timestamps: true }
);

export const Schedule = models.Schedule || model('Schedule', ScheduleSchema);
