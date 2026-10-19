import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    shortName: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    baseUrl: { type: String, required: true, trim: true },
    searchUrl: { type: String, required: true, trim: true },
    color: { type: String, default: '#1B2A4A', trim: true },
    icon: { type: String, default: 'LIB', trim: true },
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

export default mongoose.model('Provider', providerSchema);
