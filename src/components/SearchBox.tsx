import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBoxProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const SearchBox = ({ onSearch, isLoading }: SearchBoxProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="max-w-[650px] mx-auto bg-card p-4 rounded-2xl flex gap-3 shadow-elevated"
    >
      <div className="flex-1 flex items-center gap-3 px-2">
        <Search className="w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search: C++, Python, DSA..."
          className="flex-1 bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium transition-all hover:opacity-90 disabled:opacity-50"
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};
