import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    particulars: { type: String, required: true, trim: true },
    url: { type: String, default: '', trim: true },
    videoUrl: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export default mongoose.model('Resource', resourceSchema);
