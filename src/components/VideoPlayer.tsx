import { X, Save, Clock, FileText, Plus, Trash2, BookmarkPlus, Sparkles, Loader2, Wand2, ListChecks, FileUp, Download, Edit3, GitBranch } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FlowchartPanel } from "./FlowchartPanel";
import { FocusMode } from "./FocusMode";

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
  isAI?: boolean;
}

export const VideoPlayer = ({ videoId, videoTitle = "Video", onClose }: VideoPlayerProps) => {
  const [notes, setNotes] = useState<NoteEntry[]>([]);
  const [currentNote, setCurrentNote] = useState("");
  const [currentTimestamp, setCurrentTimestamp] = useState("00:00");
  const [saved, setSaved] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiAction, setAiAction] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isVideoPlaying, setIsVideoPlaying] = useState(true); // Assume playing when opened
  
  // Flowchart state
  const [showFlowchart, setShowFlowchart] = useState(false);
  const [flowchartCode, setFlowchartCode] = useState("");
  const [isFlowchartLoading, setIsFlowchartLoading] = useState(false);
  const [flowchartCollapsed, setFlowchartCollapsed] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes_${videoId}`);
    const savedMeta = localStorage.getItem(`notes_meta_${videoId}`);
    
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);
        if (Array.isArray(parsed)) {
          setNotes(parsed);
        } else {
          setNotes([{ id: "1", timestamp: "00:00", content: savedNotes, createdAt: new Date().toISOString() }]);
        }
      } catch {
        if (savedNotes.trim()) {
          setNotes([{ id: "1", timestamp: "00:00", content: savedNotes, createdAt: new Date().toISOString() }]);
        }
      }
    }
    
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

  const handleAddNote = (content?: string, isAI?: boolean) => {
    const noteContent = content || currentNote;
    if (!noteContent.trim()) return;
    
    const newNote: NoteEntry = {
      id: Date.now().toString(),
      timestamp: currentTimestamp,
      content: noteContent,
      createdAt: new Date().toISOString(),
      isAI,
    };
    
    const newNotes = [...notes, newNote];
    setNotes(newNotes);
    saveNotes(newNotes);
    if (!content) setCurrentNote("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteNote = (id: string) => {
    const newNotes = notes.filter((n) => n.id !== id);
    setNotes(newNotes);
    saveNotes(newNotes);
  };

  const handleEditNote = (note: NoteEntry) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = (id: string) => {
    const newNotes = notes.map((n) =>
      n.id === id ? { ...n, content: editContent } : n
    );
    setNotes(newNotes);
    saveNotes(newNotes);
    setEditingNoteId(null);
    setEditContent("");
    toast({ title: "Note Updated!", description: "Your changes have been saved." });
  };

  const handleDownloadNotes = () => {
    const notesText = notes.map((n) => `[${n.timestamp}] ${n.content}`).join("\n\n");
    const blob = new Blob([`# Notes for: ${videoTitle}\n\n${notesText}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${videoTitle.replace(/[^a-z0-9]/gi, "_")}_notes.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Notes Downloaded!", description: "Your notes have been saved as a markdown file." });
  };

  const callAI = async (action: string) => {
    setIsAILoading(true);
    setAiAction(action);
    
    try {
      const existingNotes = notes.map(n => `[${n.timestamp}] ${n.content}`).join("\n");
      
      const { data, error } = await supabase.functions.invoke('generate-notes', {
        body: {
          action,
          videoTitle,
          existingNotes,
          userInput: currentNote,
        }
      });

      if (error) throw error;

      if (data?.result) {
        if (action === "improve" && currentNote.trim()) {
          setCurrentNote(data.result);
          toast({ title: "Note Improved!", description: "Your note has been enhanced by AI" });
        } else {
          handleAddNote(data.result, true);
          toast({ 
            title: "AI Generated!", 
            description: `${action === 'summarize' ? 'Summary' : action === 'quiz' ? 'Quiz' : action === 'generate' ? 'Study notes' : 'Note'} added successfully` 
          });
        }
      }
    } catch (error) {
      console.error("AI Error:", error);
      toast({ 
        title: "AI Error", 
        description: "Failed to generate content. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsAILoading(false);
      setAiAction(null);
    }
  };

  const generateFlowchart = async () => {
    setShowFlowchart(true);
    setIsFlowchartLoading(true);
    setFlowchartCollapsed(false);
    
    try {
      const existingNotes = notes.map(n => n.content).join("\n");
      
      const { data, error } = await supabase.functions.invoke('generate-notes', {
        body: {
          action: 'flowchart',
          videoTitle,
          existingNotes,
          userInput: currentNote || existingNotes || videoTitle,
        }
      });

      if (error) throw error;

      if (data?.result) {
        setFlowchartCode(data.result);
        toast({ title: "Flowchart Generated!", description: "Your visual diagram is ready." });
      }
    } catch (error) {
      console.error("Flowchart Error:", error);
      toast({ 
        title: "Flowchart Error", 
        description: "Failed to generate flowchart. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsFlowchartLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-foreground/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card w-full max-w-[1400px] max-h-[95vh] rounded-3xl p-6 relative shadow-deep overflow-hidden flex flex-col">
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

        <div className="flex flex-col xl:flex-row gap-6 flex-1 overflow-hidden">
          {/* Video Section */}
          <div className="xl:w-1/2 flex flex-col gap-4">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-[280px] lg:h-[350px] rounded-2xl"
              allowFullScreen
              title="Video Player"
            />
            
            {/* Flowchart Panel (Collapsible) */}
            {showFlowchart && (
              <FlowchartPanel
                mermaidCode={flowchartCode}
                isLoading={isFlowchartLoading}
                onRegenerate={generateFlowchart}
                isCollapsed={flowchartCollapsed}
                onToggleCollapse={() => setFlowchartCollapsed(!flowchartCollapsed)}
                onClose={() => setShowFlowchart(false)}
              />
            )}
          </div>

          {/* Notes Section */}
          <div className="xl:w-1/2 flex flex-col bg-muted/50 rounded-2xl p-4 max-h-[600px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-foreground">AI Notes</h4>
                <span className="text-xs text-muted-foreground">{notes.length} notes</span>
              </div>
              {notes.length > 0 && (
                <button
                  onClick={handleDownloadNotes}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-xs"
                  title="Download Notes"
                >
                  <Download className="w-3 h-3" />
                  Save
                </button>
              )}
            </div>

            {/* AI Actions - Main Generate Button */}
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={() => callAI("generate")}
                disabled={isAILoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium hover:from-violet-600 hover:to-purple-700 transition-all disabled:opacity-50 shadow-lg"
              >
                {isAILoading && aiAction === "generate" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Generate Notes
              </button>
              
              <button
                onClick={generateFlowchart}
                disabled={isFlowchartLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-sm font-medium hover:from-teal-600 hover:to-cyan-700 transition-all disabled:opacity-50 shadow-lg"
              >
                {isFlowchartLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <GitBranch className="w-4 h-4" />
                )}
                Generate Flowchart
              </button>
            </div>

            {/* Secondary AI Actions */}
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={() => callAI("summarize")}
                disabled={isAILoading || notes.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-600 text-xs font-medium hover:from-violet-500/30 hover:to-purple-500/30 transition-all disabled:opacity-50"
              >
                {isAILoading && aiAction === "summarize" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Summarize
              </button>
              <button
                onClick={() => callAI("quiz")}
                disabled={isAILoading || notes.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-600 text-xs font-medium hover:from-emerald-500/30 hover:to-teal-500/30 transition-all disabled:opacity-50"
              >
                {isAILoading && aiAction === "quiz" ? <Loader2 className="w-3 h-3 animate-spin" /> : <ListChecks className="w-3 h-3" />}
                Quiz Me
              </button>
              <button
                onClick={() => callAI("expand")}
                disabled={isAILoading || !currentNote.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 text-xs font-medium hover:from-amber-500/30 hover:to-orange-500/30 transition-all disabled:opacity-50"
              >
                {isAILoading && aiAction === "expand" ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileUp className="w-3 h-3" />}
                Expand
              </button>
              <button
                onClick={() => callAI("improve")}
                disabled={isAILoading || !currentNote.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-600 text-xs font-medium hover:from-blue-500/30 hover:to-cyan-500/30 transition-all disabled:opacity-50"
              >
                {isAILoading && aiAction === "improve" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                Improve
              </button>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 custom-scrollbar">
              {notes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <BookmarkPlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notes yet. Click "Generate Notes" or add your own!</p>
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className={`rounded-xl p-3 group ${note.isAI ? 'bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20' : 'bg-card'}`}>
                    {editingNoteId === note.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full h-24 p-2 rounded-lg bg-background border border-border text-sm resize-none focus:ring-2 focus:ring-ring outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(note.id)}
                            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs font-medium">
                            {note.isAI && <Sparkles className="w-3 h-3 text-violet-500" />}
                            <Clock className="w-3 h-3 text-primary" />
                            <span className="text-primary">{note.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                              onClick={() => handleEditNote(note)}
                              className="p-1 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="p-1 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">{note.content}</p>
                      </>
                    )}
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
                placeholder="Add a note or topic for AI to expand on..."
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
                  onClick={() => handleAddNote()}
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
      
      {/* Focus Mode - Gentle reminders when focus is lost */}
      <FocusMode isVideoPlaying={isVideoPlaying} />
    </div>
  );
};
