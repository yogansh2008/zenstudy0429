import { LucideIcon } from "lucide-react";

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
    bg: "bg-[#FF9AA2]/20",
    icon: "bg-gradient-to-br from-[#FF9AA2] to-[#FFB7B2]",
  },
  mint: {
    bg: "bg-[#B5EAD7]/20",
    icon: "bg-gradient-to-br from-[#B5EAD7] to-[#9BD8C4]",
  },
  lavender: {
    bg: "bg-[#C7CEEA]/20",
    icon: "bg-gradient-to-br from-[#C7CEEA] to-[#B5BCE0]",
  },
};

export const StatsCard = ({ icon: Icon, label, value, subtext, color, delay = 0 }: StatsCardProps) => {
  return (
    <div 
      className="stat-card p-5 opacity-0 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#78716C] mb-1 font-medium">{label}</p>
          <p className="text-3xl font-bold text-[#44403C]">{value}</p>
          {subtext && (
            <p className="text-xs text-[#A8A29E] mt-1">{subtext}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl ${colorMap[color].icon} flex items-center justify-center shadow-md`}>
          <Icon className="w-6 h-6 text-white/90" />
        </div>
      </div>
    </div>
  );
};
