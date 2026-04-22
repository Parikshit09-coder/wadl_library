import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdMenu, MdClose, MdLogout, MdPerson, MdAdminPanelSettings, MdLocalLibrary } from 'react-icons/md';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-academic-200/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4" onClick={() => setMenuOpen(false)}>
          <div className="w-10 h-10 rounded-xl bg-academic-900 text-white flex items-center justify-center">
            <MdLocalLibrary size={24} />
          </div>
          <span className="font-display font-black text-xl text-academic-900 tracking-tighter uppercase">PICT Library</span>
        </Link>

        <button className="md:hidden text-academic-900 p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
        </button>

        <ul className={`${menuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:static top-20 left-0 w-full md:w-auto bg-white/95 backdrop-blur-xl md:bg-transparent shadow-ambient md:shadow-none p-8 md:p-0 gap-8 items-center text-academic-900 font-bold text-xs uppercase tracking-widest`}>
          <li><Link to="/" className="hover:text-academic-500 transition-colors" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/search" className="hover:text-academic-500 transition-colors" onClick={() => setMenuOpen(false)}>Search Papers</Link></li>
          <li><Link to="/videos" className="hover:text-academic-500 transition-colors" onClick={() => setMenuOpen(false)}>Tutorials</Link></li>
          {isAdmin && (
            <li><Link to="/admin" className="flex items-center gap-2 hover:text-academic-500 transition-colors" onClick={() => setMenuOpen(false)}><MdAdminPanelSettings size={18} /> Admin</Link></li>
          )}
          {user ? (
            <li className="flex items-center gap-4 flex-col md:flex-row mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-academic-100">
              <span className="flex items-center gap-2 text-academic-500"><MdPerson size={18} /> {user.name}</span>
              <button className="flex items-center gap-2 hover:text-red-800 transition-colors text-red-600" onClick={handleLogout}><MdLogout size={18} /> Logout</button>
            </li>
          ) : (
            <li className="mt-4 md:mt-0"><Link to="/login" className="bg-academic-50 text-academic-900 border border-academic-200 hover:border-academic-500 transition-colors px-6 py-3 rounded-full" onClick={() => setMenuOpen(false)}>Admin Log In</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}
