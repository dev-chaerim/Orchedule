import { Schema, model, models } from "mongoose";

const joinRequestSchema = new Schema({
  name: { type: String, required: true },
  part: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
});

const JoinRequest = models.JoinRequest || model("JoinRequest", joinRequestSchema);

export default JoinRequest;
