import { Schema, model, models } from 'mongoose';

const seasonSchema = new Schema({
  name: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, default: "" },  // 필수 아님
  pieces: { type: [String], default: [] },
});

const Season = models.Season || model('Season', seasonSchema);

export default Season;
