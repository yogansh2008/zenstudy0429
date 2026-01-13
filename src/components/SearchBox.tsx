import { Search, X, Loader2, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBoxProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  initialQuery?: string;
  onClear?: () => void;
}

export const SearchBox = ({ onSearch, isLoading, initialQuery = "", onClear }: SearchBoxProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
    onClear?.();
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`
        max-w-[700px] mx-auto p-5 rounded-3xl flex gap-4 
        transition-all duration-400 relative overflow-hidden
        ${isFocused 
          ? "bg-white shadow-deep scale-[1.02]" 
          : "bg-white/80 backdrop-blur-xl shadow-elevated hover:shadow-deep hover:bg-white"
        }
      `}
    >
      {/* Animated gradient border on focus */}
      {isFocused && (
        <div className="absolute inset-0 rounded-3xl p-[2px] -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF9AA2] via-[#B5EAD7] to-[#C7CEEA] rounded-3xl opacity-30 animate-pulse" />
        </div>
      )}
      
      <div className="flex-1 flex items-center gap-4 px-3">
        <div className={`
          w-10 h-10 rounded-xl flex items-center justify-center transition-all
          ${isFocused 
            ? "bg-gradient-to-br from-[#C7CEEA] to-[#B5EAD7]" 
            : "bg-[#C7CEEA]/20"
          }
        `}>
          <Search className={`w-5 h-5 transition-colors ${isFocused ? "text-white" : "text-[#78716C]"}`} />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search Python, JavaScript, Data Structures..."
          className="flex-1 bg-transparent border-none outline-none text-lg text-[#44403C] placeholder:text-[#A8A29E] font-medium"
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 rounded-xl hover:bg-[#FF9AA2]/10 transition-colors group"
          >
            <X className="w-4 h-4 text-[#A8A29E] group-hover:text-[#FF9AA2]" />
          </button>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        className="zen-primary-btn text-white px-7 py-3.5 rounded-2xl font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2.5 min-w-[130px] justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Searching</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Search</span>
          </>
        )}
      </button>
    </form>
  );
};
