import { useState, useEffect } from "react";
import { FileText, Search, Trash2, Edit3, Save, X, Video } from "lucide-react";

interface Note {
  videoId: string;
  videoTitle: string;
  content: string;
  timestamp: string;
  updatedAt: string;
}

export const NotesManager = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    // Load all notes from localStorage
    const loadedNotes: Note[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("notes_")) {
        const videoId = key.replace("notes_", "");
        const content = localStorage.getItem(key) || "";
        const meta = localStorage.getItem(`notes_meta_${videoId}`);
        const parsedMeta = meta ? JSON.parse(meta) : {};
        if (content.trim()) {
          loadedNotes.push({
            videoId,
            videoTitle: parsedMeta.title || `Video ${videoId}`,
            content,
            timestamp: parsedMeta.timestamp || new Date().toISOString(),
            updatedAt: parsedMeta.updatedAt || new Date().toISOString(),
          });
        }
      }
    }
    setNotes(loadedNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  }, []);

  const filteredNotes = notes.filter(
    (note) =>
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.videoTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (videoId: string) => {
    localStorage.removeItem(`notes_${videoId}`);
    localStorage.removeItem(`notes_meta_${videoId}`);
    setNotes(notes.filter((n) => n.videoId !== videoId));
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.videoId);
    setEditContent(note.content);
  };

  const handleSave = (videoId: string) => {
    localStorage.setItem(`notes_${videoId}`, editContent);
    const meta = localStorage.getItem(`notes_meta_${videoId}`);
    const parsedMeta = meta ? JSON.parse(meta) : {};
    parsedMeta.updatedAt = new Date().toISOString();
    localStorage.setItem(`notes_meta_${videoId}`, JSON.stringify(parsedMeta));
    
    setNotes(notes.map((n) => 
      n.videoId === videoId 
        ? { ...n, content: editContent, updatedAt: parsedMeta.updatedAt }
        : n
    ));
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <FileText className="w-7 h-7 text-primary" />
          My Notes
        </h2>
        <span className="text-sm text-muted-foreground">{notes.length} notes</span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border-none outline-none text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring shadow-card"
        />
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              {searchQuery ? "No notes match your search" : "No notes yet. Start watching videos and take notes!"}
            </p>
          </div>
        ) : (
          filteredNotes.map((note, i) => (
            <div
              key={note.videoId}
              className="glass rounded-2xl p-5 opacity-0 animate-fade-in card-hover"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Video className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{note.videoTitle}</h3>
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {editingId === note.videoId ? (
                    <>
                      <button
                        onClick={() => handleSave(note.videoId)}
                        className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(note)}
                        className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(note.videoId)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {editingId === note.videoId ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-32 rounded-xl p-4 bg-muted border-none outline-none resize-none text-foreground focus:ring-2 focus:ring-ring"
                />
              ) : (
                <p className="text-muted-foreground text-sm whitespace-pre-wrap line-clamp-4">
                  {note.content}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
