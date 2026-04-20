import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiLogIn, FiAlertCircle } from 'react-icons/fi';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-content">
          <h1>Welcome to<br /><span className="highlight">PICT Library</span></h1>
          <p>Access research papers from IEEE, Google Scholar, and more. Watch tutorials to learn how to use institutional resources.</p>
          <div className="login-features">
            <div className="login-feature"><span className="feature-icon">🔍</span><span>Search across multiple platforms</span></div>
            <div className="login-feature"><span className="feature-icon">📹</span><span>Video tutorials for every platform</span></div>
            <div className="login-feature"><span className="feature-icon">📚</span><span>Secure admin access for video management</span></div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <div className="login-form-header">
            <h2>Admin Sign In</h2>
            <p>Enter admin credentials to manage tutorial videos</p>
          </div>

          {error && (
            <div className="login-error">
              <FiAlertCircle /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@institution.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-submit" disabled={loading} id="login-submit-btn">
              {loading ? (
                <span className="login-spinner"></span>
              ) : (
                <><FiLogIn /> Sign In</>
              )}
            </button>
          </form>

          <div className="login-footer">
            <Link to="/">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
