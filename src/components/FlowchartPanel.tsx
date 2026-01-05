import { useEffect, useRef, useState } from "react";
import { GitBranch, Loader2, RefreshCw, Download, ChevronDown, ChevronUp, X } from "lucide-react";
import mermaid from "mermaid";

interface FlowchartPanelProps {
  mermaidCode: string;
  isLoading: boolean;
  onRegenerate: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
}

export const FlowchartPanel = ({
  mermaidCode,
  isLoading,
  onRegenerate,
  isCollapsed,
  onToggleCollapse,
  onClose,
}: FlowchartPanelProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedCode, setEditedCode] = useState(mermaidCode);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: "basis",
      },
      securityLevel: "loose",
    });
  }, []);

  useEffect(() => {
    setEditedCode(mermaidCode);
  }, [mermaidCode]);

  useEffect(() => {
    const renderMermaid = async () => {
      if (!containerRef.current || isCollapsed) return;
      
      const codeToRender = editMode ? editedCode : mermaidCode;
      if (!codeToRender) return;

      // Extract mermaid code from markdown code blocks if present
      let cleanCode = codeToRender;
      const mermaidMatch = codeToRender.match(/```mermaid\s*([\s\S]*?)```/);
      if (mermaidMatch) {
        cleanCode = mermaidMatch[1].trim();
      }

      try {
        setError(null);
        containerRef.current.innerHTML = "";
        
        const { svg } = await mermaid.render("flowchart-svg", cleanCode);
        containerRef.current.innerHTML = svg;
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError("Failed to render flowchart. The generated code may have syntax errors.");
      }
    };

    renderMermaid();
  }, [mermaidCode, editedCode, editMode, isCollapsed]);

  const handleDownload = () => {
    if (!containerRef.current) return;
    
    const svg = containerRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "flowchart.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-muted/30 rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-primary" />
          <h4 className="font-semibold text-foreground">Flowchart</h4>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
        </div>
        <div className="flex items-center gap-2">
          {!isCollapsed && mermaidCode && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditMode(!editMode);
                }}
                className="px-3 py-1.5 text-xs rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                {editMode ? "Preview" : "Edit"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRegenerate();
                }}
                className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                title="Regenerate"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                title="Download SVG"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
          {isCollapsed ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-4 pt-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p className="text-sm">Generating flowchart...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-destructive text-sm mb-3">{error}</p>
              <button
                onClick={onRegenerate}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
            </div>
          ) : editMode ? (
            <textarea
              value={editedCode}
              onChange={(e) => setEditedCode(e.target.value)}
              className="w-full h-48 p-3 rounded-xl bg-card border border-border font-mono text-sm resize-none focus:ring-2 focus:ring-ring outline-none"
              placeholder="Enter Mermaid code..."
            />
          ) : mermaidCode ? (
            <div 
              ref={containerRef} 
              className="w-full overflow-x-auto bg-card rounded-xl p-4 min-h-[200px] flex items-center justify-center"
            />
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Click "Generate Flowchart" to create a visual diagram</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
