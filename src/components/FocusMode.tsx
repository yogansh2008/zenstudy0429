import { useState, useEffect, useCallback } from "react";
import { Eye, X } from "lucide-react";

interface FocusModeProps {
  isVideoPlaying: boolean;
}

const FOCUS_MESSAGES = [
  "Let's stay focused for a few more minutes. 🎯",
  "You're doing well, keep going! 💪",
  "Welcome back! Ready to continue learning? 📚",
  "A little focus goes a long way. You've got this! ✨",
  "Great to have you back. Let's keep the momentum! 🚀",
  "Stay with it—you're making progress! 🌟",
];

export const FocusMode = ({ isVideoPlaying }: FocusModeProps) => {
  const [showReminder, setShowReminder] = useState(false);
  const [message, setMessage] = useState("");
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null);

  const getRandomMessage = useCallback(() => {
    return FOCUS_MESSAGES[Math.floor(Math.random() * FOCUS_MESSAGES.length)];
  }, []);

  const showFocusReminder = useCallback(() => {
    if (isVideoPlaying) {
      setMessage(getRandomMessage());
      setShowReminder(true);
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowReminder(false);
      }, 5000);
    }
  }, [isVideoPlaying, getRandomMessage]);

  const resetIdleTimer = useCallback(() => {
    if (idleTimer) {
      clearTimeout(idleTimer);
    }
    
    if (isVideoPlaying) {
      const timer = setTimeout(() => {
        showFocusReminder();
      }, 60000); // Show reminder after 1 minute of inactivity
      setIdleTimer(timer);
    }
  }, [isVideoPlaying, idleTimer, showFocusReminder]);

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isVideoPlaying) {
        // User came back to the tab
        showFocusReminder();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isVideoPlaying, showFocusReminder]);

  // Handle idle detection
  useEffect(() => {
    if (!isVideoPlaying) {
      if (idleTimer) {
        clearTimeout(idleTimer);
        setIdleTimer(null);
      }
      return;
    }

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    
    events.forEach(event => {
      document.addEventListener(event, resetIdleTimer, true);
    });

    resetIdleTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetIdleTimer, true);
      });
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
    };
  }, [isVideoPlaying, resetIdleTimer, idleTimer]);

  if (!showReminder) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm border border-primary/20 rounded-xl p-4 shadow-lg max-w-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
            <Eye className="w-5 h-5 text-primary-foreground" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-foreground">Focus Mode</span>
              <button
                onClick={() => setShowReminder(false)}
                className="p-1 rounded-full hover:bg-muted/50 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
