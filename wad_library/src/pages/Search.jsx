import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MdSearch, MdOpenInNew, MdLayers } from 'react-icons/md';
import { apiFetch } from '../api';
import ProviderLogo from '../components/ProviderLogo';

const trendingSearches = [
  'Language Models',
  'Quantum Computing',
  'Neural Networks',
  'CRISPR',
  'Advanced Robotics',
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [providers, setProviders] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [hasSearched, setHasSearched] = useState(!!searchParams.get('q'));

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      setHasSearched(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await apiFetch('/providers');
        if (Array.isArray(data)) {
          setProviders(data);
          setSelectedProviders(data.map((p) => p.id));
        }
      } catch (error) {
        console.error('Failed to fetch providers:', error);
      }
    };
    fetchProviders();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      setHasSearched(true);
    }
  };

  const toggleProvider = (id) => {
    setSelectedProviders((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const activeProviders = providers.filter((p) => selectedProviders.includes(p.id));

  return (
    <div className="min-h-screen bg-academic-50 pt-20 pb-40">
      
      {/* Huge Editorial Search Header */}
      <section className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
        <h1 className="font-display font-black text-5xl md:text-7xl text-academic-900 mb-8 tracking-tight">
           Query <span className="text-academic-400 italic">Global</span> Archives
        </h1>
        
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-x-0 -bottom-4 h-full bg-academic-900/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative bg-white rounded-3xl p-3 flex shadow-ambient border border-academic-100 transition-all">
             <div className="pl-6 flex items-center justify-center text-academic-300">
               <MdSearch size={32} />
             </div>
             <input
                type="text"
                placeholder="Enter research topic, author, or DOI..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none px-6 py-5 text-xl font-medium text-academic-900 placeholder-academic-300"
             />
             <button type="submit" className="bg-academic-900 hover:bg-academic-800 text-white font-bold px-10 rounded-2xl transition-colors text-lg tracking-wide">
               Execute
             </button>
          </div>
        </form>

        <div className="mt-10 flex flex-wrap gap-3 items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-academic-400 mr-4">Trending:</span>
          {trendingSearches.map((term) => (
             <button
               key={term}
               onClick={() => { setQuery(term); setSearchParams({ q: term }); setHasSearched(true); }}
               className="bg-academic-100/50 hover:bg-academic-200 text-academic-600 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
             >
               {term}
             </button>
          ))}
        </div>
      </section>

      {/* Main Layout */}
      <section className="max-w-7xl mx-auto px-6 mt-16 flex flex-col lg:flex-row gap-16">
        
        {/* Editorial Sidebar */}
        <aside className="lg:w-80 shrink-0">
          <div className="sticky top-32">
             <div className="flex items-center gap-3 mb-8">
               <MdLayers size={24} className="text-academic-500" />
               <h3 className="font-display font-extrabold text-2xl text-academic-900">Active Repositories</h3>
             </div>
             
             <div className="space-y-3">
               {providers.map((p) => {
                 const isActive = selectedProviders.includes(p.id);
                 return (
                   <button 
                     key={p.id}
                     onClick={() => toggleProvider(p.id)}
                     className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-300 ${
                       isActive 
                         ? 'bg-white shadow-[0_10px_30px_rgb(5,52,92,0.06)]' 
                         : 'hover:bg-academic-100/50 opacity-60'
                     }`}
                   >
                     <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full transition-colors ${isActive ? 'bg-academic-500' : 'bg-academic-200'}`}></div>
                        <ProviderLogo provider={p} size={24} className={isActive ? '' : 'grayscale opacity-50'} />
                        <span className={`font-bold ${isActive ? 'text-academic-900' : 'text-academic-500'}`}>{p.shortName}</span>
                     </div>
                     {!isActive && <span className="text-xs font-bold text-academic-400">INACTIVE</span>}
                   </button>
                 );
               })}
             </div>
          </div>
        </aside>

        {/* Results Stream */}
        <main className="flex-1">
          {!hasSearched ? (
             <div className="h-full flex flex-col items-center justify-center py-32 text-center">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-academic-200 mb-8 shadow-ambient">
                  <MdSearch size={48} />
                </div>
                <h2 className="font-display font-bold text-3xl text-academic-900 mb-4">Awaiting Query</h2>
                <p className="text-academic-500 text-lg max-w-md">Select your required repositories and enter a topic to begin the aggregation process.</p>
             </div>
          ) : (
             <div className="animate-in fade-in duration-500">
               <div className="mb-12 border-b border-academic-200/50 pb-8">
                 <h2 className="font-display font-extrabold text-4xl text-academic-900 mb-2">
                   Routing "{searchParams.get('q')}"
                 </h2>
                 <p className="text-academic-500 font-medium text-lg">Distributing query across {activeProviders.length} active platforms.</p>
               </div>
               
               {activeProviders.length === 0 ? (
                  <div className="bg-red-50 text-red-800 p-8 rounded-3xl font-bold text-lg">
                    Critical: You must select at least one active repository to route the query.
                  </div>
               ) : (
                  <div className="grid gap-8">
                    {activeProviders.map((provider) => {
                      const queryParam = encodeURIComponent(searchParams.get('q') || '');
                      const searchUrl = `${provider.searchUrl}${queryParam}`;
                      
                      return (
                        <div key={provider.id} className="bg-white rounded-[2rem] p-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between group hover:shadow-[0_20px_60px_rgb(5,52,92,0.06)] transition-all duration-500">
                           <div className="flex gap-8 items-center">
                             <div className="w-20 h-20 bg-academic-50 rounded-[1.5rem] flex items-center justify-center shrink-0 border border-academic-100">
                               <ProviderLogo provider={provider} size={40} />
                             </div>
                             <div>
                               <p className="text-xs font-bold uppercase tracking-widest text-academic-400 mb-2">{provider.category}</p>
                               <h3 className="font-display font-extrabold text-3xl text-academic-900 mb-2">{provider.name}</h3>
                               <p className="text-academic-500 font-medium max-w-lg">Execute complex search algorithms on the native {provider.shortName} platform to retain full citation tracking.</p>
                             </div>
                           </div>
                           
                           <a 
                             href={searchUrl} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="shrink-0 bg-academic-50 hover:bg-academic-900 text-academic-900 hover:text-white group-hover:-rotate-2 transition-all duration-300 w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm"
                             title="Launch Query"
                           >
                             <MdOpenInNew size={24} />
                           </a>
                        </div>
                      );
                    })}
                  </div>
               )}
             </div>
          )}
        </main>
      </section>
    </div>
  );
}
