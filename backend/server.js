import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import resourceRoutes from './routes/resources.js';
import providersRoute from './routes/providers.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/providers', providersRoute);

app.get('/api', (req, res) => {
  res.json({ message: 'WADL Library backend is running' });
});

// Serve the built frontend (wad_library/dist) from the same server.
const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../wad_library/dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

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
