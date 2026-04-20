import { useState, useMemo, useEffect } from 'react';
import VideoCard from '../components/VideoCard';
import VideoModal from '../components/VideoModal';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { apiFetch } from '../api';
import './Videos.css';

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [expandedSeriesId, setExpandedSeriesId] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const [videoData, tutorialSeriesData] = await Promise.all([
          apiFetch('/videos'),
          apiFetch('/tutorial-series'),
        ]);
        setVideos(videoData);
        setSeriesList(tutorialSeriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const categories = ['All', ...new Set(videos.map((v) => v.category))];

  const filtered = useMemo(() => {
    return videos.filter((v) => {
      const matchCategory = activeCategory === 'All' || v.category === activeCategory;
      const matchSearch = !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.description.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [videos, activeCategory, search]);

  const filteredSeries = useMemo(() => {
    return seriesList.filter((series) => {
      const matchCategory = activeCategory === 'All' || series.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        series.title.toLowerCase().includes(q) ||
        series.description.toLowerCase().includes(q) ||
        series.folderName.toLowerCase().includes(q) ||
        (series.videos || []).some((video) => video.title.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [seriesList, activeCategory, search]);

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

          {loading ? (
            <div className="no-results">
              <div className="no-results-icon">⏳</div>
              <h3>Loading tutorials...</h3>
            </div>
          ) : error ? (
            <div className="no-results">
              <div className="no-results-icon">⚠️</div>
              <h3>Unable to load tutorials</h3>
              <p>{error}</p>
            </div>
          ) : filtered.length > 0 || filteredSeries.length > 0 ? (
            <>
              {filtered.length > 0 && (
                <>
                  <h2 className="videos-subheading">Single Tutorials</h2>
                  <div className="videos-grid">
                    {filtered.map((video) => (
                      <VideoCard key={video.id} video={video} onClick={setSelectedVideo} />
                    ))}
                  </div>
                </>
              )}

              {filteredSeries.length > 0 && (
                <>
                  <h2 className="videos-subheading folders">Tutorial Folders (Series)</h2>
                  <div className="series-folder-grid">
                    {filteredSeries.map((series) => (
                      <div className="series-folder-card" key={series.id}>
                        <button
                          className="series-folder-header"
                          onClick={() => setExpandedSeriesId((prev) => (prev === series.id ? null : series.id))}
                        >
                          <img src={series.coverThumbnail || (series.videos?.[0]?.thumbnail || '')} alt="" className="series-cover" />
                          <div>
                            <h3>{series.folderName}</h3>
                            <p>{series.title}</p>
                            <span>{series.category} | {(series.videos || []).length} videos</span>
                          </div>
                        </button>

                        {expandedSeriesId === series.id && (
                          <div className="series-video-list">
                            {(series.videos || []).map((video) => (
                              <button className="series-video-item" key={video.id} onClick={() => setSelectedVideo(video)}>
                                <span>{video.order ?? 0}.</span>
                                <div>
                                  <strong>{video.title}</strong>
                                  <p>{video.duration || 'Duration N/A'}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
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
