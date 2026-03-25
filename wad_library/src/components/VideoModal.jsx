import { useEffect } from 'react';
import './VideoModal.css';

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

  // Extract YouTube video ID
  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(video.youtubeUrl);

  return (
    <div className="video-modal-backdrop" onClick={onClose}>
      <div className="video-modal" onClick={(e) => e.stopPropagation()}>
        <button className="video-modal-close" onClick={onClose}>✕</button>
        <div className="video-modal-player">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="video-modal-fallback">
              <p>Video URL is not valid. <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">Open in YouTube</a></p>
            </div>
          )}
        </div>
        <div className="video-modal-info">
          <span className="video-modal-category">{video.category}</span>
          <h2>{video.title}</h2>
          <p>{video.description}</p>
        </div>
      </div>
    </div>
  );
}
