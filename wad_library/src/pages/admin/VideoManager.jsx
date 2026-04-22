import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFetch, authHeaders } from '../../api';
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiX, FiSave, FiFolder, FiFilm } from 'react-icons/fi';

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
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    try {
      await apiFetch(`/videos/${id}`, { method: 'DELETE', headers });
      setVideos((prev) => prev.filter((video) => video.id !== id));
    } catch (err) { alert(err.message); }
  };

  const handleSubmitSingle = async (e) => {
    e.preventDefault();
    if (!token) { alert('Admin token is required.'); return; }
    if (!singleForm.title.trim()) { alert('Title is required'); return; }
    if (!singleForm.description.trim()) { alert('Description is required'); return; }
    if (!singleForm.youtubeUrl.trim()) { alert('YouTube URL is required'); return; }
    if (!singleForm.category.trim()) { alert('Category is required'); return; }

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
          method: 'PUT', headers, body: JSON.stringify(videoPayload),
        });
        setVideos((prev) => prev.map((video) => (video.id === editingSingleId ? savedVideo : video)));
      } else {
        savedVideo = await apiFetch('/videos', {
          method: 'POST', headers, body: JSON.stringify(videoPayload),
        });
        setVideos((prev) => [savedVideo, ...prev]);
      }
      resetSingleForm();
    } catch (err) { alert(err.message); }
  };

  const handleAddSeries = () => { resetSeriesForm(); setShowSeriesForm(true); };
  const handleEditSeries = (series) => {
    setSeriesForm({
      title: series.title, description: series.description, category: series.category,
      folderName: series.folderName, coverThumbnail: series.coverThumbnail || '',
    });
    setEditingSeriesId(series.id);
    setShowSeriesForm(true);
  };

  const handleDeleteSeries = async (seriesId) => {
    if (!window.confirm('Delete this tutorial folder and all videos inside it?')) return;
    try {
      await apiFetch(`/tutorial-series/${seriesId}`, { method: 'DELETE', headers });
      setSeriesList((prev) => prev.filter((series) => series.id !== seriesId));
    } catch (err) { alert(err.message); }
  };

  const handleSubmitSeries = async (e) => {
    e.preventDefault();
    if (!token) { alert('Admin token is required.'); return; }
    const payload = {
      title: seriesForm.title.trim(), description: seriesForm.description.trim(),
      category: seriesForm.category.trim(), folderName: seriesForm.folderName.trim(), coverThumbnail: seriesForm.coverThumbnail.trim(),
    };
    if (!payload.title || !payload.description || !payload.category || !payload.folderName) {
      alert('Title, description, category, and folder name are required'); return;
    }
    try {
      let saved;
      if (editingSeriesId) {
        saved = await apiFetch(`/tutorial-series/${editingSeriesId}`, { method: 'PUT', headers, body: JSON.stringify(payload) });
        setSeriesList((prev) => prev.map((s) => (s.id === editingSeriesId ? saved : s)));
      } else {
        saved = await apiFetch('/tutorial-series', { method: 'POST', headers, body: JSON.stringify(payload) });
        setSeriesList((prev) => [saved, ...prev]);
      }
      resetSeriesForm();
    } catch (err) { alert(err.message); }
  };

  const openAddSeriesVideo = (series) => { resetSeriesVideoForm(); setSelectedSeries(series); setShowSeriesVideoForm(true); };
  const openEditSeriesVideo = (series, video) => {
    setSelectedSeries(series);
    setSeriesVideoForm({
      title: video.title, description: video.description, youtubeUrl: video.youtubeUrl,
      thumbnail: video.thumbnail || '', duration: video.duration || '', order: String(video.order ?? 0),
    });
    setEditingSeriesVideoId(video.id);
    setShowSeriesVideoForm(true);
  };

  const handleSubmitSeriesVideo = async (e) => {
    e.preventDefault();
    if (!token || !selectedSeries) { alert('Admin token required'); return; }
    const payload = {
      title: seriesVideoForm.title.trim(), description: seriesVideoForm.description.trim(),
      youtubeUrl: seriesVideoForm.youtubeUrl.trim(), thumbnail: seriesVideoForm.thumbnail.trim(),
      duration: seriesVideoForm.duration.trim(), order: Number(seriesVideoForm.order) || 0,
    };
    if (!payload.title || !payload.description || !payload.youtubeUrl) { alert('Required fields missing'); return; }
    if (!payload.thumbnail) payload.thumbnail = getYouTubeThumbnail(payload.youtubeUrl);

    try {
      const path = editingSeriesVideoId ? `/tutorial-series/${selectedSeries.id}/videos/${editingSeriesVideoId}` : `/tutorial-series/${selectedSeries.id}/videos`;
      const method = editingSeriesVideoId ? 'PUT' : 'POST';
      const updatedSeries = await apiFetch(path, { method, headers, body: JSON.stringify(payload) });
      setSeriesList((prev) => prev.map((s) => (s.id === selectedSeries.id ? updatedSeries : s)));
      resetSeriesVideoForm();
    } catch (err) { alert(err.message); }
  };

  const handleDeleteSeriesVideo = async (series, videoId) => {
    if (!window.confirm('Delete this video from the folder?')) return;
    try {
      const updatedSeries = await apiFetch(`/tutorial-series/${series.id}/videos/${videoId}`, { method: 'DELETE', headers });
      setSeriesList((prev) => prev.map((entry) => (entry.id === series.id ? updatedSeries : entry)));
    } catch (err) { alert(err.message); }
  };

  // Reusable input component helper
  const renderInput = (label, value, setter, required, placeholder = '', type="text") => (
    <div className="mb-4">
      <label className="block text-sm font-bold text-academic-900 mb-2">{label} {required && '*'}</label>
      {type === 'textarea' ? (
        <textarea className="w-full bg-academic-50 border border-academic-200 rounded-xl px-4 py-3 outline-none focus:border-academic-500" value={value} onChange={e => setter(e.target.value)} placeholder={placeholder} required={required} rows={3} />
      ) : (
        <input type={type} className="w-full bg-academic-50 border border-academic-200 rounded-xl px-4 py-3 outline-none focus:border-academic-500" value={value} onChange={e => setter(e.target.value)} placeholder={placeholder} required={required} />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-academic-50 pt-28 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-8">
          <Link to="/admin" className="inline-flex items-center gap-2 text-academic-500 hover:text-academic-900 font-bold mb-6 transition-colors">
            <FiArrowLeft /> Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-[2rem] p-8 shadow-ambient border border-academic-100">
            <div>
              <h1 className="font-display font-extrabold text-4xl text-academic-900 mb-2">Video Manager</h1>
              <p className="text-academic-500 font-medium tracking-wide">Manage Single Videos and Tutorial Folders from this panel.</p>
            </div>
            <div className="flex bg-academic-50 p-1.5 rounded-full mt-6 md:mt-0 border border-academic-100">
              <button 
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeMode === 'single' ? 'bg-white shadow text-academic-900' : 'text-academic-400 hover:text-academic-900'}`}
                onClick={() => setActiveMode('single')}
              ><FiFilm size={18}/> Single Videos</button>
              <button 
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeMode === 'series' ? 'bg-white shadow text-academic-900' : 'text-academic-400 hover:text-academic-900'}`}
                onClick={() => setActiveMode('series')}
              ><FiFolder size={18}/> Tutorial Folders</button>
            </div>
          </div>
        </div>

        {loading ? (
           <div className="bg-white rounded-[2rem] p-12 text-center shadow-ambient border border-academic-100 text-academic-500 font-bold">Loading...</div>
        ) : error ? (
           <div className="bg-red-50 text-red-800 rounded-[2rem] p-12 text-center border border-red-200 font-bold">{error}</div>
        ) : (
          <>
            {/* Modal Templates */}
            {showSingleForm && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-academic-900/40 backdrop-blur-sm" onClick={resetSingleForm}>
                <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-ambient overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="p-6 border-b border-academic-100 flex justify-between items-center bg-academic-50">
                    <h2 className="font-display font-bold text-2xl text-academic-900">{editingSingleId ? 'Edit Single Video' : 'Add Single Video'}</h2>
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-academic-500 hover:text-academic-900 shadow-sm" onClick={resetSingleForm}><FiX size={20}/></button>
                  </div>
                  <form onSubmit={handleSubmitSingle} className="p-8">
                    {renderInput('Title', singleForm.title, v => setSingleForm(p => ({...p, title: v})), true)}
                    {renderInput('Description', singleForm.description, v => setSingleForm(p => ({...p, description: v})), true, '', 'textarea')}
                    <div className="grid grid-cols-2 gap-4">
                      {renderInput('YouTube URL', singleForm.youtubeUrl, v => setSingleForm(p => ({...p, youtubeUrl: v})), true)}
                      {renderInput('Category', singleForm.category, v => setSingleForm(p => ({...p, category: v})), true)}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {renderInput('Thumbnail URL', singleForm.thumbnail, v => setSingleForm(p => ({...p, thumbnail: v})), false)}
                      {renderInput('Duration', singleForm.duration, v => setSingleForm(p => ({...p, duration: v})), false)}
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <button type="button" className="px-6 py-3 font-bold text-academic-500 hover:text-academic-900 bg-academic-50 hover:bg-academic-100 rounded-xl" onClick={resetSingleForm}>Cancel</button>
                      <button type="submit" className="px-6 py-3 font-bold text-white bg-academic-900 hover:bg-academic-800 rounded-xl flex items-center gap-2"><FiSave/> Save Video</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {showSeriesForm && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-academic-900/40 backdrop-blur-sm" onClick={resetSeriesForm}>
                <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-ambient overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="p-6 border-b border-academic-100 flex justify-between items-center bg-academic-50">
                    <h2 className="font-display font-bold text-2xl text-academic-900">{editingSeriesId ? 'Edit Tutorial Folder' : 'Create Tutorial Folder'}</h2>
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-academic-500 hover:text-academic-900 shadow-sm" onClick={resetSeriesForm}><FiX size={20}/></button>
                  </div>
                  <form onSubmit={handleSubmitSeries} className="p-8">
                    {renderInput('Folder Label', seriesForm.folderName, v => setSeriesForm(p => ({...p, folderName: v})), true)}
                    <div className="grid grid-cols-2 gap-4">
                      {renderInput('Series Title', seriesForm.title, v => setSeriesForm(p => ({...p, title: v})), true)}
                      {renderInput('Category', seriesForm.category, v => setSeriesForm(p => ({...p, category: v})), true)}
                    </div>
                    {renderInput('Description', seriesForm.description, v => setSeriesForm(p => ({...p, description: v})), true, '', 'textarea')}
                    {renderInput('Cover Thumbnail URL', seriesForm.coverThumbnail, v => setSeriesForm(p => ({...p, coverThumbnail: v})), false)}
                    <div className="flex justify-end gap-3 pt-4">
                      <button type="button" className="px-6 py-3 font-bold text-academic-500 hover:text-academic-900 bg-academic-50 hover:bg-academic-100 rounded-xl" onClick={resetSeriesForm}>Cancel</button>
                      <button type="submit" className="px-6 py-3 font-bold text-white bg-academic-900 hover:bg-academic-800 rounded-xl flex items-center gap-2"><FiSave/> Save Folder</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {showSeriesVideoForm && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-academic-900/40 backdrop-blur-sm" onClick={resetSeriesVideoForm}>
                <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-ambient overflow-hidden" onClick={e => e.stopPropagation()}>
                   <div className="p-6 border-b border-academic-100 flex justify-between items-center bg-academic-50">
                    <h2 className="font-display font-bold text-2xl text-academic-900">{editingSeriesVideoId ? 'Edit Video in Folder' : `Add Video to ${selectedSeries?.folderName}`}</h2>
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-academic-500 hover:text-academic-900 shadow-sm" onClick={resetSeriesVideoForm}><FiX size={20}/></button>
                  </div>
                  <form onSubmit={handleSubmitSeriesVideo} className="p-8">
                    {renderInput('Title', seriesVideoForm.title, v => setSeriesVideoForm(p => ({...p, title: v})), true)}
                    {renderInput('Description', seriesVideoForm.description, v => setSeriesVideoForm(p => ({...p, description: v})), true, '', 'textarea')}
                    <div className="grid grid-cols-2 gap-4">
                      {renderInput('YouTube URL', seriesVideoForm.youtubeUrl, v => setSeriesVideoForm(p => ({...p, youtubeUrl: v})), true)}
                      {renderInput('Duration', seriesVideoForm.duration, v => setSeriesVideoForm(p => ({...p, duration: v})), false)}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {renderInput('Thumbnail URL', seriesVideoForm.thumbnail, v => setSeriesVideoForm(p => ({...p, thumbnail: v})), false)}
                      {renderInput('Order Priority', seriesVideoForm.order, v => setSeriesVideoForm(p => ({...p, order: v})), false, '0', 'number')}
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <button type="button" className="px-6 py-3 font-bold text-academic-500 hover:text-academic-900 bg-academic-50 hover:bg-academic-100 rounded-xl" onClick={resetSeriesVideoForm}>Cancel</button>
                      <button type="submit" className="px-6 py-3 font-bold text-white bg-academic-900 hover:bg-academic-800 rounded-xl flex items-center gap-2"><FiSave/> Save Video</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Content Lists */}
            {activeMode === 'single' ? (
              <div className="bg-white rounded-[2rem] shadow-ambient border border-academic-100 overflow-hidden">
                <div className="p-8 border-b border-academic-100 flex justify-between items-center bg-academic-50/50">
                  <h2 className="font-display font-bold text-2xl text-academic-900">Single Videos</h2>
                  <button className="bg-academic-900 hover:bg-academic-800 text-white font-bold px-6 py-2.5 rounded-full transition-colors flex items-center gap-2" onClick={handleAddSingle}>
                    <FiPlus /> Add Single Video
                  </button>
                </div>
                
                {videos.length === 0 ? (
                  <div className="p-16 text-center text-academic-500 font-bold">No single videos yet. Click "Add Single Video".</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-academic-50/50">
                          <th className="p-6 font-bold text-xs uppercase tracking-widest text-academic-500">Thumbnail</th>
                          <th className="p-6 font-bold text-xs uppercase tracking-widest text-academic-500">Video Data</th>
                          <th className="p-6 font-bold text-xs uppercase tracking-widest text-academic-500 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {videos.map((video) => (
                          <tr key={video.id} className="border-b border-academic-100 hover:bg-academic-50 transition-colors">
                            <td className="p-6 w-32">
                              <img src={video.thumbnail} alt="" className="w-24 h-16 object-cover bg-academic-200 rounded-xl shadow-sm" />
                            </td>
                            <td className="p-6">
                              <h3 className="font-bold text-academic-900 text-lg mb-1">{video.title}</h3>
                              <p className="text-academic-500 text-sm mb-2">{video.duration} • Added {video.dateAdded}</p>
                              <span className="bg-academic-100 text-academic-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{video.category}</span>
                            </td>
                            <td className="p-6 text-right">
                              <button className="w-10 h-10 inline-flex items-center justify-center bg-white border border-academic-200 rounded-xl text-academic-500 hover:text-academic-900 shadow-sm mr-2" onClick={() => handleEditSingle(video)}><FiEdit2/></button>
                              <button className="w-10 h-10 inline-flex items-center justify-center bg-red-50 border border-red-100 rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-colors shadow-sm" onClick={() => handleDeleteSingle(video.id)}><FiTrash2/></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                 <div className="flex justify-end">
                    <button className="bg-academic-900 hover:bg-academic-800 text-white font-bold px-8 py-3 rounded-full transition-colors flex items-center gap-2 shadow-ambient" onClick={handleAddSeries}>
                      <FiPlus /> New Tutorial Folder
                    </button>
                 </div>
                 
                 {seriesList.length === 0 ? (
                   <div className="bg-white rounded-[2rem] p-16 text-center text-academic-500 border border-academic-100 font-bold shadow-ambient">No tutorial folders yet.</div>
                 ) : (
                   seriesList.map((series) => (
                     <div className="bg-white rounded-[2rem] shadow-ambient border border-academic-100 overflow-hidden" key={series.id}>
                        <div className="p-8 border-b border-academic-100 bg-academic-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div>
                            <span className="bg-academic-200 text-academic-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{series.category}</span>
                            <h2 className="font-display font-extrabold text-3xl text-academic-900 mt-3 mb-1">{series.folderName}</h2>
                            <p className="text-academic-500 font-medium">{series.title} • {series.videos?.length || 0} Videos</p>
                          </div>
                          <div className="flex gap-2">
                             <button className="bg-white hover:bg-academic-100 border border-academic-200 px-5 py-2.5 rounded-xl font-bold text-academic-600 text-sm flex items-center gap-2" onClick={() => openAddSeriesVideo(series)}><FiPlus/> Add Video</button>
                             <button className="w-10 h-10 inline-flex items-center justify-center bg-white border border-academic-200 rounded-xl text-academic-500 hover:text-academic-900 shadow-sm" onClick={() => handleEditSeries(series)}><FiEdit2/></button>
                             <button className="w-10 h-10 inline-flex items-center justify-center bg-red-50 border border-red-100 rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-colors shadow-sm" onClick={() => handleDeleteSeries(series.id)}><FiTrash2/></button>
                          </div>
                        </div>

                        {series.videos && series.videos.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left">
                              <tbody>
                                {series.videos.map((video) => (
                                  <tr key={video.id} className="border-b border-academic-50 last:border-none hover:bg-academic-50/50 transition-colors">
                                    <td className="p-6 pl-8">
                                      <div className="flex items-center gap-6">
                                        <div className="w-8 h-8 rounded-full bg-academic-100 text-academic-500 flex justify-center items-center font-bold text-xs shrink-0">{video.order ?? 0}</div>
                                        <div>
                                          <h4 className="font-bold text-academic-900">{video.title}</h4>
                                          <span className="text-academic-400 text-sm">{video.duration}</span>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-6 pr-8 text-right">
                                      <button className="w-8 h-8 inline-flex items-center justify-center bg-white border border-academic-200 rounded-lg text-academic-400 hover:text-academic-900 mr-2" onClick={() => openEditSeriesVideo(series, video)}><FiEdit2 size={14}/></button>
                                      <button className="w-8 h-8 inline-flex items-center justify-center bg-white border border-red-100 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600" onClick={() => handleDeleteSeriesVideo(series, video.id)}><FiTrash2 size={14}/></button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="p-8 text-center text-academic-400 text-sm italic">No videos in this folder.</div>
                        )}
                     </div>
                   ))
                 )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
