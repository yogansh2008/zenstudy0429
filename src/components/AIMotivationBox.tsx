import { Sparkles, RefreshCw, Loader2, Brain, Clock } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useMotivationalQuote } from "@/hooks/useMotivationalQuote";

interface Habit {
  id: string;
  name: string;
  color: string;
  goal: number;
  completedDays: number[];
}

interface AIMotivationBoxProps {
  habits: Habit[];
  currentDay: number;
}

export const AIMotivationBox = ({ habits, currentDay }: AIMotivationBoxProps) => {
  const { quote, isLoading, changeQuote, getTimeRemaining } = useMotivationalQuote();
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Update time remaining every second
  useEffect(() => {
    const updateTime = () => setTimeRemaining(getTimeRemaining());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [getTimeRemaining]);

  const hasSkippedHabits = useMemo(() => {
    return habits.some(h => !h.completedDays.includes(currentDay));
  }, [habits, currentDay]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (habits.length === 0) return null;

  return (
    <div className={`rounded-xl p-4 border transition-all ${
      hasSkippedHabits 
        ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200' 
        : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          hasSkippedHabits 
            ? 'bg-gradient-to-br from-amber-400 to-orange-500' 
            : 'bg-gradient-to-br from-emerald-400 to-teal-500'
        }`}>
          <Brain className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">ZenStudy Wisdom</span>
            {timeRemaining > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground bg-white/50 px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3" />
                {formatTime(timeRemaining)}
              </span>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Finding wisdom...</span>
            </div>
          ) : (
            <p className="text-sm text-foreground/80 leading-relaxed italic">
              "{quote}"
            </p>
          )}
        </div>

        <button
          onClick={changeQuote}
          disabled={isLoading}
          className="p-2 rounded-lg hover:bg-white/50 transition-colors disabled:opacity-50 flex flex-col items-center gap-1"
          title="Change quote"
        >
          <RefreshCw className={`w-4 h-4 text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
          <span className="text-[10px] text-muted-foreground">Change</span>
        </button>
      </div>
    </div>
  );
};
