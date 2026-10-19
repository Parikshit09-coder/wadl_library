import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFetch, authHeaders } from '../../api';
import { FiPlus, FiTrash2, FiArrowLeft, FiX, FiSave, FiKey } from 'react-icons/fi';
import './Admin.css';

const EMPTY_FORM = { name: '', email: '', password: '' };

export default function AdminManager() {
  const { token, user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const headers = authHeaders(token);

  useEffect(() => {
    apiFetch('/auth/admins', { headers })
      .then(setAdmins)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeForm = () => {
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    try {
      const saved = await apiFetch('/auth/admins', {
        method: 'POST',
        headers,
        body: JSON.stringify(form),
      });
      setAdmins((prev) => [saved, ...prev]);
      closeForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemove = async (admin) => {
    if (!window.confirm(`Remove admin ${admin.email}? They will no longer be able to log in.`)) return;
    try {
      await apiFetch(`/auth/admins/${admin.id}`, { method: 'DELETE', headers });
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResetPassword = async (admin) => {
    const password = window.prompt(`New password for ${admin.email} (min 8 characters):`);
    if (!password) return;
    try {
      await apiFetch(`/auth/admins/${admin.id}/password`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ password }),
      });
      alert('Password updated');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="admin-page">
      <Link to="/admin" className="back-link"><FiArrowLeft /> Back to Dashboard</Link>

      <div className="admin-header">
        <div>
          <h1>Manage Admins</h1>
          <p>Add or remove people who can manage the library portal</p>
        </div>
        <button className="admin-btn primary" onClick={() => setShowForm(true)}>
          <FiPlus /> Add Admin
        </button>
      </div>

      <div className="admin-section">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="empty-state"><p>{error}</p></div>
        ) : admins.length === 0 ? (
          <div className="empty-state"><p>No admins stored in the database yet.</p></div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table resource-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a.id}>
                    <td className="table-title">{a.name}{a.id === user?.id && ' (you)'}</td>
                    <td>{a.email}</td>
                    <td>{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <div className="table-actions">
                        <button className="action-btn edit" onClick={() => handleResetPassword(a)} title="Reset password"><FiKey /></button>
                        {a.id !== user?.id && (
                          <button className="action-btn delete" onClick={() => handleRemove(a)} title="Remove admin"><FiTrash2 /></button>
                        )}
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
              <h2>Add Admin</h2>
              <button className="modal-close" onClick={closeForm}><FiX /></button>
            </div>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="adm-name">Full Name *</label>
                <input id="adm-name" value={form.name} onChange={setField('name')} required />
              </div>
              <div className="form-group">
                <label htmlFor="adm-email">Email *</label>
                <input id="adm-email" type="email" value={form.email} onChange={setField('email')} required />
              </div>
              <div className="form-group">
                <label htmlFor="adm-pass">Password * (min 8 characters)</label>
                <input id="adm-pass" type="password" value={form.password} onChange={setField('password')} minLength={8} required autoComplete="new-password" />
              </div>
              <div className="form-actions">
                <button type="button" className="admin-btn secondary" onClick={closeForm}>Cancel</button>
                <button type="submit" className="admin-btn primary"><FiSave /> Add Admin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
