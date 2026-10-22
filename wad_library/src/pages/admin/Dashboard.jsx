import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiList, FiPlus, FiVideo, FiUsers, FiBarChart2 } from 'react-icons/fi';
import { apiFetch } from '../../api';
import './Admin.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/resources')
      .then(setResources)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const withVideo = resources.filter((r) => r.videoUrl).length;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, <strong>{user?.name}</strong></p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/report" className="admin-btn secondary">
            <FiBarChart2 /> Visit Report
          </Link>
          <Link to="/admin/admins" className="admin-btn secondary">
            <FiUsers /> Manage Admins
          </Link>
          <Link to="/admin/resources" className="admin-btn primary">
            <FiPlus /> Manage E-Resources
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="admin-section"><p>Loading dashboard data...</p></div>
      ) : error ? (
        <div className="admin-section"><div className="empty-state"><p>{error}</p></div></div>
      ) : (
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: 'rgba(232, 121, 58, 0.1)', color: 'var(--orange)' }}><FiList /></div>
            <div>
              <div className="admin-stat-value">{resources.length}</div>
              <div className="admin-stat-label">Total E-Resources</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: 'rgba(27, 42, 74, 0.1)', color: 'var(--navy)' }}><FiVideo /></div>
            <div>
              <div className="admin-stat-value">{withVideo}</div>
              <div className="admin-stat-label">With Video</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
