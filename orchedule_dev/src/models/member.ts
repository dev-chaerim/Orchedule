import { Schema, model, models } from "mongoose";
import { orderedParts } from "@/src/constants/parts";

const MemberSchema = new Schema({
  name: { type: String, required: true },
  part: {
    type: String,
    enum: [...orderedParts, "지휘자"],
    required: true
  },
  email: { type: String, required: true, unique: true }, // ✅ 로그인용 이메일 필수
  password: { type: String, required: true }, // ✅ 비밀번호 해시 저장용 필드 추가
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  }
});

const Member = models.Member || model("Member", MemberSchema);

export default Member;
