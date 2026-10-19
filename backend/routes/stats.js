import express from 'express';
import Counter from '../models/Counter.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const counter = await Counter.findOne({ key: 'visits' });
    res.json({ visits: counter?.value ?? 0 });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
});

// Called once per browser session; atomically increments the visit counter.
router.post('/visit', async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { key: 'visits' },
      { $inc: { value: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ visits: counter.value });
  } catch (error) {
    res.status(500).json({ message: 'Failed to record visit', error: error.message });
  }
});

export default router;
