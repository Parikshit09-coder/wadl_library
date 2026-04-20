import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFetch, authHeaders } from '../../api';
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiX, FiSave, FiFolder, FiFilm } from 'react-icons/fi';
import './Admin.css';

function getYouTubeThumbnail(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : '';
}

export default function VideoManager() {
  const { token } = useAuth();
  const [activeMode, setActiveMode] = useState('single');

  const [videos, setVideos] = useState([]);
  const [showSingleForm, setShowSingleForm] = useState(false);
  const [editingSingleId, setEditingSingleId] = useState(null);
  const [singleForm, setSingleForm] = useState({
    title: '', description: '', youtubeUrl: '', category: '', thumbnail: '', duration: ''
  });

  const [seriesList, setSeriesList] = useState([]);
  const [showSeriesForm, setShowSeriesForm] = useState(false);
  const [editingSeriesId, setEditingSeriesId] = useState(null);
  const [seriesForm, setSeriesForm] = useState({
    title: '', description: '', category: '', folderName: '', coverThumbnail: ''
  });

  const [showSeriesVideoForm, setShowSeriesVideoForm] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [editingSeriesVideoId, setEditingSeriesVideoId] = useState(null);
  const [seriesVideoForm, setSeriesVideoForm] = useState({
    title: '', description: '', youtubeUrl: '', thumbnail: '', duration: '', order: '0'
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const headers = authHeaders(token);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [videoData, seriesData] = await Promise.all([
          apiFetch('/videos'),
          apiFetch('/tutorial-series'),
        ]);
        setVideos(videoData);
        setSeriesList(seriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const resetSingleForm = () => {
    setSingleForm({ title: '', description: '', youtubeUrl: '', category: '', thumbnail: '', duration: '' });
    setEditingSingleId(null);
    setShowSingleForm(false);
  };

  const resetSeriesForm = () => {
    setSeriesForm({ title: '', description: '', category: '', folderName: '', coverThumbnail: '' });
    setEditingSeriesId(null);
    setShowSeriesForm(false);
  };

  const resetSeriesVideoForm = () => {
    setSeriesVideoForm({ title: '', description: '', youtubeUrl: '', thumbnail: '', duration: '', order: '0' });
    setEditingSeriesVideoId(null);
    setShowSeriesVideoForm(false);
    setSelectedSeries(null);
  };

  const handleAddSingle = () => {
    resetSingleForm();
    setShowSingleForm(true);
  };

  const handleEditSingle = (video) => {
    setSingleForm({
      title: video.title,
      description: video.description,
      youtubeUrl: video.youtubeUrl,
      category: video.category,
      thumbnail: video.thumbnail,
      duration: video.duration,
    });
    setEditingSingleId(video.id);
    setShowSingleForm(true);
  };

  const handleDeleteSingle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      await apiFetch(`/videos/${id}`, {
        method: 'DELETE',
        headers,
      });
      setVideos((prev) => prev.filter((video) => video.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmitSingle = async (e) => {
    e.preventDefault();

    if (!token) {
      alert('Admin token is required. Please sign in again.');
      return;
    }

    // Frontend validation
    if (!singleForm.title.trim()) {
      alert('Title is required');
      return;
    }
    if (!singleForm.description.trim()) {
      alert('Description is required');
      return;
    }
    if (!singleForm.youtubeUrl.trim()) {
      alert('YouTube URL is required');
      return;
    }
    if (!singleForm.category.trim()) {
      alert('Category is required');
      return;
    }

    const videoPayload = {
      title: singleForm.title.trim(),
      description: singleForm.description.trim(),
      youtubeUrl: singleForm.youtubeUrl.trim(),
      category: singleForm.category.trim(),
      thumbnail: singleForm.thumbnail.trim(),
      duration: singleForm.duration.trim(),
    };

    if (!videoPayload.thumbnail && videoPayload.youtubeUrl) {
      videoPayload.thumbnail = getYouTubeThumbnail(videoPayload.youtubeUrl);
    }

    try {
      let savedVideo;

      if (editingSingleId) {
        savedVideo = await apiFetch(`/videos/${editingSingleId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(videoPayload),
        });
        setVideos((prev) => prev.map((video) => (video.id === editingSingleId ? savedVideo : video)));
      } else {
        savedVideo = await apiFetch('/videos', {
          method: 'POST',
          headers,
          body: JSON.stringify(videoPayload),
        });
        setVideos((prev) => [savedVideo, ...prev]);
      }

      resetSingleForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddSeries = () => {
    resetSeriesForm();
    setShowSeriesForm(true);
  };

  const handleEditSeries = (series) => {
    setSeriesForm({
      title: series.title,
      description: series.description,
      category: series.category,
      folderName: series.folderName,
      coverThumbnail: series.coverThumbnail || '',
    });
    setEditingSeriesId(series.id);
    setShowSeriesForm(true);
  };

  const handleDeleteSeries = async (seriesId) => {
    if (!window.confirm('Delete this tutorial folder and all videos inside it?')) {
      return;
    }

    try {
      await apiFetch(`/tutorial-series/${seriesId}`, { method: 'DELETE', headers });
      setSeriesList((prev) => prev.filter((series) => series.id !== seriesId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmitSeries = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Admin token is required. Please sign in again.');
      return;
    }

    const payload = {
      title: seriesForm.title.trim(),
      description: seriesForm.description.trim(),
      category: seriesForm.category.trim(),
      folderName: seriesForm.folderName.trim(),
      coverThumbnail: seriesForm.coverThumbnail.trim(),
    };

    if (!payload.title || !payload.description || !payload.category || !payload.folderName) {
      alert('Title, description, category, and folder name are required');
      return;
    }

    try {
      let saved;
      if (editingSeriesId) {
        saved = await apiFetch(`/tutorial-series/${editingSeriesId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload),
        });
        setSeriesList((prev) => prev.map((series) => (series.id === editingSeriesId ? saved : series)));
      } else {
        saved = await apiFetch('/tutorial-series', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });
        setSeriesList((prev) => [saved, ...prev]);
      }
      resetSeriesForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const openAddSeriesVideo = (series) => {
    resetSeriesVideoForm();
    setSelectedSeries(series);
    setShowSeriesVideoForm(true);
  };

  const openEditSeriesVideo = (series, video) => {
    setSelectedSeries(series);
    setSeriesVideoForm({
      title: video.title,
      description: video.description,
      youtubeUrl: video.youtubeUrl,
      thumbnail: video.thumbnail || '',
      duration: video.duration || '',
      order: String(video.order ?? 0),
    });
    setEditingSeriesVideoId(video.id);
    setShowSeriesVideoForm(true);
  };

  const handleSubmitSeriesVideo = async (e) => {
    e.preventDefault();
    if (!token || !selectedSeries) {
      alert('Admin token is required. Please sign in again.');
      return;
    }

    const payload = {
      title: seriesVideoForm.title.trim(),
      description: seriesVideoForm.description.trim(),
      youtubeUrl: seriesVideoForm.youtubeUrl.trim(),
      thumbnail: seriesVideoForm.thumbnail.trim(),
      duration: seriesVideoForm.duration.trim(),
      order: Number(seriesVideoForm.order) || 0,
    };

    if (!payload.title || !payload.description || !payload.youtubeUrl) {
      alert('Title, description, and YouTube URL are required');
      return;
    }

    if (!payload.thumbnail) {
      payload.thumbnail = getYouTubeThumbnail(payload.youtubeUrl);
    }

    try {
      const path = editingSeriesVideoId
        ? `/tutorial-series/${selectedSeries.id}/videos/${editingSeriesVideoId}`
        : `/tutorial-series/${selectedSeries.id}/videos`;

      const method = editingSeriesVideoId ? 'PUT' : 'POST';

      const updatedSeries = await apiFetch(path, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      setSeriesList((prev) => prev.map((series) => (series.id === selectedSeries.id ? updatedSeries : series)));
      resetSeriesVideoForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteSeriesVideo = async (series, videoId) => {
    if (!window.confirm('Delete this video from the tutorial folder?')) {
      return;
    }

    try {
      const updatedSeries = await apiFetch(`/tutorial-series/${series.id}/videos/${videoId}`, {
        method: 'DELETE',
        headers,
      });
      setSeriesList((prev) => prev.map((entry) => (entry.id === series.id ? updatedSeries : entry)));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChange = (field, value) => {
    setSingleForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <Link to="/admin" className="back-link"><FiArrowLeft /> Back to Dashboard</Link>
          <h1>Video Manager</h1>
          <p>Create single videos or folder-based tutorial series with full CRUD metadata</p>
        </div>
        <div className="mode-actions">
          <button className={`admin-btn ${activeMode === 'single' ? 'primary' : 'secondary'}`} onClick={() => setActiveMode('single')}>
            <FiFilm /> Single Videos
          </button>
          <button className={`admin-btn ${activeMode === 'series' ? 'primary' : 'secondary'}`} onClick={() => setActiveMode('series')}>
            <FiFolder /> Tutorial Folders
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-section">
          <p>Loading videos...</p>
        </div>
      ) : error ? (
        <div className="admin-section">
          <div className="empty-state">
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <>
          {showSingleForm && (
            <div className="admin-modal-backdrop" onClick={resetSingleForm}>
              <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                <div className="admin-modal-header">
                  <h2>{editingSingleId ? 'Edit Video' : 'Add New Video'}</h2>
                  <button className="modal-close" onClick={resetSingleForm}><FiX /></button>
                </div>
                <form onSubmit={handleSubmitSingle} className="admin-form">
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      value={singleForm.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="e.g., How to Access IEEE Xplore"
                      required
                      id="video-title-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      value={singleForm.description}
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
                        type="text"
                        value={singleForm.youtubeUrl}
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
                        value={singleForm.category}
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
                        type="text"
                        value={singleForm.thumbnail}
                        onChange={(e) => handleChange('thumbnail', e.target.value)}
                        placeholder="Auto-generated from YouTube URL"
                        id="video-thumb-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Duration</label>
                      <input
                        type="text"
                        value={singleForm.duration}
                        onChange={(e) => handleChange('duration', e.target.value)}
                        placeholder="e.g., 10:30"
                        id="video-duration-input"
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="admin-btn secondary" onClick={resetSingleForm}>Cancel</button>
                    <button type="submit" className="admin-btn primary" id="save-video-btn">
                      <FiSave /> {editingSingleId ? 'Update Video' : 'Add Video'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showSeriesForm && (
            <div className="admin-modal-backdrop" onClick={resetSeriesForm}>
              <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                <div className="admin-modal-header">
                  <h2>{editingSeriesId ? 'Edit Tutorial Folder' : 'Add Tutorial Folder'}</h2>
                  <button className="modal-close" onClick={resetSeriesForm}><FiX /></button>
                </div>
                <form onSubmit={handleSubmitSeries} className="admin-form">
                  <div className="form-group">
                    <label>Folder Name *</label>
                    <input value={seriesForm.folderName} onChange={(e) => setSeriesForm((prev) => ({ ...prev, folderName: e.target.value }))} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Series Title *</label>
                      <input value={seriesForm.title} onChange={(e) => setSeriesForm((prev) => ({ ...prev, title: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label>Category *</label>
                      <input value={seriesForm.category} onChange={(e) => setSeriesForm((prev) => ({ ...prev, category: e.target.value }))} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea rows={3} value={seriesForm.description} onChange={(e) => setSeriesForm((prev) => ({ ...prev, description: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Cover Thumbnail URL</label>
                    <input value={seriesForm.coverThumbnail} onChange={(e) => setSeriesForm((prev) => ({ ...prev, coverThumbnail: e.target.value }))} />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="admin-btn secondary" onClick={resetSeriesForm}>Cancel</button>
                    <button type="submit" className="admin-btn primary"><FiSave /> {editingSeriesId ? 'Update Folder' : 'Create Folder'}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showSeriesVideoForm && (
            <div className="admin-modal-backdrop" onClick={resetSeriesVideoForm}>
              <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                <div className="admin-modal-header">
                  <h2>{editingSeriesVideoId ? 'Edit Folder Video' : `Add Video to ${selectedSeries?.folderName || ''}`}</h2>
                  <button className="modal-close" onClick={resetSeriesVideoForm}><FiX /></button>
                </div>
                <form onSubmit={handleSubmitSeriesVideo} className="admin-form">
                  <div className="form-group">
                    <label>Title *</label>
                    <input value={seriesVideoForm.title} onChange={(e) => setSeriesVideoForm((prev) => ({ ...prev, title: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea rows={3} value={seriesVideoForm.description} onChange={(e) => setSeriesVideoForm((prev) => ({ ...prev, description: e.target.value }))} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>YouTube URL *</label>
                      <input value={seriesVideoForm.youtubeUrl} onChange={(e) => setSeriesVideoForm((prev) => ({ ...prev, youtubeUrl: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label>Duration</label>
                      <input value={seriesVideoForm.duration} onChange={(e) => setSeriesVideoForm((prev) => ({ ...prev, duration: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Thumbnail URL</label>
                      <input value={seriesVideoForm.thumbnail} onChange={(e) => setSeriesVideoForm((prev) => ({ ...prev, thumbnail: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Order</label>
                      <input type="number" min="0" value={seriesVideoForm.order} onChange={(e) => setSeriesVideoForm((prev) => ({ ...prev, order: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="admin-btn secondary" onClick={resetSeriesVideoForm}>Cancel</button>
                    <button type="submit" className="admin-btn primary"><FiSave /> {editingSeriesVideoId ? 'Update Video' : 'Add Video'}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeMode === 'single' ? (
            <div className="admin-section">
              <div className="admin-section-toolbar">
                <h2>Single Tutorial Videos</h2>
                <button className="admin-btn primary" onClick={handleAddSingle} id="add-video-btn">
                  <FiPlus /> Add Video
                </button>
              </div>
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
                            <button className="action-btn edit" onClick={() => handleEditSingle(video)} title="Edit">
                              <FiEdit2 />
                            </button>
                            <button className="action-btn delete" onClick={() => handleDeleteSingle(video.id)} title="Delete">
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
                  <p>No single videos yet. Click "Add Video" to get started.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="admin-section">
              <div className="admin-section-toolbar">
                <h2>Tutorial Folders (Series)</h2>
                <button className="admin-btn primary" onClick={handleAddSeries}>
                  <FiPlus /> Add Folder
                </button>
              </div>

              <div className="series-admin-list">
                {seriesList.map((series) => (
                  <div className="series-admin-card" key={series.id}>
                    <div className="series-admin-header">
                      <div>
                        <h3>{series.folderName}</h3>
                        <p>{series.title} | {series.category} | {series.videos.length} videos</p>
                      </div>
                      <div className="table-actions">
                        <button className="action-btn edit" onClick={() => handleEditSeries(series)} title="Edit Folder"><FiEdit2 /></button>
                        <button className="action-btn delete" onClick={() => handleDeleteSeries(series.id)} title="Delete Folder"><FiTrash2 /></button>
                      </div>
                    </div>

                    <div className="series-inline-actions">
                      <button className="admin-btn secondary" onClick={() => openAddSeriesVideo(series)}><FiPlus /> Add Video to Folder</button>
                    </div>

                    <div className="admin-table-wrapper">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Video Title</th>
                            <th>Duration</th>
                            <th>Order</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(series.videos || []).map((video) => (
                            <tr key={video.id}>
                              <td className="table-title">{video.title}</td>
                              <td>{video.duration || '-'}</td>
                              <td>{video.order ?? 0}</td>
                              <td>
                                <div className="table-actions">
                                  <button className="action-btn edit" onClick={() => openEditSeriesVideo(series, video)} title="Edit Video"><FiEdit2 /></button>
                                  <button className="action-btn delete" onClick={() => handleDeleteSeriesVideo(series, video.id)} title="Delete Video"><FiTrash2 /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              {seriesList.length === 0 && (
                <div className="empty-state">
                  <p>No tutorial folders yet. Click "Add Folder" to create a series.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
