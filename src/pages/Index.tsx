import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { SearchBox } from "@/components/SearchBox";
import { VideoCard } from "@/components/VideoCard";
import { VideoPlayer } from "@/components/VideoPlayer";
import { HabitsPanel } from "@/components/HabitsPanel";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
}

// Sample videos for demo (since YouTube API requires key)
const sampleVideos: Video[] = [
  {
    id: "rfscVS0vtbw",
    title: "Learn Python - Full Course for Beginners",
    thumbnail: "https://i.ytimg.com/vi/rfscVS0vtbw/mqdefault.jpg",
  },
  {
    id: "8hly31xKli0",
    title: "Algorithms and Data Structures Tutorial",
    thumbnail: "https://i.ytimg.com/vi/8hly31xKli0/mqdefault.jpg",
  },
  {
    id: "vLnPwxZdW4Y",
    title: "C++ Tutorial for Beginners - Full Course",
    thumbnail: "https://i.ytimg.com/vi/vLnPwxZdW4Y/mqdefault.jpg",
  },
  {
    id: "PkZNo7MFNFg",
    title: "JavaScript Tutorial for Beginners",
    thumbnail: "https://i.ytimg.com/vi/PkZNo7MFNFg/mqdefault.jpg",
  },
  {
    id: "Oe421EPjeBE",
    title: "Node.js and Express.js - Full Course",
    thumbnail: "https://i.ytimg.com/vi/Oe421EPjeBE/mqdefault.jpg",
  },
  {
    id: "w7ejDZ8SWv8",
    title: "React JS Course for Beginners",
    thumbnail: "https://i.ytimg.com/vi/w7ejDZ8SWv8/mqdefault.jpg",
  },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("videos");
  const [videos, setVideos] = useState<Video[]>(sampleVideos);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [habitsOpen, setHabitsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      const filtered = sampleVideos.filter((v) =>
        v.title.toLowerCase().includes(query.toLowerCase())
      );
      setVideos(filtered.length > 0 ? filtered : sampleVideos);
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="gradient-animated min-h-screen overflow-hidden">
      <div className="flex h-screen">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 p-8 overflow-y-auto">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-extrabold text-foreground">
              ZenStudy
            </h1>
            <button
              onClick={() => setHabitsOpen(!habitsOpen)}
              className="bg-card px-5 py-3 rounded-xl cursor-pointer shadow-card flex items-center gap-2 font-medium text-card-foreground hover:shadow-elevated transition-shadow"
            >
              <CheckCircle2 className="w-5 h-5 text-gradient-mint" />
              Habits
            </button>
          </div>

          {/* Search */}
          <div className="mb-10">
            <SearchBox onSearch={handleSearch} isLoading={isSearching} />
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                {...video}
                onClick={() => setSelectedVideo(video.id)}
              />
            ))}
          </div>

          {videos.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">
                No videos found. Try a different search term.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          videoId={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Habits Panel */}
      <HabitsPanel isOpen={habitsOpen} onClose={() => setHabitsOpen(false)} />
    </div>
  );
};

export default Index;
