import { Schema, model, models } from "mongoose";

const seasonSchema = new Schema(
  {
    name: { type: String, required: true },
    startDate: { type: Date, required: true }, 
    endDate: { type: Date },                    
    pieces: { type: [String], default: [] },    
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "Member",                          // ✅ 시즌 참여 단원
      },
    ],
  },
  {
    timestamps: true,                         
  }
);

const Season = models.Season || model("Season", seasonSchema);

export default Season;
