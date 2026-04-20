import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiVideo, FiPlus, FiGrid, FiClock } from 'react-icons/fi';
import { apiFetch } from '../../api';

export default function Dashboard() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const data = await apiFetch('/videos');
        setVideos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const categories = [...new Set(videos.map((v) => v.category))];
  const recentVideos = [...videos].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)).slice(0, 5);

  return (
    <div className="min-h-screen bg-academic-50 pt-28 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-[2rem] p-8 mb-8 shadow-ambient border border-academic-100">
          <div>
            <h1 className="font-display font-extrabold text-4xl text-academic-900 mb-2">Admin Dashboard</h1>
            <p className="text-academic-500 font-medium">Welcome back, <span className="font-bold text-academic-900">{user?.name}</span></p>
          </div>
          <Link to="/admin/videos" className="mt-4 md:mt-0 flex items-center gap-2 bg-academic-900 hover:bg-academic-800 text-white font-bold px-6 py-3 rounded-full transition-colors">
            <FiPlus size={20} /> Manage Videos
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-[2rem] p-8 shadow-ambient border border-academic-100 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-academic-50 text-academic-500 flex items-center justify-center shrink-0">
              <FiVideo size={28} />
            </div>
            <div>
              <div className="font-display font-black text-4xl text-academic-900">{videos.length}</div>
              <div className="text-academic-500 font-bold text-sm tracking-widest uppercase mt-1">Total Videos</div>
            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-8 shadow-ambient border border-academic-100 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[#eff4ff] text-[#466089] flex items-center justify-center shrink-0">
              <FiGrid size={28} />
            </div>
            <div>
              <div className="font-display font-black text-4xl text-academic-900">{categories.length}</div>
              <div className="text-academic-500 font-bold text-sm tracking-widest uppercase mt-1">Categories</div>
            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-8 shadow-ambient border border-academic-100 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <FiClock size={28} />
            </div>
            <div>
              <div className="font-display font-black text-4xl text-academic-900">{recentVideos.length}</div>
              <div className="text-academic-500 font-bold text-sm tracking-widest uppercase mt-1">Recent Additions</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-[2rem] p-12 text-center shadow-ambient border border-academic-100 text-academic-500 font-bold">
            Loading dashboard data...
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-800 rounded-[2rem] p-12 text-center border border-red-200 font-bold">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Videos Table */}
            <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-ambient border border-academic-100 overflow-hidden">
              <div className="p-8 border-b border-academic-100">
                <h2 className="font-display font-bold text-2xl text-academic-900">Recently Added Videos</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-academic-50/50">
                      <th className="p-5 font-bold text-xs uppercase tracking-widest text-academic-500">Title</th>
                      <th className="p-5 font-bold text-xs uppercase tracking-widest text-academic-500">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentVideos.map((video) => (
                      <tr key={video.id} className="border-b border-academic-100 last:border-none hover:bg-academic-50 transition-colors">
                        <td className="p-5">
                           <p className="font-bold text-academic-900 line-clamp-1">{video.title}</p>
                           <p className="text-academic-500 text-sm mt-1">{video.duration} • Added {video.dateAdded}</p>
                        </td>
                        <td className="p-5">
                          <span className="bg-academic-100 text-academic-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            {video.category}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Categories Overview */}
            <div className="bg-white rounded-[2rem] p-8 shadow-ambient border border-academic-100">
              <h2 className="font-display font-bold text-2xl text-academic-900 mb-6">Categories Overview</h2>
              <div className="space-y-4">
                {categories.map((cat) => {
                  const count = videos.filter((v) => v.category === cat).length;
                  return (
                    <div className="flex items-center justify-between bg-academic-50 p-4 rounded-xl border border-academic-100" key={cat}>
                      <span className="font-bold text-academic-900">{cat}</span>
                      <span className="bg-white shadow-sm border border-academic-200 text-academic-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
