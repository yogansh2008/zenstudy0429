import { Sparkles, RefreshCw, Loader2, Brain } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSkippedHabits, setHasSkippedHabits] = useState(false);

  const analyzeAndGenerateMessage = useCallback(async () => {
    // Find skipped habits for today
    const skippedToday = habits
      .filter(h => !h.completedDays.includes(currentDay))
      .map(h => h.name);

    setHasSkippedHabits(skippedToday.length > 0);

    // Calculate patterns for each habit
    const habitPatterns = habits.map(h => {
      const completionRate = h.goal > 0 ? (h.completedDays.length / h.goal) * 100 : 0;
      const streak = calculateStreak(h.completedDays, currentDay);
      const wasCompletedLastWeek = h.completedDays.includes(currentDay - 7);
      const isCompletedToday = h.completedDays.includes(currentDay);
      
      return {
        name: h.name,
        completionRate: Math.round(completionRate),
        streak,
        wasCompletedLastWeek,
        isCompletedToday,
        skippedToday: !isCompletedToday,
        skippedLastWeekSameDay: !wasCompletedLastWeek && !isCompletedToday,
      };
    });

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-notes', {
        body: {
          action: 'motivation',
          habitData: {
            habits: habitPatterns,
            skippedToday,
            currentDay,
          }
        }
      });

      if (error) throw error;
      
      if (data?.result) {
        setMessage(data.result);
      }
    } catch (error) {
      console.error("AI Motivation error:", error);
      // Fallback to local message
      if (skippedToday.length === 0) {
        setMessage("Amazing progress today! You're building momentum. Keep up the great work! 🌟");
      } else {
        setMessage(`You have ${skippedToday.length} habit(s) to complete today. Small steps lead to big changes—you've got this! 💪`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [habits, currentDay]);

  useEffect(() => {
    if (habits.length > 0) {
      analyzeAndGenerateMessage();
    }
  }, [habits, currentDay, analyzeAndGenerateMessage]);

  const calculateStreak = (completedDays: number[], today: number): number => {
    let streak = 0;
    for (let day = today; day >= 1; day--) {
      if (completedDays.includes(day)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
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
            <span className="text-sm font-semibold text-foreground">AI Motivation</span>
          </div>
          
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Analyzing your habits...</span>
            </div>
          ) : (
            <p className="text-sm text-foreground/80 leading-relaxed">
              {message}
            </p>
          )}
        </div>

        <button
          onClick={analyzeAndGenerateMessage}
          disabled={isLoading}
          className="p-2 rounded-lg hover:bg-white/50 transition-colors disabled:opacity-50"
          title="Refresh suggestion"
        >
          <RefreshCw className={`w-4 h-4 text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};
