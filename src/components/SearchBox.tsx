import { Search, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBoxProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  initialQuery?: string;
  onClear?: () => void;
}

export const SearchBox = ({ onSearch, isLoading, initialQuery = "", onClear }: SearchBoxProps) => {
  const [query, setQuery] = useState(initialQuery);

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
      className="max-w-[700px] mx-auto bg-card p-4 rounded-2xl flex gap-3 shadow-elevated"
    >
      <div className="flex-1 flex items-center gap-3 px-2">
        <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search videos: Python, Data Structures, JavaScript..."
          className="flex-1 bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Searching...
          </>
        ) : (
          "Search"
        )}
      </button>
    </form>
  );
};
