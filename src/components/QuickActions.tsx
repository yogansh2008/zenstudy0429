import { Play, BookMarked, PenTool, Target } from "lucide-react";

const actions = [
  { icon: Play, label: "Continue Learning", color: "from-[#FF9AA2] to-[#FFB7B2]", emoji: "▶️" },
  { icon: BookMarked, label: "Saved Videos", color: "from-[#B5EAD7] to-[#9BD8C4]", emoji: "📚" },
  { icon: PenTool, label: "My Notes", color: "from-[#C7CEEA] to-[#B5BCE0]", emoji: "✏️" },
  { icon: Target, label: "Practice Quiz", color: "from-[#FFB7B2] to-[#FF9AA2]", emoji: "🎯" },
];

export const QuickActions = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 opacity-0 animate-fade-in stagger-3">
      {actions.map((action, i) => (
        <button
          key={action.label}
          className="glass-card p-5 group cursor-pointer text-left"
          style={{ animationDelay: `${(i + 3) * 100}ms` }}
        >
          <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
            <action.icon className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm font-semibold text-[#44403C] group-hover:text-[#78716C] transition-colors">{action.label}</p>
          <p className="text-xs text-[#A8A29E] mt-1">Click to explore</p>
        </button>
      ))}
    </div>
  );
};
