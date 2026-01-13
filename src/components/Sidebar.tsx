import { BookOpen, Video, FileText, Settings, Sparkles } from "lucide-react";
import { useNavigationSound } from "@/hooks/useNavigationSound";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarItems = [
  { id: "library", icon: BookOpen, label: "Library", color: "from-[#FF9AA2] to-[#FFB7B2]" },
  { id: "videos", icon: Video, label: "Videos", color: "from-[#B5EAD7] to-[#9BD8C4]" },
  { id: "notes", icon: FileText, label: "Notes", color: "from-[#C7CEEA] to-[#B5BCE0]" },
  { id: "settings", icon: Settings, label: "Settings", color: "from-[#FFDAC1] to-[#FFB7B2]" },
];

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { playNavigationSound } = useNavigationSound();

  const handleTabChange = (tabId: string) => {
    if (tabId !== activeTab) {
      playNavigationSound();
    }
    onTabChange(tabId);
  };

  return (
    <aside className="w-[100px] glass flex flex-col items-center py-8 gap-4">
      {/* Logo with glow */}
      <div className="relative mb-6 group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF9AA2] to-[#C7CEEA] rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity" />
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF9AA2] to-[#C7CEEA] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
          <span className="text-3xl">🐼</span>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#B5EAD7] rounded-full flex items-center justify-center animate-pulse">
          <Sparkles className="w-2.5 h-2.5 text-white" />
        </div>
      </div>
      
      {/* Nav Items */}
      <div className="flex flex-col items-center gap-3 flex-1">
        {sidebarItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            className={`
              w-16 h-16 flex flex-col items-center justify-center rounded-2xl
              transition-all duration-400 cursor-pointer group relative
              ${activeTab === item.id 
                ? "bg-white shadow-lg scale-110" 
                : "hover:bg-white/60 hover:scale-105"
              }
            `}
            style={{ animationDelay: `${index * 100}ms` }}
            title={item.label}
          >
            {/* Gradient background for active state */}
            {activeTab === item.id && (
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10 rounded-2xl`} />
            )}
            
            <div className={`
              w-9 h-9 rounded-xl flex items-center justify-center mb-1
              transition-all duration-300
              ${activeTab === item.id 
                ? `bg-gradient-to-br ${item.color} shadow-md` 
                : "bg-transparent group-hover:bg-white/80"
              }
            `}>
              <item.icon 
                className={`w-4.5 h-4.5 transition-colors ${
                  activeTab === item.id 
                    ? "text-white" 
                    : "text-[#78716C] group-hover:text-[#44403C]"
                }`} 
              />
            </div>
            
            <span 
              className={`text-[10px] font-semibold transition-colors tracking-wide ${
                activeTab === item.id 
                  ? "text-[#44403C]" 
                  : "text-[#A8A29E] group-hover:text-[#44403C]"
              }`}
            >
              {item.label}
            </span>
            
            {/* Active indicator bar */}
            {activeTab === item.id && (
              <div className={`absolute -left-0.5 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b ${item.color} rounded-full shadow-md`} />
            )}
          </button>
        ))}
      </div>
      
      {/* Bottom decoration */}
      <div className="w-10 h-1 rounded-full bg-gradient-to-r from-[#FF9AA2] via-[#B5EAD7] to-[#C7CEEA] opacity-50" />
    </aside>
  );
};
