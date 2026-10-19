import { useState, useEffect } from 'react';
import { MdSearch } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiExternalLink, FiTrendingUp } from 'react-icons/fi';
import { apiFetch } from '../api';
import ProviderLogo from '../components/ProviderLogo';
import OpacLinks from '../components/OpacLinks';
import './Search.css';

const trendingSearches = [
  'Machine Learning',
  'Deep Learning',
  'Internet of Things',
  'Blockchain Technology',
  'Cloud Computing',
  'Cybersecurity',
  'Natural Language Processing',
  'Computer Vision',
  'Edge Computing',
  'Quantum Computing',
  '5G Networks',
  'Autonomous Vehicles',
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
        if (Array.isArray(data) && data.length > 0) {
          setProviders(data);
          setSelectedProviders(data.map((p) => p.id));
        } else {
          setProviders([]);
        }
      } catch (error) {
        console.error('Failed to fetch providers:', error);
        setProviders([]);
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

  const selectAll = () => setSelectedProviders(providers.map((p) => p.id));
  const deselectAll = () => setSelectedProviders([]);

  const activeProviders = providers.filter((p) => selectedProviders.includes(p.id));

  const quickSearch = (term) => {
    setQuery(term);
    setSearchParams({ q: term });
    setHasSearched(true);
  };

  return (
    <div className="search-page">
      <section className="search-hero">
        <div className="search-hero-container">
          <span className="section-badge">Unified Search</span>
          <h1>Search Research Papers <span className="highlight">Everywhere</span></h1>
          <p>One search, multiple platforms. Find papers across IEEE, Google Scholar, arXiv, and more.</p>

          <form className="search-main-form" onSubmit={handleSearch}>
            <div className="search-main-input-wrap">
              <FiSearch className="search-main-icon" />
              <input
                type="text"
                placeholder="Enter your research topic, keywords, or paper title..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                id="search-page-input"
              />
            </div>
            <button type="submit" className="search-main-btn" id="search-page-btn">Search All</button>
          </form>
        </div>
      </section>

      <section className="search-content">
        <div className="search-container">
          <div className="search-opac"><OpacLinks /></div>
          {/* Provider Filter Sidebar */}
          <aside className="search-sidebar">
            <div className="sidebar-card">
              <div className="sidebar-header">
                <h3>Providers</h3>
                <div className="sidebar-actions">
                  <button onClick={selectAll}>All</button>
                  <button onClick={deselectAll}>None</button>
                </div>
              </div>
              <div className="provider-checkboxes">
                {providers.map((p) => (
                  <label key={p.id} className="provider-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedProviders.includes(p.id)}
                      onChange={() => toggleProvider(p.id)}
                    />
                    <ProviderLogo provider={p} className="checkbox-icon" size={20} />
                    <span className="checkbox-name">{p.shortName}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="sidebar-card trending-card">
              <h3><FiTrendingUp /> Trending Searches</h3>
              <div className="trending-tags">
                {trendingSearches.map((term) => (
                  <button key={term} className="trending-tag" onClick={() => quickSearch(term)}>
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Results Area */}
          <main className="search-results">
            {!hasSearched ? (
              <div className="search-empty">
                <div className="search-empty-icon"><MdSearch /></div>
                <h2>Start Your Research</h2>
                <p>Enter a topic above to search across all selected providers simultaneously</p>
              </div>
            ) : (
              <div className="results-list">
                <h2 className="results-title">
                  Results for "<span className="highlight">{searchParams.get('q')}</span>" across {activeProviders.length} providers
                </h2>
                <div className="results-grid">
                  {activeProviders.map((provider) => {
                    const query = encodeURIComponent(searchParams.get('q') || '');
                    const searchUrl = `${provider.searchUrl}${query}`;
                    return (
                      <a
                        key={provider.id}
                        href={searchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="result-card"
                        style={{ '--pcolor': provider.color }}
                      >
                        <div className="result-card-header">
                          <ProviderLogo provider={provider} className="result-provider-icon" size={32} />
                          <div>
                            <h3>{provider.name}</h3>
                            <span className="result-category">{provider.category}</span>
                          </div>
                        </div>
                        <p className="result-desc">{provider.description}</p>
                        <div className="result-action">
                          <span>Search on {provider.shortName}</span>
                          <FiExternalLink />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}
