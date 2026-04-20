import { MdPlayArrow, MdCalendarToday } from 'react-icons/md';

export default function VideoCard({ video, onClick }) {
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden cursor-pointer group hover:shadow-ambient transition-all duration-300"
      onClick={() => onClick?.(video)}
    >
      <div className="relative aspect-video overflow-hidden bg-academic-100">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          loading="lazy" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-academic-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-academic-500 shadow-lg scale-75 group-hover:scale-100 transition-transform duration-300">
            <MdPlayArrow size={32} />
          </div>
        </div>
        <div className="absolute bottom-3 right-3 bg-academic-900/80 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 rounded-md">
          {video.duration}
        </div>
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-academic-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          {video.category}
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-display font-bold text-lg text-academic-900 leading-snug mb-3 group-hover:text-academic-500 transition-colors line-clamp-2">
          {video.title}
        </h3>
        <p className="text-academic-600 text-sm line-clamp-2 mb-4 leading-relaxed">
          {video.description}
        </p>
        <div className="flex items-center gap-2 text-academic-400 text-xs font-medium">
          <MdCalendarToday size={14} />
          <span>Added {video.dateAdded}</span>
        </div>
      </div>
    </div>
  );
}
