import express from 'express';
import Resource from '../models/Resource.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = express.Router();

const pickFields = ({ particulars, url, videoUrl, description }) => ({
  particulars,
  url,
  videoUrl,
  description,
});

router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: 1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resources', error: error.message });
  }
});

router.post('/', requireAdminAuth, async (req, res) => {
  const data = pickFields(req.body);
  if (!data.particulars?.trim()) {
    return res.status(400).json({ message: 'Particulars is required' });
  }

  try {
    const resource = await Resource.create(data);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create resource', error: error.message });
  }
});

router.put('/:id', requireAdminAuth, async (req, res) => {
  const data = pickFields(req.body);
  if (!data.particulars?.trim()) {
    return res.status(400).json({ message: 'Particulars is required' });
  }

  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update resource', error: error.message });
  }
});

router.delete('/:id', requireAdminAuth, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete resource', error: error.message });
  }
});

export default router;
