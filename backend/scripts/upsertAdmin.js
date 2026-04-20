import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

dotenv.config();

const [, , emailArg, passwordArg, ...nameParts] = process.argv;
const email = (emailArg || '').trim().toLowerCase();
const password = (passwordArg || '').trim();
const name = (nameParts.join(' ') || email || 'Admin').trim();

if (!email || !password) {
  console.error('Usage: node scripts/upsertAdmin.js <email> <password> [name]');
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error('Missing MONGO_URI in environment');
  process.exit(1);
}

async function upsertAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const passwordHash = await bcrypt.hash(password, 12);

  const result = await Admin.findOneAndUpdate(
    { email },
    {
      $set: {
        name,
        passwordHash,
        isActive: true,
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  console.log('Admin upserted:', result.email);
  console.log('Admin name:', result.name);
  console.log('Password hash prefix:', result.passwordHash.slice(0, 7));

  await mongoose.disconnect();
}

upsertAdmin().catch(async (error) => {
  console.error('Failed to upsert admin:', error.message);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore disconnect errors
  }
  process.exit(1);
});
