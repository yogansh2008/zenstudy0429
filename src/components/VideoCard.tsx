import { Play } from "lucide-react";

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
          className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg">
            <Play className="w-6 h-6 text-[#44403C] ml-1" fill="currentColor" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="font-semibold text-sm text-[#44403C] line-clamp-2 group-hover:text-[#78716C] transition-colors">
          {title}
        </p>
      </div>
    </div>
  );
};
