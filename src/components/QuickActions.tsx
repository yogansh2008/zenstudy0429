import { Play, BookMarked, PenTool, Target, Brain } from "lucide-react";

const actions = [
  { icon: Play, label: "Continue Learning", color: "bg-gradient-coral", action: null },
  { icon: Brain, label: "Focus Mode", color: "bg-gradient-mint", action: "focus" },
  { icon: PenTool, label: "My Notes", color: "bg-gradient-lavender", action: null },
  { icon: Target, label: "Practice Quiz", color: "bg-gradient-coral", action: null },
];

export const QuickActions = () => {
  const handleClick = (action: string | null) => {
    if (action === "focus") {
      window.open("/focus", "_blank");
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 opacity-0 animate-fade-in stagger-3">
      {actions.map((action, i) => (
        <button
          key={action.label}
          onClick={() => handleClick(action.action)}
          className="bg-card p-4 rounded-xl shadow-card hover:shadow-elevated transition-all hover:-translate-y-1 group cursor-pointer"
          style={{ animationDelay: `${(i + 3) * 100}ms` }}
        >
          <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
            <action.icon className="w-5 h-5 text-foreground" />
          </div>
          <p className="text-sm font-medium text-card-foreground">{action.label}</p>
        </button>
      ))}
    </div>
  );
};
