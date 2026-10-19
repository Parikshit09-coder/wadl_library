import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = express.Router();

function getEnvFallbackAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = (process.env.ADMIN_PASSWORD || '').trim();
  const name = (process.env.ADMIN_NAME || 'Env Admin').trim();

  if (!email || !password) {
    return null;
  }

  return { email, password, name };
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const dbAdmin = await Admin.findOne({ email: normalizedEmail, isActive: true });
    if (dbAdmin) {
      const validPassword = await bcrypt.compare(password, dbAdmin.passwordHash);

      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }

      const token = jwt.sign(
        { id: dbAdmin.id, email: dbAdmin.email, name: dbAdmin.name },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      return res.json({
        user: { id: dbAdmin.id, email: dbAdmin.email, name: dbAdmin.name },
        token,
      });
    }

    const fallbackAdmin = getEnvFallbackAdmin();
    if (!fallbackAdmin || fallbackAdmin.email !== normalizedEmail || fallbackAdmin.password !== password) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { id: fallbackAdmin.email, email: fallbackAdmin.email, name: fallbackAdmin.name },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      user: { id: fallbackAdmin.email, email: fallbackAdmin.email, name: fallbackAdmin.name },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

router.get('/admins', requireAdminAuth, async (req, res) => {
  try {
    const admins = await Admin.find({ isActive: true })
      .select('email name isActive createdAt updatedAt')
      .sort({ createdAt: -1 });

    return res.json(admins);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch admins', error: error.message });
  }
});

router.post('/admins', requireAdminAuth, async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email, password, and name are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  try {
    const existing = await Admin.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'Admin already exists with this email' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await Admin.create({
      email: normalizedEmail,
      name: name.trim(),
      passwordHash,
      isActive: true,
    });

    return res.status(201).json({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      isActive: admin.isActive,
      createdAt: admin.createdAt,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create admin', error: error.message });
  }
});

router.put('/admins/:id/password', requireAdminAuth, async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await Admin.findByIdAndUpdate(req.params.id, { passwordHash }, { new: true });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    return res.json({ message: 'Password updated' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update password', error: error.message });
  }
});

router.delete('/admins/:id', requireAdminAuth, async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ message: 'You cannot remove your own admin account' });
  }

  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    return res.json({ message: 'Admin removed' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to remove admin', error: error.message });
  }
});

export default router;
