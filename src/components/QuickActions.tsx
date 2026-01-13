import { Play, BookMarked, PenTool, Target, ArrowRight } from "lucide-react";

const actions = [
  { icon: Play, label: "Continue Learning", desc: "Resume where you left", color: "from-[#FF9AA2] to-[#FFB7B2]", bgColor: "bg-[#FF9AA2]/10" },
  { icon: BookMarked, label: "Saved Videos", desc: "12 videos saved", color: "from-[#B5EAD7] to-[#9BD8C4]", bgColor: "bg-[#B5EAD7]/10" },
  { icon: PenTool, label: "My Notes", desc: "8 notes this week", color: "from-[#C7CEEA] to-[#B5BCE0]", bgColor: "bg-[#C7CEEA]/10" },
  { icon: Target, label: "Practice Quiz", desc: "Test your knowledge", color: "from-[#FFDAC1] to-[#FFB7B2]", bgColor: "bg-[#FFDAC1]/10" },
];

export const QuickActions = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 opacity-0 animate-fade-in stagger-3">
      {actions.map((action, i) => (
        <button
          key={action.label}
          className="glass-card p-5 group cursor-pointer text-left relative overflow-hidden"
          style={{ animationDelay: `${(i + 3) * 100}ms` }}
        >
          {/* Hover background gradient */}
          <div className={`absolute inset-0 ${action.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          
          <div className="relative z-10">
            <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-bold text-[#44403C] group-hover:text-[#44403C] transition-colors mb-1">{action.label}</p>
            <p className="text-xs text-[#A8A29E] font-medium">{action.desc}</p>
          </div>
          
          {/* Arrow indicator */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <ArrowRight className="w-4 h-4 text-[#78716C]" />
          </div>
        </button>
      ))}
    </div>
  );
};
