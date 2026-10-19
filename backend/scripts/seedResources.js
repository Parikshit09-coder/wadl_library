import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Resource from '../models/Resource.js';

dotenv.config();

const resources = [
  {
    particulars: 'IEEE-ASPP e-Journals (IP based multi-user access)',
    url: 'https://ieeexplore.ieee.org/Xplore/home.jsp',
  },
  {
    particulars: 'Springer Nature e-Journals and e-Books (IP based multi-user access)',
    url: 'https://link.springer.com/',
  },
  {
    particulars: 'AICTE e-Kumbh (Open source database - multi-user access through internet)',
    url: 'https://ekumbh.aicte-india.org/index.php',
  },
  {
    particulars: 'NPTEL (Open source database - multi-user access through internet)',
    url: 'https://nptel.ac.in/',
  },
  {
    particulars: 'DELNET (IP based - multi-user access through internet)',
    url: 'https://discovery.delnet.in/',
  },
  {
    particulars: 'British Council Library (Single user membership)',
    url: 'https://www.britishcouncil.in/library',
  },
  {
    particulars: 'Library Web-OPAC (In-PICT campus)',
    url: 'http://10.10.9.231:8018/autolibwebopac/Login.aspx',
    description: 'For PICT internet users. Username: ERP Enrollment No. Password: Date of Birth (dd/mm/yyyy).',
  },
  {
    particulars: 'Library Web-OPAC (Off-PICT campus)',
    url: 'http://103.97.166.170:8018/autolibwebopac/Login.aspx',
    description: 'For other internet users. Username: ERP Enrollment No. Password: Date of Birth (dd/mm/yyyy).',
  },
  {
    particulars: 'Features of AutoLib-NG Web-OPAC',
    description:
      'Book Search, Book Renew, Book Reservation, Book Recommendation, New Arrivals Display, Repository, E-Resources and many more.',
  },
  {
    particulars: 'Shubhaarti SAGE Digital Library',
    url: 'https://library.shubhaarti.in/content',
  },
  {
    particulars: 'NDLI (National Digital Library of India)',
    url: 'https://www.ndl.gov.in/',
  },
  {
    particulars: 'Question Papers Bank',
    url: 'https://drive.google.com/drive/folders/1rL7vTp3_T0GZX2fkFKdBc7ZXVBEThNIN?usp=drive_link',
  },
  {
    particulars: 'Packt Publication - Emerging Technologies e-Books',
    url: 'https://drive.google.com/drive/folders/1pHbaYkKXumS44J-epzhOhRgLhbcMeZLR?usp=drive_link',
  },
];

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error('Missing MONGO_URI in environment');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  // Only add rows that are missing, so admin edits are never overwritten.
  let added = 0;
  for (const resource of resources) {
    const exists = await Resource.exists({ particulars: resource.particulars });
    if (!exists) {
      await Resource.create(resource);
      added += 1;
    }
  }
  console.log(`Added ${added} new resources (${resources.length - added} already existed)`);
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error('Seed failed', error);
  process.exit(1);
});
