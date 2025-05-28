import { Schema, model, models } from "mongoose";

const PasswordResetTokenSchema = new Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const PasswordResetToken =
  models.PasswordResetToken || model("PasswordResetToken", PasswordResetTokenSchema);

export default PasswordResetToken;
