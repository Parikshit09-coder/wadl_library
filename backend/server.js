import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import videoRoutes from './routes/videos.js';
import providersRoute from './routes/providers.js';
import tutorialSeriesRoutes from './routes/tutorialSeries.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/providers', providersRoute);
app.use('/api/tutorial-series', tutorialSeriesRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'WADL Library backend is running' });
});

async function start() {
  if (!process.env.MONGO_URI) {
    console.error('Missing MONGO_URI in environment');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Backend server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start backend', error);
    process.exit(1);
  }
}

start();
