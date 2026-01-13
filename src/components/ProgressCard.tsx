import { Trophy, Flame, Target, Zap } from "lucide-react";

interface ProgressCardProps {
  streak: number;
  todayMinutes: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

export const ProgressCard = ({ streak, todayMinutes, weeklyGoal, weeklyProgress }: ProgressCardProps) => {
  const percentage = Math.min((weeklyProgress / weeklyGoal) * 100, 100);
  const todayPercentage = Math.min((todayMinutes / 120) * 100, 100);
  
  return (
    <div className="glass-card p-6 opacity-0 animate-slide-up stagger-2">
      {/* Streak Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF9AA2] to-[#FFB7B2] flex items-center justify-center animate-pulse-glow shadow-lg">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-[#FFDAC1] to-[#FFB7B2] rounded-full flex items-center justify-center shadow-md">
            <Flame className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-[#44403C]">{streak}</p>
            <span className="text-lg font-semibold text-[#78716C]">Day Streak</span>
          </div>
          <p className="text-sm text-[#A8A29E] font-medium">You're on fire! 🔥</p>
        </div>
      </div>
      
      {/* Progress Bars */}
      <div className="space-y-5">
        {/* Today's Study Time */}
        <div className="bg-white/50 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#B5EAD7] to-[#9BD8C4] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-[#44403C] font-semibold text-sm">Today's Focus</span>
            </div>
            <span className="font-bold text-[#44403C] text-lg">{todayMinutes}m</span>
          </div>
          <div className="h-3 bg-[#C7CEEA]/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#B5EAD7] to-[#C7CEEA] rounded-full transition-all duration-700 relative"
              style={{ width: `${todayPercentage}%` }}
            >
              <div className="absolute inset-0 shimmer" />
            </div>
          </div>
        </div>
        
        {/* Weekly Goal */}
        <div className="bg-white/50 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF9AA2] to-[#FFB7B2] flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <span className="text-[#44403C] font-semibold text-sm">Weekly Goal</span>
            </div>
            <span className="font-bold text-[#44403C] text-lg">{weeklyProgress}/{weeklyGoal}h</span>
          </div>
          <div className="h-3 bg-[#C7CEEA]/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#FF9AA2] to-[#FFB7B2] rounded-full transition-all duration-700 relative"
              style={{ width: `${percentage}%` }}
            >
              <div className="absolute inset-0 shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
