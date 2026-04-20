import express from 'express';
import TutorialSeries from '../models/TutorialSeries.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = express.Router();

function getYouTubeThumb(youtubeUrl) {
  const match = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : '';
}

function normalizeSeriesVideoPayload(payload = {}) {
  const title = (payload.title || '').trim();
  const description = (payload.description || '').trim();
  const youtubeUrl = (payload.youtubeUrl || '').trim();
  const duration = (payload.duration || '').trim();
  const thumbnailRaw = (payload.thumbnail || '').trim();

  if (!title || !description || !youtubeUrl) {
    return { error: 'Each series video requires title, description, and youtubeUrl' };
  }

  const thumbnail = thumbnailRaw || getYouTubeThumb(youtubeUrl);
  const order = Number.isFinite(Number(payload.order)) ? Number(payload.order) : 0;

  return {
    value: { title, description, youtubeUrl, thumbnail, duration, order },
  };
}

router.get('/', async (req, res) => {
  try {
    const series = await TutorialSeries.find().sort({ dateAdded: -1 });
    res.json(series);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tutorial series', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const series = await TutorialSeries.findById(req.params.id);
    if (!series) {
      return res.status(404).json({ message: 'Tutorial series not found' });
    }
    res.json(series);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tutorial series', error: error.message });
  }
});

router.post('/', requireAdminAuth, async (req, res) => {
  const { title, description, category, folderName, coverThumbnail, videos } = req.body;

  if (!title || !description || !category || !folderName) {
    return res.status(400).json({ message: 'title, description, category, and folderName are required' });
  }

  const normalizedVideos = [];
  if (Array.isArray(videos)) {
    for (const payload of videos) {
      const normalized = normalizeSeriesVideoPayload(payload);
      if (normalized.error) {
        return res.status(400).json({ message: normalized.error });
      }
      normalizedVideos.push(normalized.value);
    }
  }

  const finalCover = (coverThumbnail || '').trim() || (normalizedVideos[0]?.thumbnail || '');

  try {
    const series = await TutorialSeries.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      folderName: folderName.trim(),
      coverThumbnail: finalCover,
      videos: normalizedVideos,
    });

    res.status(201).json(series);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create tutorial series', error: error.message });
  }
});

router.put('/:id', requireAdminAuth, async (req, res) => {
  const { title, description, category, folderName, coverThumbnail } = req.body;

  const updateData = {};
  if (title !== undefined) updateData.title = title.trim();
  if (description !== undefined) updateData.description = description.trim();
  if (category !== undefined) updateData.category = category.trim();
  if (folderName !== undefined) updateData.folderName = folderName.trim();
  if (coverThumbnail !== undefined) updateData.coverThumbnail = coverThumbnail.trim();

  try {
    const series = await TutorialSeries.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!series) {
      return res.status(404).json({ message: 'Tutorial series not found' });
    }
    res.json(series);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update tutorial series', error: error.message });
  }
});

router.delete('/:id', requireAdminAuth, async (req, res) => {
  try {
    const deleted = await TutorialSeries.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Tutorial series not found' });
    }
    res.json({ message: 'Tutorial series deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete tutorial series', error: error.message });
  }
});

router.post('/:id/videos', requireAdminAuth, async (req, res) => {
  const normalized = normalizeSeriesVideoPayload(req.body);
  if (normalized.error) {
    return res.status(400).json({ message: normalized.error });
  }

  try {
    const series = await TutorialSeries.findById(req.params.id);
    if (!series) {
      return res.status(404).json({ message: 'Tutorial series not found' });
    }

    series.videos.push(normalized.value);

    if (!series.coverThumbnail) {
      series.coverThumbnail = normalized.value.thumbnail;
    }

    await series.save();
    res.status(201).json(series);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add series video', error: error.message });
  }
});

router.put('/:id/videos/:videoId', requireAdminAuth, async (req, res) => {
  try {
    const series = await TutorialSeries.findById(req.params.id);
    if (!series) {
      return res.status(404).json({ message: 'Tutorial series not found' });
    }

    const seriesVideo = series.videos.id(req.params.videoId);
    if (!seriesVideo) {
      return res.status(404).json({ message: 'Series video not found' });
    }

    const next = {
      title: req.body.title !== undefined ? req.body.title : seriesVideo.title,
      description: req.body.description !== undefined ? req.body.description : seriesVideo.description,
      youtubeUrl: req.body.youtubeUrl !== undefined ? req.body.youtubeUrl : seriesVideo.youtubeUrl,
      duration: req.body.duration !== undefined ? req.body.duration : seriesVideo.duration,
      thumbnail: req.body.thumbnail !== undefined ? req.body.thumbnail : seriesVideo.thumbnail,
      order: req.body.order !== undefined ? req.body.order : seriesVideo.order,
    };

    const normalized = normalizeSeriesVideoPayload(next);
    if (normalized.error) {
      return res.status(400).json({ message: normalized.error });
    }

    Object.assign(seriesVideo, normalized.value);
    await series.save();

    res.json(series);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update series video', error: error.message });
  }
});

router.delete('/:id/videos/:videoId', requireAdminAuth, async (req, res) => {
  try {
    const series = await TutorialSeries.findById(req.params.id);
    if (!series) {
      return res.status(404).json({ message: 'Tutorial series not found' });
    }

    const seriesVideo = series.videos.id(req.params.videoId);
    if (!seriesVideo) {
      return res.status(404).json({ message: 'Series video not found' });
    }

    seriesVideo.deleteOne();

    if (series.videos.length === 0) {
      series.coverThumbnail = '';
    }

    await series.save();
    res.json(series);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete series video', error: error.message });
  }
});

export default router;
