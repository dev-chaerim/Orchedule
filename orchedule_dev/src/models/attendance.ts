// src/models/attendance.ts
import { Schema, model, models } from "mongoose";

const AttendanceSchema = new Schema({
  date: { type: String, required: true }, // 예: "2025-04-29"
  seasonId: { type: String, required: true },
  records: [
    {
      memberId: { type: String, required: true },
      status: {
        type: String,
        enum: ["출석", "지각", "불참"],
        required: true,
      },
    },
  ],
});

export default models.Attendance || model("Attendance", AttendanceSchema);
