import { useEffect } from 'react';
import { MdClose } from 'react-icons/md';

export default function VideoModal({ video, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!video) return null;

  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(video.youtubeUrl);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-academic-900/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl overflow-hidden w-full max-w-6xl shadow-ambient max-h-[90vh] flex flex-col md:flex-row relative animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur text-white rounded-full flex items-center justify-center transition-colors"
          onClick={onClose}
        >
          <MdClose size={24} />
        </button>
        
        <div className="w-full md:w-3/5 aspect-video bg-black shrink-0 relative flex items-center justify-center">
          {videoId ? (
            <iframe
              key={videoId}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={video.title}
              className="w-full h-full absolute inset-0"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-center p-6 text-white/70">
              <p>Video URL is not valid. <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-academic-300 hover:underline">Open in YouTube</a></p>
            </div>
          )}
        </div>
        
        <div className="w-full md:w-2/5 p-6 md:p-8 overflow-y-auto bg-white">
          <div className="inline-block bg-academic-100 text-academic-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
            {video.category}
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-academic-900 mb-4">{video.title}</h2>
          <p className="text-academic-600 leading-relaxed max-w-4xl">{video.description}</p>
        </div>
      </div>
    </div>
  );
}
