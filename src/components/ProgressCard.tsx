import { Trophy, Flame } from "lucide-react";

interface ProgressCardProps {
  streak: number;
  todayMinutes: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

export const ProgressCard = ({ streak, todayMinutes, weeklyGoal, weeklyProgress }: ProgressCardProps) => {
  const percentage = Math.min((weeklyProgress / weeklyGoal) * 100, 100);
  
  return (
    <div className="glass-card p-6 opacity-0 animate-slide-up stagger-2">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF9AA2] to-[#FFB7B2] flex items-center justify-center animate-pulse-glow shadow-lg">
          <Trophy className="w-7 h-7 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-[#44403C]">{streak} Day Streak</p>
            <Flame className="w-5 h-5 text-[#FF9AA2]" />
          </div>
          <p className="text-sm text-[#78716C]">Keep it up!</p>
        </div>
      </div>
      
      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#78716C] font-medium">Today's Study Time</span>
            <span className="font-semibold text-[#44403C]">{todayMinutes} mins</span>
          </div>
          <div className="h-2.5 bg-[#C7CEEA]/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#B5EAD7] to-[#C7CEEA] rounded-full transition-all duration-700"
              style={{ width: `${Math.min((todayMinutes / 120) * 100, 100)}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#78716C] font-medium">Weekly Goal</span>
            <span className="font-semibold text-[#44403C]">{weeklyProgress}/{weeklyGoal} hrs</span>
          </div>
          <div className="h-2.5 bg-[#C7CEEA]/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#FF9AA2] to-[#FFB7B2] rounded-full transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
