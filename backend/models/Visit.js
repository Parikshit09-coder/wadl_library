import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now, index: true },
});

export default mongoose.model('Visit', visitSchema);
