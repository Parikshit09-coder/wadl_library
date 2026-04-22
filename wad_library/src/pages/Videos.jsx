import { useState, useEffect } from 'react';
import { MdVideoLibrary, MdPlayCircleFilled, MdInfo, MdKeyboardArrowDown, MdCheckCircle } from 'react-icons/md';
import { apiFetch } from '../api';
import VideoModal from '../components/VideoModal';

export default function Videos() {
  const [seriesList, setSeriesList] = useState([]);
  const [singleVideos, setSingleVideos] = useState([]);
  const [expandedFolder, setExpandedFolder] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [videosData, seriesData] = await Promise.all([
          apiFetch('/videos'),
          apiFetch('/tutorial-series'),
        ]);

        const singles = videosData.filter(v => v.category !== 'Series');
        setSingleVideos(singles);
        setSeriesList(seriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleFolder = (id) => {
    setExpandedFolder(expandedFolder === id ? null : id);
  };

  const getYoutubeId = (url) => {
    const match = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-academic-50 pt-32 pb-20 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-academic-200 border-t-academic-900 rounded-full animate-spin mb-8"></div>
        <p className="font-display font-bold text-2xl text-academic-900 animate-pulse">Loading Knowledge Base...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-academic-50 pt-32 pb-20 flex flex-col items-center justify-center text-center px-6">
        <div className="bg-red-50 text-red-900 p-8 rounded-3xl max-w-lg border border-red-100">
          <MdInfo size={40} className="mx-auto mb-4" />
          <h2 className="font-display font-bold text-2xl mb-2">System Interruption</h2>
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-academic-50 pt-20 pb-40">
      
      {/* Editorial Header */}
      <section className="pt-24 pb-20 px-6 max-w-4xl mx-auto text-center">
        <div className="w-20 h-20 bg-academic-100 text-academic-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-ambient">
           <MdVideoLibrary size={40} />
        </div>
        <h1 className="font-display font-black text-5xl md:text-7xl text-academic-900 mb-8 tracking-tight">
          Video <span className="text-academic-400 italic">Tutorials</span>
        </h1>
        <p className="font-body text-xl text-academic-500 font-light leading-relaxed max-w-2xl mx-auto">
          Step-by-step methodologies designed to guide you from foundational concepts to publication-ready research.
        </p>
      </section>

      {/* Tutorial Series Roadmap Section */}
      <section className="max-w-4xl mx-auto px-6 mb-32">
        <h2 className="font-display font-extrabold text-3xl text-academic-900 mb-12 flex items-center gap-4">
          <span className="w-10 h-[2px] bg-academic-300"></span> Guided Tracks
        </h2>

        <div className="space-y-10">
          {seriesList.map((series) => {
            const isExpanded = expandedFolder === series.id;
            const sortedVideos = [...(series.videos || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

            return (
              <div key={series.id} className="bg-white rounded-[2rem] p-4 md:p-8 shadow-[0_10px_40px_rgb(5,52,92,0.04)] border border-white hover:border-academic-100 transition-all duration-500">
                
                {/* Folder Header */}
                <div 
                  className="flex flex-col md:flex-row gap-8 items-start md:items-center cursor-pointer p-4 group"
                  onClick={() => toggleFolder(series.id)}
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-academic-50 rounded-[1.5rem] overflow-hidden shrink-0 relative border border-academic-100">
                    {series.coverThumbnail ? (
                       <img src={series.coverThumbnail} alt={series.title} className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                       <div className="w-full h-full flex flex-col justify-center items-center text-academic-300 gap-2">
                         <MdVideoLibrary size={32} />
                         <span className="text-xs font-bold uppercase tracking-widest">{sortedVideos.length} Videos</span>
                       </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-academic-400 font-semibold text-xs tracking-widest uppercase mb-2">{series.category}</p>
                    <h3 className="font-display font-extrabold text-3xl md:text-4xl text-academic-900 mb-4">{series.folderName}</h3>
                    <p className="text-academic-500 text-lg leading-relaxed">{series.description}</p>
                  </div>
                  
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${isExpanded ? 'bg-academic-900 text-white rotate-180' : 'bg-academic-50 text-academic-900 group-hover:bg-academic-200'}`}>
                     <MdKeyboardArrowDown size={32} />
                  </div>
                </div>

                {/* Editorial Roadmap UI */}
                {isExpanded && (
                  <div className="mt-12 pt-12 border-t border-academic-100 px-4 md:px-12 animate-in slide-in-from-top-4 duration-500">
                    {sortedVideos.length === 0 ? (
                      <p className="text-center text-academic-400 py-8 font-medium">This curriculum track is currently under development.</p>
                    ) : (
                      <div className="relative">
                        {/* The continuous vertical track strictly on the left */}
                        <div className="absolute left-[39px] top-6 bottom-16 w-1 bg-academic-100 rounded-full z-0 hidden md:block"></div>
                        
                        <div className="space-y-16">
                          {sortedVideos.map((video, index) => (
                            <div key={video.id} className="relative flex flex-col md:flex-row gap-10 md:gap-16 items-start group">
                              
                              {/* Sequence Node */}
                              <div className="hidden md:flex shrink-0 relative z-10 w-20 h-20 bg-white border-4 border-academic-50 rounded-2xl items-center justify-center shadow-sm group-hover:border-academic-200 transition-colors">
                                 <span className="font-display font-black text-2xl text-academic-900 opacity-60 group-hover:opacity-100 transition-opacity">
                                   {(index + 1).toString().padStart(2, '0')}
                                 </span>
                              </div>
                              
                              {/* Mobile Sequence Number */}
                              <div className="md:hidden font-display font-black text-4xl text-academic-200 absolute -top-4 right-0 z-0">
                                 {(index + 1).toString().padStart(2, '0')}
                              </div>

                              {/* Content Card */}
                              <div 
                                className="flex-1 bg-academic-50 hover:bg-white rounded-[2rem] p-6 flex flex-col md:flex-row gap-8 items-start cursor-pointer hover:shadow-ambient transition-all duration-300 border border-transparent hover:border-academic-100 relative z-10 w-full"
                                onClick={() => setSelectedVideo(video)}
                              >
                                <div className="w-full md:w-56 aspect-video bg-academic-200 rounded-[1.25rem] overflow-hidden relative shadow-inner">
                                   <div className="absolute inset-0 bg-academic-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                                   <img 
                                     src={video.thumbnail || `https://img.youtube.com/vi/${getYoutubeId(video.youtubeUrl)}/0.jpg`} 
                                     alt="" 
                                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                   />
                                   <div className="absolute bottom-3 right-3 bg-academic-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg z-20">
                                     {video.duration || '00:00'}
                                   </div>
                                </div>
                                
                                <div className="flex-1 pt-2">
                                  <h4 className="font-display font-bold text-2xl text-academic-900 mb-3 leading-tight group-hover:text-academic-600 transition-colors">{video.title}</h4>
                                  <p className="text-academic-500 leading-relaxed font-body text-base">{video.description}</p>
                                  
                                  <div className="mt-8 flex items-center gap-3 text-academic-900 font-bold text-sm uppercase tracking-widest opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    <MdPlayCircleFilled size={20} className="text-academic-500" /> Watch Video
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Standalone Videos Section */}
      {singleVideos.length > 0 && (
        <section className="max-w-7xl mx-auto px-6">
          <h2 className="font-display font-extrabold text-3xl text-academic-900 mb-12 flex items-center gap-4">
            <span className="w-10 h-[2px] bg-academic-300"></span> Tutorials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {singleVideos.map(video => (
              <div 
                key={video.id} 
                className="bg-white rounded-[2rem] p-6 hover:shadow-ambient cursor-pointer group transition-all duration-300 border border-transparent hover:border-academic-100"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="w-full aspect-video bg-academic-100 rounded-3xl overflow-hidden mb-8 relative">
                   <img 
                     src={video.thumbnail || `https://img.youtube.com/vi/${getYoutubeId(video.youtubeUrl)}/0.jpg`} 
                     alt="" 
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                   />
                   <div className="absolute inset-0 flex items-center justify-center bg-academic-900/20 opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-academic-900 shadow-xl scale-90 group-hover:scale-100 transition-transform">
                       <MdPlayCircleFilled size={32} />
                     </div>
                   </div>
                </div>
                <p className="text-xs font-bold tracking-widest uppercase text-academic-400 mb-3">{video.category}</p>
                <h3 className="font-display font-bold text-xl text-academic-900 mb-3 line-clamp-2">{video.title}</h3>
                <p className="text-academic-500 text-sm line-clamp-2 leading-relaxed">{video.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
}
