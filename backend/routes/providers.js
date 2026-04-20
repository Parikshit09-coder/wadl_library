import express from 'express';
import Provider from '../models/Provider.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const providers = await Provider.find().sort({ name: 1 });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch providers', error: error.message });
  }
});

export default router;
