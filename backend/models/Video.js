import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    youtubeUrl: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    duration: { type: String, default: '' },
    dateAdded: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        if (ret.dateAdded) ret.dateAdded = new Date(ret.dateAdded).toISOString().split('T')[0];
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export default mongoose.model('Video', videoSchema);
