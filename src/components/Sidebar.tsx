import { BookOpen, Video, FileText, Settings } from "lucide-react";

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
  return (
    <aside className="w-[90px] glass flex flex-col items-center py-5 gap-2">
      {sidebarItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`
            w-12 h-12 flex items-center justify-center rounded-xl
            transition-all duration-200 cursor-pointer
            ${activeTab === item.id 
              ? "bg-card shadow-card opacity-100" 
              : "opacity-60 hover:opacity-100 hover:bg-card/50"
            }
          `}
          title={item.label}
        >
          <item.icon className="w-6 h-6 text-foreground" />
        </button>
      ))}
    </aside>
  );
};
