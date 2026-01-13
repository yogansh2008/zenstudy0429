import { Play, Clock } from "lucide-react";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  onClick: () => void;
}

export const VideoCard = ({ title, thumbnail, onClick }: VideoCardProps) => {
  return (
    <div
      onClick={onClick}
      className="glass-card overflow-hidden cursor-pointer group"
    >
      <div className="relative overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white/95 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#44403C] to-[#292524] flex items-center justify-center">
              <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
            </div>
          </div>
        </div>
        
        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Clock className="w-3 h-3 text-white" />
          <span className="text-xs text-white font-medium">4:26:52</span>
        </div>
      </div>
      
      <div className="p-4">
        <p className="font-bold text-sm text-[#44403C] line-clamp-2 group-hover:text-[#78716C] transition-colors leading-relaxed">
          {title}
        </p>
        <p className="text-xs text-[#A8A29E] mt-2 font-medium">Click to watch</p>
      </div>
    </div>
  );
};
