import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

dotenv.config();

const [, , emailArg] = process.argv;
const email = (emailArg || '').trim().toLowerCase();

if (!email) {
  console.error('Usage: node scripts/checkAdmin.js <email>');
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error('Missing MONGO_URI in environment');
  process.exit(1);
}

async function checkAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const admin = await Admin.findOne({ email }).lean();
  if (!admin) {
    console.log('Admin not found');
  } else {
    console.log(
      JSON.stringify(
        {
          email: admin.email,
          name: admin.name,
          isActive: admin.isActive,
          hasPasswordHash: Boolean(admin.passwordHash),
          passwordHashPrefix: admin.passwordHash ? admin.passwordHash.slice(0, 7) : null,
          hasPlainPassword: Object.prototype.hasOwnProperty.call(admin, 'password'),
        },
        null,
        2
      )
    );
  }

  await mongoose.disconnect();
}

checkAdmin().catch(async (error) => {
  console.error('Failed to check admin:', error.message);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore disconnect errors
  }
  process.exit(1);
});
