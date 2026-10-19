import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFetch, authHeaders } from '../../api';
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiX, FiSave, FiLink, FiMinusCircle } from 'react-icons/fi';
import { FaYoutube } from 'react-icons/fa';
import './Admin.css';

const EMPTY_FORM = { particulars: '', url: '', videoUrl: '', description: '' };

export default function ResourceManager() {
  const { token } = useAuth();
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const headers = authHeaders(token);

  useEffect(() => {
    apiFetch('/resources')
      .then(setResources)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const closeForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const handleAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (resource) => {
    setForm({
      particulars: resource.particulars,
      url: resource.url || '',
      videoUrl: resource.videoUrl || '',
      description: resource.description || '',
    });
    setEditingId(resource.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this row?')) return;
    try {
      await apiFetch(`/resources/${id}`, { method: 'DELETE', headers });
      setResources((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Admin token is required. Please sign in again.');
      return;
    }
    if (!form.particulars.trim()) {
      alert('Particulars is required');
      return;
    }

    const payload = {
      particulars: form.particulars.trim(),
      url: form.url.trim(),
      videoUrl: form.videoUrl.trim(),
      description: form.description.trim(),
    };

    try {
      if (editingId) {
        const saved = await apiFetch(`/resources/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload),
        });
        setResources((prev) => prev.map((r) => (r.id === editingId ? saved : r)));
      } else {
        const saved = await apiFetch('/resources', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });
        setResources((prev) => [...prev, saved]);
      }
      closeForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="admin-page">
      <Link to="/admin" className="back-link"><FiArrowLeft /> Back to Dashboard</Link>

      <div className="admin-header">
        <div>
          <h1>Manage E-Resources</h1>
          <p>Add, edit or remove rows of the e-resources table</p>
        </div>
        <button className="admin-btn primary" onClick={handleAdd}>
          <FiPlus /> Add Row
        </button>
      </div>

      <div className="admin-section">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="empty-state"><p>{error}</p></div>
        ) : resources.length === 0 ? (
          <div className="empty-state"><p>No rows yet. Click "Add Row" to create one.</p></div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table resource-table">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Particulars</th>
                  <th>Link</th>
                  <th>Video</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((r, i) => (
                  <tr key={r.id}>
                    <td>{i + 1}</td>
                    <td className="table-title">{r.particulars}</td>
                    <td>{r.url ? <a href={r.url} target="_blank" rel="noopener noreferrer" title={r.url}><FiLink size={20} /></a> : <span className="cell-empty" title="Not added yet"><FiLink size={20} /></span>}</td>
                    <td>{r.videoUrl ? <a href={r.videoUrl} target="_blank" rel="noopener noreferrer" title={r.videoUrl} style={{ color: '#ff0000' }}><FaYoutube size={22} /></a> : <span className="cell-empty" title="Not added yet"><FaYoutube size={22} /></span>}</td>
                    <td>{r.description || <span className="cell-empty" title="Not added yet"><FiMinusCircle size={18} /></span>}</td>
                    <td>
                      <div className="table-actions">
                        <button className="action-btn edit" onClick={() => handleEdit(r)} title="Edit"><FiEdit2 /></button>
                        <button className="action-btn delete" onClick={() => handleDelete(r.id)} title="Delete"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="admin-modal-backdrop" onClick={closeForm}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingId ? 'Edit Row' : 'Add Row'}</h2>
              <button className="modal-close" onClick={closeForm}><FiX /></button>
            </div>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="res-particulars">Particulars *</label>
                <input id="res-particulars" value={form.particulars} onChange={setField('particulars')} required />
              </div>
              <div className="form-group">
                <label htmlFor="res-url">URL</label>
                <input id="res-url" type="url" value={form.url} onChange={setField('url')} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label htmlFor="res-video">Video YT URL</label>
                <input id="res-video" type="url" value={form.videoUrl} onChange={setField('videoUrl')} placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              <div className="form-group">
                <label htmlFor="res-desc">Description</label>
                <textarea id="res-desc" rows={4} value={form.description} onChange={setField('description')} />
              </div>
              <div className="form-actions">
                <button type="button" className="admin-btn secondary" onClick={closeForm}>Cancel</button>
                <button type="submit" className="admin-btn primary"><FiSave /> {editingId ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
