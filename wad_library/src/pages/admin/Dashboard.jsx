import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiVideo, FiPlus, FiTrendingUp, FiClock } from 'react-icons/fi';
import videosData from '../../data/videos.json';
import './Admin.css';

export default function Dashboard() {
  const { user } = useAuth();

  const getVideos = () => {
    const stored = localStorage.getItem('library_videos');
    if (stored) {
      try { return JSON.parse(stored); } catch { return videosData; }
    }
    return videosData;
  };

  const videos = getVideos();
  const categories = [...new Set(videos.map((v) => v.category))];
  const recentVideos = [...videos].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)).slice(0, 5);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, <strong>{user?.name}</strong></p>
        </div>
        <Link to="/admin/videos" className="admin-btn primary">
          <FiPlus /> Manage Videos
        </Link>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(232, 121, 58, 0.1)', color: 'var(--orange)' }}><FiVideo /></div>
          <div>
            <div className="admin-stat-value">{videos.length}</div>
            <div className="admin-stat-label">Total Videos</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(27, 42, 74, 0.1)', color: 'var(--navy)' }}><FiTrendingUp /></div>
          <div>
            <div className="admin-stat-value">{categories.length}</div>
            <div className="admin-stat-label">Categories</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50' }}><FiClock /></div>
          <div>
            <div className="admin-stat-value">{recentVideos.length}</div>
            <div className="admin-stat-label">Recent Additions</div>
          </div>
        </div>
      </div>

      <div className="admin-section">
        <h2>Recently Added Videos</h2>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Date Added</th>
              </tr>
            </thead>
            <tbody>
              {recentVideos.map((video) => (
                <tr key={video.id}>
                  <td className="table-title">{video.title}</td>
                  <td><span className="table-badge">{video.category}</span></td>
                  <td>{video.duration}</td>
                  <td>{video.dateAdded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-section">
        <h2>Categories Overview</h2>
        <div className="category-chips">
          {categories.map((cat) => {
            const count = videos.filter((v) => v.category === cat).length;
            return (
              <div className="category-chip" key={cat}>
                <span className="chip-name">{cat}</span>
                <span className="chip-count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
