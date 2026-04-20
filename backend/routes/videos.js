import express from 'express';
import Video from '../models/Video.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ dateAdded: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch videos', error: error.message });
  }
});

router.post('/', requireAdminAuth, async (req, res) => {
  const { title, description, youtubeUrl, category, thumbnail, duration } = req.body;
  
  console.log('Received video payload:', { title, description, youtubeUrl, category, thumbnail, duration });
  
  if (!title || !description || !youtubeUrl || !category) {
    const missing = [];
    if (!title) missing.push('title');
    if (!description) missing.push('description');
    if (!youtubeUrl) missing.push('youtubeUrl');
    if (!category) missing.push('category');
    return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
  }

  try {
    const video = await Video.create({ title, description, youtubeUrl, category, thumbnail, duration });
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create video', error: error.message });
  }
});

router.put('/:id', requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const video = await Video.findByIdAndUpdate(id, updateData, { new: true });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update video', error: error.message });
  }
});

router.delete('/:id', requireAdminAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const video = await Video.findByIdAndDelete(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete video', error: error.message });
  }
});

export default router;
