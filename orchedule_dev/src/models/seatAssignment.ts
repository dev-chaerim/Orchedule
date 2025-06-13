// src/models/seatAssignment.ts
import mongoose, { Schema, models, model } from "mongoose";

const seatAssignmentSchema = new Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    seatNumber: {
      type: Number,
      required: true,
    },
    seatSide: {
      type: String,
      enum: ["left", "right"],   // 좌/우 구분
      required: true,
    },
    seasonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
      required: true,
    },
  },
  { timestamps: true }
);


const SeatAssignment =
  models.SeatAssignment || model("SeatAssignment", seatAssignmentSchema);

export default SeatAssignment;
