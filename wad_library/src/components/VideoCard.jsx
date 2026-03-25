import './VideoCard.css';

export default function VideoCard({ video, onClick }) {
  return (
    <div className="video-card" onClick={() => onClick?.(video)}>
      <div className="video-card-thumb">
        <img src={video.thumbnail} alt={video.title} loading="lazy" />
        <div className="video-card-overlay">
          <div className="play-icon">▶</div>
        </div>
        <span className="video-duration">{video.duration}</span>
        <span className="video-category-badge">{video.category}</span>
      </div>
      <div className="video-card-info">
        <h3 className="video-card-title">{video.title}</h3>
        <p className="video-card-desc">{video.description}</p>
        <span className="video-card-date">Added: {video.dateAdded}</span>
      </div>
    </div>
  );
}
