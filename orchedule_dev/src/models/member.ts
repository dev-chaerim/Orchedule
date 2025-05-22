import { Schema, model, models } from "mongoose";

export type PartKey = "Vn1" | "Vn2" | "Va" | "Vc" | "Ba" | "Fl" | "Ob" | "Cl" | "Bs" | "Hr" | "Perc";

const MemberSchema = new Schema({
  name: { type: String, required: true },
  part: { type: String, enum: ["Vn1", "Vn2", "Va", "Vc", "Ba", "Fl", "Ob", "Cl", "Bs", "Hr", "Perc", "지휘자"], required: true },
});

const Member = models.Member || model("Member", MemberSchema);

export default Member;