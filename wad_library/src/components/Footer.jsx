import { MdLocalLibrary, MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-academic-900 text-academic-300 pt-24 pb-12 mt-32 border-t-[16px] border-academic-500">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
        
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20">
              <MdLocalLibrary size={28} />
            </div>
            <span className="font-display font-black text-2xl text-white tracking-tighter uppercase">PICT Library</span>
          </div>
          <p className="text-academic-400 font-body leading-relaxed text-sm max-w-xs font-light">
            A premium academic aggregation layer providing direct access to masterclass methodologies and institutional archives.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-8">Quick Links</h4>
          <ul className="space-y-4 font-body text-sm font-medium">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/search" className="hover:text-white transition-colors">Search Papers</Link></li>
            <li><Link to="/videos" className="hover:text-white transition-colors">Video Tutorials</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Admin Log In</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-8">Providers</h4>
          <ul className="space-y-4 font-body text-sm font-medium">
            <li><a href="https://ieeexplore.ieee.org" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">IEEE Xplore</a></li>
            <li><a href="https://scholar.google.com" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Google Scholar</a></li>
            <li><a href="https://arxiv.org" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">arXiv</a></li>
            <li><a href="https://dl.acm.org" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">ACM Digital Library</a></li>
          </ul>
        </div>

        <div>
           <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-8">Contact Information</h4>
           <ul className="space-y-5 font-body text-sm font-medium">
             <li className="flex items-center gap-4 hover:text-white transition-colors cursor-pointer"><MdPhone size={20} className="shrink-0" /> <span>020 2437 1101</span></li>
             <li className="flex items-center gap-4 hover:text-white transition-colors cursor-pointer"><MdEmail size={20} className="shrink-0" /> <span>library@pict.edu</span></li>
             <li className="flex flex-start gap-4 hover:text-white transition-colors cursor-pointer"><MdLocationOn size={20} className="shrink-0 pt-0.5" /> <span>Survey No. 27, Dhankawadi, Pune, India</span></li>
           </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-academic-100/10 pt-12 flex flex-col md:flex-row justify-between items-center text-xs font-bold tracking-widest uppercase opacity-60">
        <p>&copy; 2026 PICT Library Subsystem. Strict Access Protocols.</p>
        <div className="flex items-center gap-6 mt-6 md:mt-0">
           <span className="hover:text-white transition-colors cursor-pointer">Privacy Protocol</span>
           <span className="hover:text-white transition-colors cursor-pointer">Usage Terms</span>
        </div>
      </div>
    </footer>
  );
}
