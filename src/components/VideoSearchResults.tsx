import { useState } from "react";
import { Video, Play, Clock, Eye, User, Grid, List, Filter, X, Loader2 } from "lucide-react";
import type { SearchResult, SortOption } from "@/hooks/useVideoSearch";

interface VideoSearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  onVideoClick: (id: string, title: string) => void;
  onClear: () => void;
  searchQuery: string;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Most Relevant" },
  { value: "viewCount", label: "Most Viewed" },
  { value: "date", label: "Most Recent" },
  { value: "rating", label: "Top Rated" },
];

export const VideoSearchResults = ({
  results,
  isLoading,
  error,
  hasSearched,
  onVideoClick,
  onClear,
  searchQuery,
}: VideoSearchResultsProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (!hasSearched) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Video className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Search Results for "{searchQuery}"
          </h2>
          <span className="text-sm text-muted-foreground">
            {results.length} videos found
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-muted"
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-muted"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={onClear}
            className="p-2 rounded-lg bg-card text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
            title="Clear search results"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground">Searching for videos...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
          <p className="text-destructive font-medium">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please try again or check your search query.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && results.length === 0 && (
        <div className="bg-card rounded-2xl p-12 text-center shadow-card">
          <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No videos found</h3>
          <p className="text-muted-foreground">
            Try searching with different keywords or check your spelling.
          </p>
        </div>
      )}

      {/* Results Grid */}
      {!isLoading && !error && results.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((video, i) => (
            <div
              key={video.id}
              onClick={() => onVideoClick(video.id, video.title)}
              className="bg-card rounded-xl overflow-hidden cursor-pointer shadow-card hover:shadow-elevated transition-all hover:-translate-y-1 group opacity-0 animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-12 h-12 text-white" fill="white" />
                </div>
                {video.duration && (
                  <span className="absolute bottom-2 right-2 px-2 py-1 bg-foreground/80 text-white text-xs font-medium rounded">
                    {video.duration}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <User className="w-3 h-3" />
                  <span className="truncate">{video.channelName}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {video.views && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {video.views} views
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results List */}
      {!isLoading && !error && results.length > 0 && viewMode === "list" && (
        <div className="space-y-3">
          {results.map((video, i) => (
            <div
              key={video.id}
              onClick={() => onVideoClick(video.id, video.title)}
              className="bg-card rounded-xl p-4 cursor-pointer shadow-card hover:shadow-elevated transition-all flex gap-4 group opacity-0 animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="relative w-48 h-28 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-8 h-8 text-white" fill="white" />
                </div>
                {video.duration && (
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-foreground/80 text-white text-xs rounded">
                    {video.duration}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <User className="w-4 h-4" />
                  <span>{video.channelName}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {video.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {video.duration}
                    </span>
                  )}
                  {video.views && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {video.views} views
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
