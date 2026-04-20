import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdSearch, MdVideoLibrary, MdArchitecture, MdSchool, MdPublic, MdArrowForward } from 'react-icons/md';
import { apiFetch } from '../api';
import ProviderLogo from '../components/ProviderLogo';

export default function Home() {
  const [providers, setProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await apiFetch('/providers');
        if (Array.isArray(data)) {
          setProviders(data);
        }
      } catch (err) {
        console.error('Failed to fetch providers:', err);
      }
    };
    fetchProviders();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-academic-50">
      
      {/* Editorial Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[120%] bg-gradient-to-bl from-academic-200/60 to-transparent rounded-full opacity-60 blur-[140px] pointer-events-none z-0"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Text Asymmetry */}
          <div className="lg:w-7/12 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-ambient mb-10 border border-academic-100/50">
              <span className="w-2.5 h-2.5 rounded-full bg-academic-900 animate-pulse"></span>
              <span className="text-xs font-bold text-academic-900 tracking-wider uppercase">The Digital Curator System</span>
            </div>
            
            <h1 className="font-display font-black text-6xl md:text-8xl text-academic-900 leading-[1.05] tracking-tight mb-8">
              Curate Your <br />
              <span className="text-academic-500 italic font-semibold">Academic Legacy</span>
            </h1>
            
            <p className="font-body text-xl md:text-2xl text-academic-600 leading-relaxed max-w-2xl font-light mb-12">
              An institutional-grade platform unifying 50,000+ elite research journals, dissertations, and masterclass tutorials into one serene experience.
            </p>
            
            <form onSubmit={handleSearch} className="w-full max-w-2xl relative bg-white/90 backdrop-blur-2xl shadow-[0_8px_30px_rgb(5,52,92,0.06)] rounded-2xl flex items-center p-2 border border-academic-100 transition-all hover:shadow-[0_8px_40px_rgb(5,52,92,0.1)] focus-within:border-academic-300">
              <div className="pl-6 pr-4 text-academic-400">
                <MdSearch size={28} />
              </div>
              <input
                type="text"
                placeholder="Search IEEE, Nature, arXiv..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none py-5 text-lg font-medium text-academic-900 placeholder-academic-400"
              />
              <button type="submit" className="bg-academic-900 text-white rounded-xl px-8 py-4 font-bold tracking-wide hover:bg-academic-800 transition-colors flex items-center gap-2">
                Discover <MdArrowForward size={20} />
              </button>
            </form>
          </div>

          {/* Right Floating Cards Asymmetry */}
          <div className="lg:w-5/12 relative hidden lg:block h-[500px] w-full">
            {/* Card 1 */}
            <div className="absolute top-10 right-0 w-72 bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgb(5,52,92,0.08)] border border-academic-50 z-20 transition-transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-academic-50 rounded-2xl flex items-center justify-center text-academic-900 mb-6">
                <MdArchitecture size={28} />
              </div>
              <h3 className="font-display font-bold text-xl text-academic-900 mb-3">Structured Flow</h3>
              <p className="text-academic-500 font-body text-sm leading-relaxed">
                Step-by-step methodologies mapping complex research concepts.
              </p>
            </div>
            {/* Card 2 */}
            <div className="absolute bottom-10 right-32 w-72 bg-academic-900 rounded-3xl p-8 shadow-[0_20px_40px_rgb(5,52,92,0.15)] z-10 transition-transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6">
                <MdPublic size={28} />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-3">Global Access</h3>
              <p className="text-white/70 font-body text-sm leading-relaxed">
                Aggregating the world's most prestigious institutional databases.
              </p>
            </div>
          </div>
          
        </div>
      </section>

      {/* Repositories / Databases Section - Deep Whitespace Rule */}
      <section className="bg-white py-32 rounded-[3rem] shadow-[0_-20px_60px_rgb(0,0,0,0.02)] relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="font-display font-extrabold text-4xl md:text-5xl text-academic-900 mb-6 leading-tight">
                Institutional <br />
                <span className="text-academic-500 font-medium">Databases</span>
              </h2>
              <p className="text-academic-500 text-lg leading-relaxed max-w-xl">
                Direct access to masterclass-level papers across science, engineering, and humanities. No clutter. Pure research.
              </p>
            </div>
            <Link to="/search" className="inline-flex items-center gap-2 text-academic-900 font-bold hover:text-academic-600 transition-colors bg-academic-50 px-6 py-3 rounded-xl">
              Explore All <MdArrowForward size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {providers.slice(0, 6).map((provider) => {
              const accentColors = ['bg-[#b3cdfd]', 'bg-[#dce9ff]', 'bg-[#c4dcff]', 'bg-[#e5eeff]'];
              const randomAccent = accentColors[provider.id % accentColors.length] || accentColors[0];
              
              return (
                <a 
                  href={provider.searchUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  key={provider.id} 
                  className="group bg-academic-50 rounded-[2rem] p-8 transition-all duration-300 hover:bg-academic-100 hover:shadow-ambient flex flex-col border border-transparent hover:border-academic-200"
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${randomAccent} text-academic-900 transition-transform group-hover:scale-110`}>
                    <ProviderLogo provider={provider} size={32} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-2xl text-academic-900 mb-3">{provider.name}</h3>
                    <p className="font-bold text-xs uppercase tracking-widest text-academic-400 mb-6">{provider.category}</p>
                    <p className="text-academic-600 leading-relaxed font-medium">
                      Advanced analytical queries across {provider.shortName}'s vast repository.
                    </p>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-academic-200/60 flex items-center justify-between text-academic-900 font-bold opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span>Search Papers</span>
                    <MdArrowForward size={20} />
                  </div>
                </a>
              );
            })}
          </div>
          
        </div>
      </section>

      {/* Guided Path Section */}
      <section className="py-32 bg-academic-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="md:w-1/2">
             <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                <MdVideoLibrary size={32} className="text-white" />
             </div>
             <h2 className="font-display font-extrabold text-4xl md:text-6xl mb-6 leading-tight">Masterclass <br/><span className="text-academic-400 italic font-medium">Tutorials</span></h2>
             <p className="text-academic-300 text-lg md:text-xl leading-relaxed mb-10 max-w-lg font-light">
               Progressive learning tracks designed to teach you how to write, format, and publish high-tier research.
             </p>
             <Link 
                to="/videos" 
                className="bg-white text-academic-900 hover:bg-academic-50 font-bold px-8 py-4 rounded-xl transition-all shadow-lg inline-flex items-center gap-3"
             >
                Start Learning <MdSchool size={22} />
             </Link>
          </div>
          
          <div className="md:w-1/2 relative bg-white/5 backdrop-blur-md border border-white/10 p-1 rounded-3xl">
             <div className="bg-academic-800 rounded-[1.5rem] p-10 overflow-hidden relative">
               <div className="absolute right-0 top-0 w-32 h-32 bg-academic-400 opacity-20 rounded-full blur-[40px]"></div>
               <ul className="space-y-8 relative z-10">
                 {[
                   { step: '01', title: 'Data Gathering Models', desc: 'Sourcing and curating accurate datasets.' },
                   { step: '02', title: 'Literature Formatting', desc: 'Navigating IEEE and LaTeX standards.' },
                   { step: '03', title: 'Scholarly Publication', desc: 'Submitting and enduring peer review.' }
                 ].map((item, i) => (
                   <li key={i} className="flex gap-6 items-start">
                     <span className="font-display font-extrabold text-3xl text-academic-500/50 pt-1">{item.step}</span>
                     <div>
                       <h4 className="font-display font-bold text-xl mb-1 text-white">{item.title}</h4>
                       <p className="text-academic-300 text-sm leading-relaxed">{item.desc}</p>
                     </div>
                   </li>
                 ))}
               </ul>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
}
