import mongoose from 'mongoose';

const seriesVideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    youtubeUrl: { type: String, required: true, trim: true },
    thumbnail: { type: String, default: '' },
    duration: { type: String, default: '' },
    order: { type: Number, default: 0 },
    dateAdded: { type: Date, default: Date.now },
  },
  { _id: true }
);

const tutorialSeriesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    folderName: { type: String, required: true, trim: true },
    coverThumbnail: { type: String, default: '' },
    videos: { type: [seriesVideoSchema], default: [] },
    dateAdded: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        if (ret.dateAdded) ret.dateAdded = new Date(ret.dateAdded).toISOString().split('T')[0];
        if (Array.isArray(ret.videos)) {
          ret.videos = ret.videos
            .map((video) => ({
              ...video,
              id: video._id,
              dateAdded: video.dateAdded ? new Date(video.dateAdded).toISOString().split('T')[0] : null,
            }))
            .map(({ _id, ...videoRest }) => videoRest)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        }
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export default mongoose.model('TutorialSeries', tutorialSeriesSchema);
