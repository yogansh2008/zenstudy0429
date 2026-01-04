import { useState } from "react";
import { Video, Search, Filter, Grid, List, Play, Clock, Star } from "lucide-react";
import { VideoCard } from "./VideoCard";

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  category: string;
}

const allVideos: VideoItem[] = [
  {
    id: "rfscVS0vtbw",
    title: "Learn Python - Full Course for Beginners",
    thumbnail: "https://i.ytimg.com/vi/rfscVS0vtbw/mqdefault.jpg",
    duration: "4:26:52",
    views: "45M",
    category: "Python",
  },
  {
    id: "8hly31xKli0",
    title: "Algorithms and Data Structures Tutorial",
    thumbnail: "https://i.ytimg.com/vi/8hly31xKli0/mqdefault.jpg",
    duration: "5:22:00",
    views: "8M",
    category: "Algorithms",
  },
  {
    id: "vLnPwxZdW4Y",
    title: "C++ Tutorial for Beginners - Full Course",
    thumbnail: "https://i.ytimg.com/vi/vLnPwxZdW4Y/mqdefault.jpg",
    duration: "4:01:00",
    views: "12M",
    category: "C++",
  },
  {
    id: "PkZNo7MFNFg",
    title: "JavaScript Tutorial for Beginners",
    thumbnail: "https://i.ytimg.com/vi/PkZNo7MFNFg/mqdefault.jpg",
    duration: "3:26:42",
    views: "20M",
    category: "JavaScript",
  },
  {
    id: "Oe421EPjeBE",
    title: "Node.js and Express.js - Full Course",
    thumbnail: "https://i.ytimg.com/vi/Oe421EPjeBE/mqdefault.jpg",
    duration: "8:16:48",
    views: "5M",
    category: "Node.js",
  },
  {
    id: "w7ejDZ8SWv8",
    title: "React JS Course for Beginners",
    thumbnail: "https://i.ytimg.com/vi/w7ejDZ8SWv8/mqdefault.jpg",
    duration: "11:55:27",
    views: "3M",
    category: "React",
  },
  {
    id: "qz0aGYrrlhU",
    title: "HTML Tutorial for Beginners",
    thumbnail: "https://i.ytimg.com/vi/qz0aGYrrlhU/mqdefault.jpg",
    duration: "1:00:56",
    views: "15M",
    category: "HTML",
  },
  {
    id: "1Rs2ND1ryYc",
    title: "CSS Tutorial - Full Course",
    thumbnail: "https://i.ytimg.com/vi/1Rs2ND1ryYc/mqdefault.jpg",
    duration: "6:18:37",
    views: "7M",
    category: "CSS",
  },
];

const categories = ["All", "Python", "JavaScript", "React", "Node.js", "C++", "Algorithms", "HTML", "CSS"];

interface VideosContentProps {
  onVideoClick: (id: string) => void;
}

export const VideosContent = ({ onVideoClick }: VideosContentProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredVideos = allVideos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Video className="w-7 h-7 text-primary" />
          Browse Videos
        </h2>
        <span className="text-sm text-muted-foreground">{filteredVideos.length} videos</span>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border-none outline-none text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring shadow-card"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-3 rounded-xl transition-colors ${
              viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-3 rounded-xl transition-colors ${
              viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground shadow-card"
                : "bg-card text-foreground hover:bg-muted"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Videos Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video, i) => (
            <div
              key={video.id}
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <VideoCard
                id={video.id}
                title={video.title}
                thumbnail={video.thumbnail}
                onClick={() => onVideoClick(video.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredVideos.map((video, i) => (
            <div
              key={video.id}
              onClick={() => onVideoClick(video.id)}
              className="glass rounded-xl p-4 cursor-pointer card-hover opacity-0 animate-fade-in flex gap-4"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="relative w-40 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="w-8 h-8 text-white" fill="white" />
                </div>
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-foreground/80 text-white text-xs rounded">
                  {video.duration}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">{video.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {video.duration}
                  </span>
                  <span>{video.views} views</span>
                </div>
                <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg">
                  {video.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredVideos.length === 0 && (
        <div className="glass rounded-2xl p-8 text-center">
          <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No videos found matching your criteria</p>
        </div>
      )}
    </div>
  );
};
