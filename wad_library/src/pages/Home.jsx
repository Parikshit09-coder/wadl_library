import { useState, useEffect } from 'react';
import { MdLocalLibrary, MdScience, MdSchool, MdArticle } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiPlay, FiBookOpen, FiDatabase, FiUsers } from 'react-icons/fi';
import ProviderLogo from '../components/ProviderLogo';
import { apiFetch } from '../api';
import './Home.css';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [providers, setProviders] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [providerData, resourceData] = await Promise.all([
          apiFetch('/providers'),
          apiFetch('/resources'),
        ]);
        setProviders(providerData);
        setResources(resourceData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const stats = [
    { icon: <FiBookOpen />, value: '10M+', label: 'Research Papers' },
    { icon: <FiDatabase />, value: providers.length.toString(), label: 'Providers' },
    { icon: <FiPlay />, value: `${resources.length}`, label: 'E-Resources' },
    { icon: <FiUsers />, value: '5000+', label: 'Students Served' },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-badge"><MdLocalLibrary className="hero-badge-icon" /> PICT Library Portal</span>
            <h1>Discover Research <span className="highlight">Papers</span> Across Multiple Platforms</h1>
            <p>Search IEEE, Google Scholar, arXiv, and more — all from one place. Browse the e-resources available at the PICT Central Library.</p>
            <form className="hero-search" onSubmit={handleSearch}>
              <div className="search-input-wrapper">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search research papers across all providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  id="hero-search-input"
                />
              </div>
              <button type="submit" className="search-btn" id="hero-search-btn">Search</button>
            </form>
            <div className="hero-tags">
              <span>Popular:</span>
              {['Machine Learning', 'IoT', 'Blockchain', 'Cloud Computing'].map((tag) => (
                <button key={tag} className="tag" onClick={() => { setSearchQuery(tag); navigate(`/search?q=${encodeURIComponent(tag)}`); }}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="hero-illustration">
            <div className="hero-card card-1">
              <div className="hero-card-icon"><MdScience /></div>
              <span>IEEE Xplore</span>
            </div>
            <div className="hero-card card-2">
              <div className="hero-card-icon"><MdSchool /></div>
              <span>Google Scholar</span>
            </div>
            <div className="hero-card card-3">
              <div className="hero-card-icon"><MdArticle /></div>
              <span>arXiv</span>
            </div>
            <div className="books-stack">
              <div className="book book-1"></div>
              <div className="book book-2"></div>
              <div className="book book-3"></div>
              <div className="book book-4"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Providers Section */}
      <section className="providers-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Research Providers</span>
            <h2>Search Across <span className="highlight">Top Platforms</span></h2>
            <p>Access millions of research papers from the world's most trusted academic databases</p>
          </div>
          <div className="providers-grid">
            {providers.map((provider) => (
              <a
                key={provider.id}
                href={provider.baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="provider-card"
                style={{ '--provider-color': provider.color }}
              >
                <div className="provider-icon-wrap">
                  <ProviderLogo provider={provider} className="provider-icon" size={40} />
                </div>
                <h3>{provider.name}</h3>
                <p>{provider.description}</p>
                <span className="provider-category">{provider.category}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Explore Research Papers?</h2>
          <p>Sign in with your PICT credentials and start searching across all platforms.</p>
          <div className="cta-buttons">
            <Link to="/search" className="cta-btn primary">Start Searching</Link>
            <Link to="/resources" className="cta-btn secondary">View E-Resources</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
