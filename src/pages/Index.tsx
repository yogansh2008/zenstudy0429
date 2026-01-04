import { useState } from "react";
import { CheckCircle2, BookOpen, Clock, Flame, GraduationCap } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { SearchBox } from "@/components/SearchBox";
import { VideoCard } from "@/components/VideoCard";
import { VideoPlayer } from "@/components/VideoPlayer";
import { HabitTracker } from "@/components/HabitTracker";
import { StatsCard } from "@/components/StatsCard";
import { ProgressCard } from "@/components/ProgressCard";
import { QuickActions } from "@/components/QuickActions";
import { FeaturedCourse } from "@/components/FeaturedCourse";
import { RecentlyWatched } from "@/components/RecentlyWatched";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { LibraryContent } from "@/components/LibraryContent";
import { VideosContent } from "@/components/VideosContent";
import { NotesManager } from "@/components/NotesManager";
import { SettingsContent } from "@/components/SettingsContent";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
}

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

const recentVideos = [
  { id: "rfscVS0vtbw", title: "Learn Python - Full Course", thumbnail: "https://i.ytimg.com/vi/rfscVS0vtbw/mqdefault.jpg", progress: 65, duration: "4:26:52" },
  { id: "8hly31xKli0", title: "Algorithms Tutorial", thumbnail: "https://i.ytimg.com/vi/8hly31xKli0/mqdefault.jpg", progress: 30, duration: "5:22:00" },
  { id: "vLnPwxZdW4Y", title: "C++ Full Course", thumbnail: "https://i.ytimg.com/vi/vLnPwxZdW4Y/mqdefault.jpg", progress: 10, duration: "4:01:00" },
];

const videoTitles: Record<string, string> = {
  "rfscVS0vtbw": "Learn Python - Full Course for Beginners",
  "8hly31xKli0": "Algorithms and Data Structures Tutorial",
  "vLnPwxZdW4Y": "C++ Tutorial for Beginners - Full Course",
  "PkZNo7MFNFg": "JavaScript Tutorial for Beginners",
  "Oe421EPjeBE": "Node.js and Express.js - Full Course",
  "w7ejDZ8SWv8": "React JS Course for Beginners",
  "qz0aGYrrlhU": "HTML Tutorial for Beginners",
  "1Rs2ND1ryYc": "CSS Tutorial - Full Course",
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("library");
  const [videos, setVideos] = useState<Video[]>(sampleVideos);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [habitsOpen, setHabitsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showAllVideos, setShowAllVideos] = useState(false);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setShowAllVideos(true);
    setTimeout(() => {
      const filtered = sampleVideos.filter((v) =>
        v.title.toLowerCase().includes(query.toLowerCase())
      );
      setVideos(filtered.length > 0 ? filtered : sampleVideos);
      setIsSearching(false);
    }, 500);
  };

  const handleVideoClick = (id: string) => {
    setSelectedVideo(id);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "library":
        return <LibraryContent onVideoClick={handleVideoClick} />;
      case "videos":
        return <VideosContent onVideoClick={handleVideoClick} />;
      case "notes":
        return <NotesManager />;
      case "settings":
        return <SettingsContent />;
      default:
        return <LibraryContent onVideoClick={handleVideoClick} />;
    }
  };

  return (
    <div className="gradient-animated min-h-screen overflow-hidden">
      <div className="flex h-screen">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {/* Top Bar */}
          <div className="flex justify-between items-start mb-8">
            <WelcomeHeader userName="Student" />
            <button
              onClick={() => setHabitsOpen(!habitsOpen)}
              className="bg-card px-5 py-3 rounded-xl cursor-pointer shadow-card flex items-center gap-2 font-medium text-card-foreground hover:shadow-elevated transition-all hover:-translate-y-1"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Habits
            </button>
          </div>

          {/* Conditional Content Based on Active Tab */}
          {activeTab === "library" ? (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard 
                  icon={BookOpen} 
                  label="Courses Enrolled" 
                  value={12} 
                  subtext="+2 this week"
                  color="coral"
                  delay={100}
                />
                <StatsCard 
                  icon={Clock} 
                  label="Hours Learned" 
                  value="48.5" 
                  subtext="This month"
                  color="mint"
                  delay={200}
                />
                <StatsCard 
                  icon={Flame} 
                  label="Current Streak" 
                  value="7 days" 
                  subtext="Personal best: 14"
                  color="lavender"
                  delay={300}
                />
                <StatsCard 
                  icon={GraduationCap} 
                  label="Certificates" 
                  value={3} 
                  subtext="2 in progress"
                  color="coral"
                  delay={400}
                />
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <QuickActions />
              </div>

              {/* Search */}
              <div className="mb-8">
                <SearchBox onSearch={handleSearch} isLoading={isSearching} />
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Featured Course */}
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-bold text-foreground mb-4 opacity-0 animate-fade-in stagger-3">Featured Course</h2>
                  <FeaturedCourse
                    title="Complete Web Development Bootcamp"
                    instructor="Dr. Angela Yu"
                    thumbnail="https://i.ytimg.com/vi/PkZNo7MFNFg/maxresdefault.jpg"
                    rating={4.9}
                    duration="63 hours"
                    students="850K+"
                    onClick={() => handleVideoClick("PkZNo7MFNFg")}
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <ProgressCard 
                    streak={7}
                    todayMinutes={45}
                    weeklyGoal={10}
                    weeklyProgress={6.5}
                  />
                  <RecentlyWatched 
                    videos={recentVideos}
                    onVideoClick={handleVideoClick}
                  />
                </div>
              </div>

              {/* All Videos Section */}
              {showAllVideos && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">Search Results</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos.map((video, i) => (
                      <div key={video.id} className="opacity-0 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                        <VideoCard
                          {...video}
                          onClick={() => handleVideoClick(video.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Browse Courses */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground opacity-0 animate-fade-in stagger-5">Popular Courses</h2>
                  <button 
                    onClick={() => setShowAllVideos(true)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors opacity-0 animate-fade-in stagger-5"
                  >
                    View All →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sampleVideos.slice(0, 4).map((video, i) => (
                    <div key={video.id} className="opacity-0 animate-fade-in" style={{ animationDelay: `${(i + 5) * 100}ms` }}>
                      <VideoCard
                        {...video}
                        onClick={() => handleVideoClick(video.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            renderContent()
          )}
        </main>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          videoId={selectedVideo}
          videoTitle={videoTitles[selectedVideo] || "Video"}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Habit Tracker */}
      <HabitTracker isOpen={habitsOpen} onClose={() => setHabitsOpen(false)} />
    </div>
  );
};

export default Index;
