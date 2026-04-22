import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdEmail, MdLock, MdLogin, MdErrorOutline, MdSearch, MdVideoLibrary, MdAdminPanelSettings } from 'react-icons/md';

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
    <div className="min-h-screen bg-academic-50 flex">
      {/* Left side info */}
      <div className="hidden lg:flex flex-1 bg-academic-900 text-white relative overflow-hidden flex-col justify-center p-16">
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-academic-800 to-transparent rounded-full opacity-40 blur-[120px] z-0 pointer-events-none"></div>
        <div className="relative z-10 max-w-lg mx-auto">
          <h1 className="font-display font-extrabold text-5xl mb-6">Welcome to<br /><span className="text-academic-300">PICT Library</span></h1>
          <p className="text-academic-100 text-lg leading-relaxed mb-12">Access masterclass-level research papers from IEEE, Google Scholar, and arXiv. Elevate your academic foundation with carefully curated, step-by-step tutorial series.</p>
          
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20"><MdSearch size={24} className="text-academic-300" /></div>
              <div>
                <h4 className="font-display font-bold text-lg mb-1">Unified Search</h4>
                <p className="text-academic-200 text-sm">Query thousands of journals directly through one simple interface.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20"><MdVideoLibrary size={24} className="text-academic-300" /></div>
              <div>
                <h4 className="font-display font-bold text-lg mb-1">Guided Series</h4>
                <p className="text-academic-200 text-sm">Watch structured, step-by-step methodologies on advanced academic tooling.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20"><MdAdminPanelSettings size={24} className="text-academic-300" /></div>
              <div>
                <h4 className="font-display font-bold text-lg mb-1">Curator Panel</h4>
                <p className="text-academic-200 text-sm">Manage resources securely via the institutional access dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-16 relative">
        <div className="absolute top-6 left-6 lg:hidden">
          <Link to="/" className="text-academic-500 font-bold font-display hover:underline">← Home</Link>
        </div>
        
        <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-[2rem] shadow-ambient border border-academic-100">
          <div className="text-center mb-10">
            <h2 className="font-display font-extrabold text-3xl text-academic-900 mb-2">Admin Sign In</h2>
            <p className="text-academic-500">Authenticate to curate content</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100 text-sm font-medium">
              <MdErrorOutline size={20} className="shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-academic-900 mb-2">Institutional Email</label>
              <div className="relative">
                <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-academic-400" size={20} />
                <input
                  id="email"
                  type="email"
                  placeholder="admin@pict.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-academic-50 rounded-xl outline-none focus:ring-2 focus:ring-academic-300 border border-transparent focus:border-academic-300 transition-all text-academic-900 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-academic-900 mb-2">Passphrase</label>
              <div className="relative">
                <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-academic-400" size={20} />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-academic-50 rounded-xl outline-none focus:ring-2 focus:ring-academic-300 border border-transparent focus:border-academic-300 transition-all text-academic-900 font-medium"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-academic-900 hover:bg-academic-800 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 shadow-md disabled:bg-academic-400"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <><MdLogin size={20} /> Access Dashboard</>
              )}
            </button>
          </form>

          <div className="mt-8 text-center hidden lg:block">
            <Link to="/" className="text-academic-400 hover:text-academic-900 font-semibold text-sm transition-colors">← Return to Library</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
