import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface YouTubeSearchResult {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  duration: string;
  views: string;
  publishedAt: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, maxResults = 12, sortBy = 'relevance' } = await req.json();

    if (!query || typeof query !== 'string') {
      console.error('Invalid or missing query parameter');
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('YOUTUBE_API_KEY');
    
    if (!apiKey) {
      console.error('YouTube API key not configured');
      return new Response(
        JSON.stringify({ error: 'YouTube API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Searching YouTube for: "${query}" with maxResults: ${maxResults}, sortBy: ${sortBy}`);

    // Map sortBy to YouTube API order parameter
    const orderMap: Record<string, string> = {
      relevance: 'relevance',
      viewCount: 'viewCount',
      date: 'date',
      rating: 'rating',
    };
    const order = orderMap[sortBy] || 'relevance';

    // Search for videos
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('q', `${query} tutorial educational`);
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('maxResults', String(maxResults));
    searchUrl.searchParams.set('order', order);
    searchUrl.searchParams.set('videoDuration', 'medium'); // Filter for medium-length videos (4-20 min)
    searchUrl.searchParams.set('safeSearch', 'strict');
    searchUrl.searchParams.set('relevanceLanguage', 'en');
    searchUrl.searchParams.set('key', apiKey);

    const searchResponse = await fetch(searchUrl.toString());
    
    if (!searchResponse.ok) {
      const errorData = await searchResponse.json();
      console.error('YouTube API search error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to search videos', details: errorData }),
        { status: searchResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const searchData = await searchResponse.json();
    console.log(`Found ${searchData.items?.length || 0} videos`);

    if (!searchData.items || searchData.items.length === 0) {
      return new Response(
        JSON.stringify({ videos: [], message: 'No videos found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get video IDs for fetching additional details (duration, view count)
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    
    const detailsUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    detailsUrl.searchParams.set('part', 'contentDetails,statistics');
    detailsUrl.searchParams.set('id', videoIds);
    detailsUrl.searchParams.set('key', apiKey);

    const detailsResponse = await fetch(detailsUrl.toString());
    const detailsData = await detailsResponse.json();

    // Create a map of video details
    const detailsMap = new Map();
    if (detailsData.items) {
      detailsData.items.forEach((item: any) => {
        detailsMap.set(item.id, {
          duration: parseDuration(item.contentDetails?.duration || ''),
          views: formatViews(item.statistics?.viewCount || '0'),
        });
      });
    }

    // Combine search results with details
    const videos: YouTubeSearchResult[] = searchData.items.map((item: any) => {
      const details = detailsMap.get(item.id.videoId) || { duration: '', views: '0' };
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
        channelName: item.snippet.channelTitle,
        duration: details.duration,
        views: details.views,
        publishedAt: item.snippet.publishedAt,
      };
    });

    console.log(`Returning ${videos.length} videos with details`);

    return new Response(
      JSON.stringify({ videos }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in search-videos function:', errorMessage);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to parse ISO 8601 duration to readable format
function parseDuration(isoDuration: string): string {
  if (!isoDuration) return '';
  
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Helper function to format view count
function formatViews(views: string): string {
  const num = parseInt(views);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return views;
}
