import { useState, useMemo } from 'react';
import videosData from '../data/videos.json';
import VideoCard from '../components/VideoCard';
import VideoModal from '../components/VideoModal';
import { FiSearch, FiFilter } from 'react-icons/fi';
import './Videos.css';

export default function Videos() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Get videos from localStorage (admin may have added/edited) or fallback to JSON
  const getVideos = () => {
    const stored = localStorage.getItem('library_videos');
    if (stored) {
      try { return JSON.parse(stored); } catch { return videosData; }
    }
    return videosData;
  };

  const videos = getVideos();
  const categories = ['All', ...new Set(videos.map((v) => v.category))];

  const filtered = useMemo(() => {
    return videos.filter((v) => {
      const matchCategory = activeCategory === 'All' || v.category === activeCategory;
      const matchSearch = !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.description.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [videos, activeCategory, search]);

  return (
    <div className="videos-page">
      <section className="videos-hero">
        <div className="videos-hero-container">
          <span className="section-badge">Video Tutorials</span>
          <h1>Learn How to Access <span className="highlight">Research Papers</span></h1>
          <p>Watch step-by-step tutorials on using IEEE, Google Scholar, and other research platforms</p>
        </div>
      </section>

      <section className="videos-content">
        <div className="videos-container">
          <div className="videos-toolbar">
            <div className="videos-search">
              <FiSearch />
              <input
                type="text"
                placeholder="Search tutorials..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="videos-search-input"
              />
            </div>
            <div className="videos-categories">
              <FiFilter className="filter-icon" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="videos-grid">
              {filtered.map((video) => (
                <VideoCard key={video.id} video={video} onClick={setSelectedVideo} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">📹</div>
              <h3>No tutorials found</h3>
              <p>Try adjusting your search or category filter</p>
            </div>
          )}
        </div>
      </section>

      {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  );
}
