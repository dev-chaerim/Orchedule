import { Schema, model, models } from "mongoose";

export type PartKey = "Vn1" | "Vn2" | "Va" | "Vc" | "Ba" | "Fl" | "Ob" | "Cl" | "Bs" | "Hr" | "Perc";

const MemberSchema = new Schema({
  name: { type: String, required: true },
  part: { type: String, enum: ["Vn1", "Vn2", "Va", "Vc", "Ba", "Fl", "Ob", "Cl", "Bs", "Hr", "Perc"], required: true },
});

// 기본 _id를 사용하므로 별도의 id 필드 없음
export const Member = models.Member || model("Member", MemberSchema);
