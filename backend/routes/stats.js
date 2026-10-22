import express from 'express';
import Counter from '../models/Counter.js';
import Visit from '../models/Visit.js';
import { requireAdminAuth } from '../middleware/auth.js';

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
    await Visit.create({});
    res.json({ visits: counter.value });
  } catch (error) {
    res.status(500).json({ message: 'Failed to record visit', error: error.message });
  }
});

const IST = 'Asia/Kolkata';

// Admin report: visits between `from` and `to` (inclusive), bucketed by day, month or year.
router.get('/report', requireAdminAuth, async (req, res) => {
  try {
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) {
      return res.status(400).json({ message: 'Valid from/to dates are required' });
    }
    to.setUTCHours(23, 59, 59, 999);

    const groupBy = ['day', 'month', 'year'].includes(req.query.groupBy) ? req.query.groupBy : 'day';
    const format = { day: '%Y-%m-%d', month: '%Y-%m', year: '%Y' }[groupBy];
    const range = { createdAt: { $gte: from, $lte: to } };

    const [series, hours, total, allTime, counter, first] = await Promise.all([
      Visit.aggregate([
        { $match: range },
        { $group: { _id: { $dateToString: { format, date: '$createdAt', timezone: IST } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Visit.aggregate([
        { $match: range },
        { $group: { _id: { $hour: { date: '$createdAt', timezone: IST } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Visit.countDocuments(range),
      Visit.countDocuments({}),
      Counter.findOne({ key: 'visits' }),
      Visit.findOne({}).sort({ createdAt: 1 }),
    ]);

    res.json({
      groupBy,
      total,
      allTimeTracked: allTime,
      lifetimeTotal: counter?.value ?? 0,
      trackingSince: first?.createdAt ?? null,
      series: series.map((r) => ({ label: r._id, count: r.count })),
      hours: Array.from({ length: 24 }, (_, h) => ({ hour: h, count: hours.find((r) => r._id === h)?.count ?? 0 })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to build report', error: error.message });
  }
});

export default router;
