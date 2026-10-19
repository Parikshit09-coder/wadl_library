import { useEffect } from 'react';
import { MdClose } from 'react-icons/md';
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

  const videoId = getYouTubeId(video.videoUrl);

  return (
    <div className="video-modal-backdrop" onClick={onClose}>
      <div className="video-modal" onClick={(e) => e.stopPropagation()}>
        <button className="video-modal-close" onClick={onClose} aria-label="Close"><MdClose /></button>
        <div className="video-modal-player">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={video.particulars}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="video-modal-fallback">
              <p>Video URL is not valid. <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">Open in YouTube</a></p>
            </div>
          )}
        </div>
        <div className="video-modal-info">
          <h2>{video.particulars}</h2>
          {video.description && <p>{video.description}</p>}
        </div>
      </div>
    </div>
  );
}
