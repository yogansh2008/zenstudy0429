import { Trophy } from "lucide-react";

interface ProgressCardProps {
  streak: number;
  todayMinutes: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

export const ProgressCard = ({ streak, todayMinutes, weeklyGoal, weeklyProgress }: ProgressCardProps) => {
  const percentage = Math.min((weeklyProgress / weeklyGoal) * 100, 100);
  
  return (
    <div className="bg-card rounded-2xl p-6 shadow-elevated opacity-0 animate-slide-up stagger-2">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gradient-coral to-gradient-mint flex items-center justify-center animate-pulse-glow">
          <Trophy className="w-7 h-7 text-foreground" />
        </div>
        <div>
          <p className="text-2xl font-bold text-card-foreground">{streak} Day Streak 🔥</p>
          <p className="text-sm text-muted-foreground">Keep it up!</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Today's Study Time</span>
            <span className="font-semibold text-card-foreground">{todayMinutes} mins</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="progress-bar h-full"
              style={{ width: `${Math.min((todayMinutes / 120) * 100, 100)}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Weekly Goal</span>
            <span className="font-semibold text-card-foreground">{weeklyProgress}/{weeklyGoal} hrs</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="progress-bar h-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
