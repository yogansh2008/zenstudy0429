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
  coral: "bg-gradient-coral/20 text-gradient-coral",
  mint: "bg-gradient-mint/30 text-emerald-600",
  lavender: "bg-gradient-lavender/30 text-indigo-500",
};

const iconBgMap = {
  coral: "bg-gradient-coral",
  mint: "bg-gradient-mint", 
  lavender: "bg-gradient-lavender",
};

export const StatsCard = ({ icon: Icon, label, value, subtext, color, delay = 0 }: StatsCardProps) => {
  return (
    <div 
      className={`stat-card p-5 shadow-card opacity-0 animate-slide-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold text-card-foreground">{value}</p>
          {subtext && (
            <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${iconBgMap[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-foreground" />
        </div>
      </div>
    </div>
  );
};
