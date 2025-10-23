import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  url: { type: String, required: true },
  issues: [{ type: Object }],
  date: { type: Date, default: Date.now },
});

export default mongoose.model('Analysis', analysisSchema);
