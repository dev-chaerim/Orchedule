import { Schema, model, models } from "mongoose";
import type { PartKey } from "@/src/constants/parts";

const partEnum: PartKey[] = [
  "Vn1", "Vn2", "Va", "Vc", "Ba", "Fl", "Ob", "Cl", "Bs", "Hr", "Perc"
];

const MemberSchema = new Schema({
  name: { type: String, required: true },
  part: {
    type: String,
    enum: [...partEnum, "지휘자"], 
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  }
});


const Member = models.Member || model("Member", MemberSchema);

export default Member;