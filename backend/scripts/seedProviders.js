import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Provider from '../models/Provider.js';

dotenv.config();

const providers = [
  {
    name: 'IEEE Xplore',
    shortName: 'IEEE',
    category: 'Engineering',
    description: 'Search journals, conferences, and standards with institutional access.',
    baseUrl: 'https://ieeexplore.ieee.org',
    searchUrl: 'https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=',
    color: '#0057B8',
    icon: 'IEEE',
  },
  {
    name: 'Google Scholar',
    shortName: 'Scholar',
    category: 'Research',
    description: 'Find papers, citations, and author profiles across disciplines.',
    baseUrl: 'https://scholar.google.com',
    searchUrl: 'https://scholar.google.com/scholar?q=',
    color: '#4285F4',
    icon: 'GS',
  },
  {
    name: 'arXiv',
    shortName: 'arXiv',
    category: 'Preprints',
    description: 'Access freely available preprints in science, technology, and mathematics.',
    baseUrl: 'https://arxiv.org',
    searchUrl: 'https://arxiv.org/search/?query=',
    color: '#BC2A8D',
    icon: 'AX',
  },
  {
    name: 'ACM Digital Library',
    shortName: 'ACM',
    category: 'Computer Science',
    description: 'Browse ACM journals, proceedings, and conference papers.',
    baseUrl: 'https://dl.acm.org',
    searchUrl: 'https://dl.acm.org/action/doSearch?AllField=',
    color: '#F15A24',
    icon: 'ACM',
  },
  {
    name: 'SpringerLink',
    shortName: 'Springer',
    category: 'Academic',
    description: 'Search books, journals, and articles with link-based access.',
    baseUrl: 'https://link.springer.com',
    searchUrl: 'https://link.springer.com/search?query=',
    color: '#6BA6FF',
    icon: 'SP',
  },
  {
    name: 'Scopus',
    shortName: 'Scopus',
    category: 'Multidisciplinary',
    description: 'Abstract and citation database across science, technology, medicine, and social sciences.',
    baseUrl: 'https://www.scopus.com',
    searchUrl: 'https://www.scopus.com/results/results.uri?sort=plf-f&src=s&st1=',
    color: '#F1A200',
    icon: 'SC',
  },
  {
    name: 'PubMed',
    shortName: 'PubMed',
    category: 'Biomedical',
    description: 'Free search interface for MEDLINE and biomedical literature.',
    baseUrl: 'https://pubmed.ncbi.nlm.nih.gov',
    searchUrl: 'https://pubmed.ncbi.nlm.nih.gov/?term=',
    color: '#0078D4',
    icon: 'PM',
  },
  {
    name: 'ResearchGate',
    shortName: 'ResearchGate',
    category: 'Research Network',
    description: 'Network for researchers to discover and share publications.',
    baseUrl: 'https://www.researchgate.net',
    searchUrl: 'https://www.researchgate.net/search?q=',
    color: '#00ACEE',
    icon: 'RG',
  },
  {
    name: 'JSTOR',
    shortName: 'JSTOR',
    category: 'Digital Library',
    description: 'Academic journals, books, and primary sources.',
    baseUrl: 'https://www.jstor.org',
    searchUrl: 'https://www.jstor.org/action/doBasicSearch?Query=',
    color: '#C41230',
    icon: 'JS',
  },
  {
    name: 'Semantic Scholar',
    shortName: 'Semantic Scholar',
    category: 'AI-Powered Search',
    description: 'AI-powered academic search with citation context and filters.',
    baseUrl: 'https://www.semanticscholar.org',
    searchUrl: 'https://www.semanticscholar.org/search?q=',
    color: '#1F90FF',
    icon: 'SS',
  },
  {
    name: 'WorldWideScience',
    shortName: 'WWScience',
    category: 'Global Search',
    description: 'Federated search across international scientific databases.',
    baseUrl: 'https://worldwidescience.org',
    searchUrl: 'https://worldwidescience.org/search?q=',
    color: '#2E8B57',
    icon: 'WW',
  },
  {
    name: 'ScienceDirect',
    shortName: 'ScienceDirect',
    category: 'Publisher Database',
    description: 'Elsevier journals and books across science and engineering.',
    baseUrl: 'https://www.sciencedirect.com',
    searchUrl: 'https://www.sciencedirect.com/search?qs=',
    color: '#FF6C00',
    icon: 'SD',
  },
  {
    name: 'DOAJ',
    shortName: 'DOAJ',
    category: 'Open Access',
    description: 'Directory of peer-reviewed open access journals.',
    baseUrl: 'https://doaj.org',
    searchUrl: 'https://doaj.org/search/articles/',
    color: '#2A9D8F',
    icon: 'DJ',
  },
  {
    name: 'BASE',
    shortName: 'BASE',
    category: 'Open Repository Search',
    description: 'Search engine for academic web resources and repositories.',
    baseUrl: 'https://www.base-search.net',
    searchUrl: 'https://www.base-search.net/Search/Results?lookfor=',
    color: '#264653',
    icon: 'BS',
  },
  {
    name: 'CORE',
    shortName: 'CORE',
    category: 'Open Access Aggregator',
    description: 'Aggregated open access papers from repositories and journals.',
    baseUrl: 'https://core.ac.uk',
    searchUrl: 'https://core.ac.uk/search?q=',
    color: '#E76F51',
    icon: 'CR',
  },
];

async function seedProviders() {
  if (!process.env.MONGO_URI) {
    throw new Error('Missing MONGO_URI in environment');
  }

  await mongoose.connect(process.env.MONGO_URI);

  const operations = providers.map((provider) => ({
    updateOne: {
      filter: { name: provider.name },
      update: { $set: provider },
      upsert: true,
    },
  }));

  const result = await Provider.bulkWrite(operations);
  const total = await Provider.countDocuments();

  console.log('Providers submitted:', providers.length);
  console.log(
    'Bulk summary:',
    JSON.stringify({
      matched: result.matchedCount,
      modified: result.modifiedCount,
      upserted: result.upsertedCount,
    })
  );
  console.log('Total providers in DB:', total);

  await mongoose.disconnect();
}

seedProviders().catch(async (error) => {
  console.error('Provider seeding failed:', error.message);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore disconnect errors
  }
  process.exit(1);
});
