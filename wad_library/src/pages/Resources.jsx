import { useState, useMemo, useEffect } from 'react';
import { FiSearch, FiLink, FiMinusCircle } from 'react-icons/fi';
import { FaYoutube } from 'react-icons/fa';
import VideoModal from '../components/VideoModal';
import { apiFetch } from '../api';
import './Resources.css';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/resources')
      .then(setResources)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return resources;
    return resources.filter((r) =>
      [r.particulars, r.url, r.description].some((v) => v?.toLowerCase().includes(q))
    );
  }, [resources, search]);

  return (
    <div className="resources-page">
      <section className="resources-hero">
        <div className="resources-hero-container">
          <span className="section-badge">E-Resources</span>
          <h1>E-Resources @ <span className="highlight">PICT Central Library</span></h1>
          <p>Resources available for all faculty members and students</p>
        </div>
      </section>

      <section className="resources-content">
        <div className="resources-container">
          <div className="resources-search">
            <FiSearch />
            <input
              type="text"
              placeholder="Search e-resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="resources-search-input"
            />
          </div>

          {loading ? (
            <p className="resources-message">Loading e-resources...</p>
          ) : error ? (
            <p className="resources-message">Unable to load e-resources: {error}</p>
          ) : filtered.length === 0 ? (
            <p className="resources-message">No e-resources found.</p>
          ) : (
            <div className="resources-table-wrapper">
              <table className="resources-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Particulars</th>
                    <th>Link</th>
                    <th>Video</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id}>
                      <td>{i + 1}</td>
                      <td className="resources-particulars">{r.particulars}</td>
                      <td>
                        {r.url ? (
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resources-icon-link"
                            title={r.url}
                            aria-label={`Open ${r.particulars}`}
                          >
                            <FiLink />
                          </a>
                        ) : (
                          <span className="resources-empty" title="Not added yet"><FiLink /></span>
                        )}
                      </td>
                      <td>
                        {r.videoUrl ? (
                          <button
                            className="resources-yt"
                            onClick={() => setSelected(r)}
                            title="Watch video"
                            aria-label={`Watch video for ${r.particulars}`}
                          >
                            <FaYoutube />
                          </button>
                        ) : (
                          <span className="resources-empty" title="Not added yet"><FaYoutube /></span>
                        )}
                      </td>
                      <td>
                        {r.description || (
                          <span className="resources-empty plain" title="Not added yet"><FiMinusCircle /></span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {selected && <VideoModal video={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
