import { X, Save, Clock, FileText, Plus, Trash2, BookmarkPlus } from "lucide-react";
import { useEffect, useState } from "react";

interface VideoPlayerProps {
  videoId: string;
  videoTitle?: string;
  onClose: () => void;
}

interface NoteEntry {
  id: string;
  timestamp: string;
  content: string;
  createdAt: string;
}

export const VideoPlayer = ({ videoId, videoTitle = "Video", onClose }: VideoPlayerProps) => {
  const [notes, setNotes] = useState<NoteEntry[]>([]);
  const [currentNote, setCurrentNote] = useState("");
  const [currentTimestamp, setCurrentTimestamp] = useState("00:00");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes_${videoId}`);
    const savedMeta = localStorage.getItem(`notes_meta_${videoId}`);
    
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);
        if (Array.isArray(parsed)) {
          setNotes(parsed);
        } else {
          // Convert old format to new
          setNotes([{ id: "1", timestamp: "00:00", content: savedNotes, createdAt: new Date().toISOString() }]);
        }
      } catch {
        // Old string format
        if (savedNotes.trim()) {
          setNotes([{ id: "1", timestamp: "00:00", content: savedNotes, createdAt: new Date().toISOString() }]);
        }
      }
    }
    
    // Save video title to meta
    const meta = savedMeta ? JSON.parse(savedMeta) : {};
    meta.title = videoTitle;
    localStorage.setItem(`notes_meta_${videoId}`, JSON.stringify(meta));
  }, [videoId, videoTitle]);

  const saveNotes = (newNotes: NoteEntry[]) => {
    localStorage.setItem(`notes_${videoId}`, JSON.stringify(newNotes));
    const meta = JSON.parse(localStorage.getItem(`notes_meta_${videoId}`) || "{}");
    meta.updatedAt = new Date().toISOString();
    meta.title = videoTitle;
    localStorage.setItem(`notes_meta_${videoId}`, JSON.stringify(meta));
  };

  const handleAddNote = () => {
    if (!currentNote.trim()) return;
    
    const newNote: NoteEntry = {
      id: Date.now().toString(),
      timestamp: currentTimestamp,
      content: currentNote,
      createdAt: new Date().toISOString(),
    };
    
    const newNotes = [...notes, newNote];
    setNotes(newNotes);
    saveNotes(newNotes);
    setCurrentNote("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteNote = (id: string) => {
    const newNotes = notes.filter((n) => n.id !== id);
    setNotes(newNotes);
    saveNotes(newNotes);
  };

  return (
    <div
      className="fixed inset-0 bg-foreground/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card w-full max-w-[1100px] max-h-[90vh] rounded-3xl p-6 relative shadow-deep overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground truncate pr-12">{videoTitle}</h3>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
          {/* Video Section */}
          <div className="lg:w-2/3">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-[300px] lg:h-[400px] rounded-2xl"
              allowFullScreen
              title="Video Player"
            />
          </div>

          {/* Notes Section */}
          <div className="lg:w-1/3 flex flex-col bg-muted/50 rounded-2xl p-4 max-h-[400px]">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">Notes</h4>
              <span className="text-xs text-muted-foreground ml-auto">{notes.length} notes</span>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 custom-scrollbar">
              {notes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <BookmarkPlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notes yet. Add your first note below!</p>
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="bg-card rounded-xl p-3 group">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs text-primary font-medium">
                        <Clock className="w-3 h-3" />
                        {note.timestamp}
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-sm text-foreground mt-1">{note.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Note Form */}
            <div className="border-t border-border/50 pt-4">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-xs text-muted-foreground">Timestamp:</label>
                <input
                  type="text"
                  value={currentTimestamp}
                  onChange={(e) => setCurrentTimestamp(e.target.value)}
                  placeholder="00:00"
                  className="w-16 px-2 py-1 text-xs rounded-lg bg-card text-foreground border-none outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Add a note at this timestamp..."
                className="w-full h-20 rounded-xl p-3 bg-card border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    handleAddNote();
                  }
                }}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">Ctrl + Enter to save</span>
                <button
                  onClick={handleAddNote}
                  disabled={!currentNote.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saved ? (
                    <>
                      <Save className="w-4 h-4" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add Note
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
