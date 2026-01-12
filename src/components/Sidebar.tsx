import { BookOpen, Video, FileText, Settings } from "lucide-react";
import { useNavigationSound } from "@/hooks/useNavigationSound";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarItems = [
  { id: "library", icon: BookOpen, label: "Library" },
  { id: "videos", icon: Video, label: "Videos" },
  { id: "notes", icon: FileText, label: "Notes" },
  { id: "settings", icon: Settings, label: "Settings" },
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
    <aside className="w-[88px] glass flex flex-col items-center py-6 gap-3">
      {/* Logo */}
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF9AA2] to-[#C7CEEA] flex items-center justify-center mb-4 shadow-lg">
        <span className="text-2xl">🐼</span>
      </div>
      
      {/* Nav Items */}
      <div className="flex flex-col items-center gap-2 flex-1">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            className={`
              w-14 h-14 flex flex-col items-center justify-center rounded-2xl
              transition-all duration-300 cursor-pointer group relative
              ${activeTab === item.id 
                ? "bg-white/90 shadow-lg scale-105" 
                : "hover:bg-white/50 hover:scale-105"
              }
            `}
            title={item.label}
          >
            <item.icon 
              className={`w-5 h-5 transition-colors ${
                activeTab === item.id 
                  ? "text-[#44403C]" 
                  : "text-[#78716C] group-hover:text-[#44403C]"
              }`} 
            />
            <span 
              className={`text-[10px] mt-1 font-medium transition-colors ${
                activeTab === item.id 
                  ? "text-[#44403C]" 
                  : "text-[#78716C] group-hover:text-[#44403C]"
              }`}
            >
              {item.label}
            </span>
            
            {/* Active indicator */}
            {activeTab === item.id && (
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#FF9AA2] to-[#C7CEEA] rounded-full" />
            )}
          </button>
        ))}
      </div>
    </aside>
  );
};
