import { useEffect, useState } from "react";
import { X, Sparkles, Trophy } from "lucide-react";
import { useMotivationalQuote } from "@/hooks/useMotivationalQuote";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SessionCompletePopupProps {
  isOpen: boolean;
  onClose: () => void;
  sessionType?: "focus" | "habit";
  sessionDuration?: number; // in minutes
}

export const SessionCompletePopup = ({
  isOpen,
  onClose,
  sessionType = "focus",
  sessionDuration = 10,
}: SessionCompletePopupProps) => {
  const { quote, isLoading } = useMotivationalQuote();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getTitle = () => {
    if (sessionType === "habit") {
      return "Habit Session Complete! 🎯";
    }
    return `${sessionDuration} Minutes of Focus Complete! 🧘`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 bg-gradient-to-br from-emerald-50 via-white to-purple-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Trophy className="w-6 h-6 text-amber-500" />
            {getTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {/* Celebration animation */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 50}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${0.5 + Math.random() * 0.5}s`,
                  }}
                >
                  {["🌟", "✨", "💫", "⭐"][Math.floor(Math.random() * 4)]}
                </div>
              ))}
            </div>
          )}

          {/* Quote Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-primary/10 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-foreground">ZenStudy Wisdom</span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <p className="text-lg text-foreground/90 leading-relaxed italic">
                "{quote}"
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">{sessionDuration}</p>
              <p className="text-xs text-purple-500">minutes focused</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">100%</p>
              <p className="text-xs text-emerald-500">session complete</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Continue Learning
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
