import { Schema, model, models } from "mongoose";
import { orderedParts } from "@/src/constants/parts";

const MemberSchema = new Schema({
  name: { type: String, required: true },
  part: {
    type: String,
    enum: [...orderedParts, "지휘자"], 
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