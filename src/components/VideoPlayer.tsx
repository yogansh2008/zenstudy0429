import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface VideoPlayerProps {
  videoId: string;
  onClose: () => void;
}

export const VideoPlayer = ({ videoId, onClose }: VideoPlayerProps) => {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes_${videoId}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [videoId]);

  const handleNotesChange = (value: string) => {
    setNotes(value);
    localStorage.setItem(`notes_${videoId}`, value);
  };

  return (
    <div
      className="fixed inset-0 bg-foreground/60 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card w-full max-w-[900px] rounded-3xl p-5 relative shadow-deep">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
        
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-[420px] rounded-2xl"
          allowFullScreen
          title="Video Player"
        />
        
        <div className="mt-4">
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Write notes here..."
            className="w-full h-32 rounded-xl p-4 bg-muted border-none outline-none resize-none text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
    </div>
  );
};
