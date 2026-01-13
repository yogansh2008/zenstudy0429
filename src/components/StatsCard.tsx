import { LucideIcon, TrendingUp } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext?: string;
  color: "coral" | "mint" | "lavender";
  delay?: number;
}

const colorMap = {
  coral: {
    bg: "bg-[#FF9AA2]/15",
    icon: "from-[#FF9AA2] to-[#FFB7B2]",
    text: "text-[#FF9AA2]",
    glow: "shadow-[0_8px_24px_rgba(255,154,162,0.3)]",
  },
  mint: {
    bg: "bg-[#B5EAD7]/15",
    icon: "from-[#B5EAD7] to-[#9BD8C4]",
    text: "text-[#7BC7A8]",
    glow: "shadow-[0_8px_24px_rgba(181,234,215,0.3)]",
  },
  lavender: {
    bg: "bg-[#C7CEEA]/15",
    icon: "from-[#C7CEEA] to-[#B5BCE0]",
    text: "text-[#9BA4D4]",
    glow: "shadow-[0_8px_24px_rgba(199,206,234,0.3)]",
  },
};

export const StatsCard = ({ icon: Icon, label, value, subtext, color, delay = 0 }: StatsCardProps) => {
  return (
    <div 
      className="stat-card p-6 opacity-0 animate-slide-up group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[#78716C] mb-2 font-medium tracking-wide uppercase">{label}</p>
          <p className="text-4xl font-bold text-[#44403C] tracking-tight">{value}</p>
          {subtext && (
            <div className="flex items-center gap-1.5 mt-2">
              <TrendingUp className={`w-3.5 h-3.5 ${colorMap[color].text}`} />
              <p className={`text-xs font-medium ${colorMap[color].text}`}>{subtext}</p>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorMap[color].icon} flex items-center justify-center ${colorMap[color].glow} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );
};
