import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SearchResult {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  duration: string;
  views: string;
  publishedAt: string;
}

export type SortOption = "relevance" | "viewCount" | "date" | "rating";

interface UseVideoSearchReturn {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  searchVideos: (query: string, sortBy?: SortOption) => Promise<void>;
  clearResults: () => void;
}

export const useVideoSearch = (): UseVideoSearchReturn => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchVideos = useCallback(async (query: string, sortBy: SortOption = "relevance") => {
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      console.log(`Searching for: ${query}`);

      const { data, error: fnError } = await supabase.functions.invoke("search-videos", {
        body: { query: query.trim(), maxResults: 12, sortBy },
      });

      if (fnError) {
        console.error("Search function error:", fnError);
        throw new Error(fnError.message || "Failed to search videos");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data.videos || []);
      
      if (data.videos?.length === 0) {
        toast.info("No videos found for your search");
      } else {
        toast.success(`Found ${data.videos.length} videos`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to search videos";
      console.error("Search error:", err);
      setError(message);
      toast.error(message);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setHasSearched(false);
    setError(null);
  }, []);

  return {
    results,
    isLoading,
    error,
    hasSearched,
    searchVideos,
    clearResults,
  };
};
