import { Play, MoreVertical } from "lucide-react";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  progress: number;
  duration: string;
}

interface RecentlyWatchedProps {
  videos: Video[];
  onVideoClick: (id: string) => void;
}

export const RecentlyWatched = ({ videos, onVideoClick }: RecentlyWatchedProps) => {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-card opacity-0 animate-fade-in stagger-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-card-foreground">Continue Watching</h3>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-3">
        {videos.map((video) => (
          <div 
            key={video.id}
            onClick={() => onVideoClick(video.id)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
          >
            <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                <div 
                  className="h-full bg-gradient-mint"
                  style={{ width: `${video.progress}%` }}
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground truncate">{video.title}</p>
              <p className="text-xs text-muted-foreground">{video.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
