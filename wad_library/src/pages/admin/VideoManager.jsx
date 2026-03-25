import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import videosData from '../../data/videos.json';
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiX, FiSave } from 'react-icons/fi';
import './Admin.css';

export default function VideoManager() {
  const [videos, setVideos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', youtubeUrl: '', category: '', thumbnail: '', duration: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('library_videos');
    if (stored) {
      try { setVideos(JSON.parse(stored)); } catch { setVideos(videosData); }
    } else {
      setVideos(videosData);
    }
  }, []);

  const saveVideos = (updated) => {
    setVideos(updated);
    localStorage.setItem('library_videos', JSON.stringify(updated));
  };

  const resetForm = () => {
    setForm({ title: '', description: '', youtubeUrl: '', category: '', thumbnail: '', duration: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (video) => {
    setForm({
      title: video.title,
      description: video.description,
      youtubeUrl: video.youtubeUrl,
      category: video.category,
      thumbnail: video.thumbnail,
      duration: video.duration,
    });
    setEditingId(video.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      const updated = videos.filter((v) => v.id !== id);
      saveVideos(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Update
      const updated = videos.map((v) =>
        v.id === editingId ? { ...v, ...form } : v
      );
      saveVideos(updated);
    } else {
      // Create
      const newVideo = {
        id: Date.now(),
        ...form,
        dateAdded: new Date().toISOString().split('T')[0],
      };
      // Auto-generate thumbnail from YouTube URL
      if (!newVideo.thumbnail && newVideo.youtubeUrl) {
        const match = newVideo.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/);
        if (match) {
          newVideo.thumbnail = `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
        }
      }
      saveVideos([...videos, newVideo]);
    }
    resetForm();
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <Link to="/admin" className="back-link"><FiArrowLeft /> Back to Dashboard</Link>
          <h1>Video Manager</h1>
          <p>Create, edit, and delete tutorial videos</p>
        </div>
        <button className="admin-btn primary" onClick={handleAdd} id="add-video-btn">
          <FiPlus /> Add Video
        </button>
      </div>

      {/* Video Form Modal */}
      {showForm && (
        <div className="admin-modal-backdrop" onClick={resetForm}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingId ? 'Edit Video' : 'Add New Video'}</h2>
              <button className="modal-close" onClick={resetForm}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g., How to Access IEEE Xplore"
                  required
                  id="video-title-input"
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe what this tutorial covers..."
                  rows={3}
                  required
                  id="video-desc-input"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>YouTube URL *</label>
                  <input
                    type="url"
                    value={form.youtubeUrl}
                    onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                    id="video-url-input"
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    placeholder="e.g., IEEE, Google Scholar"
                    required
                    id="video-category-input"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Thumbnail URL</label>
                  <input
                    type="url"
                    value={form.thumbnail}
                    onChange={(e) => handleChange('thumbnail', e.target.value)}
                    placeholder="Auto-generated from YouTube URL"
                    id="video-thumb-input"
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => handleChange('duration', e.target.value)}
                    placeholder="e.g., 10:30"
                    id="video-duration-input"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="admin-btn secondary" onClick={resetForm}>Cancel</button>
                <button type="submit" className="admin-btn primary" id="save-video-btn">
                  <FiSave /> {editingId ? 'Update Video' : 'Add Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Videos Table */}
      <div className="admin-section">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video.id}>
                  <td>
                    <img src={video.thumbnail} alt="" className="table-thumb" />
                  </td>
                  <td className="table-title">{video.title}</td>
                  <td><span className="table-badge">{video.category}</span></td>
                  <td>{video.duration}</td>
                  <td>{video.dateAdded}</td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn edit" onClick={() => handleEdit(video)} title="Edit">
                        <FiEdit2 />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(video.id)} title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {videos.length === 0 && (
          <div className="empty-state">
            <p>No videos yet. Click "Add Video" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
