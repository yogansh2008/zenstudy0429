import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee, Brain, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SessionCompletePopup } from "@/components/SessionCompletePopup";
type Mode = "focus" | "short-break" | "long-break";

interface ModeConfig {
  label: string;
  icon: React.ElementType;
  defaultMinutes: number;
  color: string;
  bgGradient: string;
  messages: string[];
  completionMessage: string;
  nextMode: Mode;
  tips: string[];
}

const modeConfigs: Record<Mode, ModeConfig> = {
  focus: {
    label: "Focus Study",
    icon: Brain,
    defaultMinutes: 25,
    color: "text-primary",
    bgGradient: "from-primary/10 to-primary/5",
    messages: [
      "Stay focused, you're making progress.",
      "Just a few more minutes—keep going.",
      "Deep work leads to deep learning.",
      "You're doing great, keep it up!",
    ],
    completionMessage: "Excellent focus session! Time for a well-deserved break.",
    nextMode: "short-break",
    tips: ["Stay present", "One task at a time", "You've got this"],
  },
  "short-break": {
    label: "Short Break",
    icon: Coffee,
    defaultMinutes: 5,
    color: "text-accent",
    bgGradient: "from-accent/10 to-accent/5",
    messages: [
      "Take a short break. You've earned it.",
      "Rest your eyes, stretch a little.",
    ],
    completionMessage: "Break complete! Ready to focus again?",
    nextMode: "focus",
    tips: ["Relax your eyes", "Stretch lightly", "Drink water", "Breathe deeply"],
  },
  "long-break": {
    label: "Long Break",
    icon: Leaf,
    defaultMinutes: 15,
    color: "text-secondary",
    bgGradient: "from-secondary/10 to-secondary/5",
    messages: [
      "Take a longer break to recharge before your next session.",
      "Rest well, you've been working hard.",
    ],
    completionMessage: "Feeling refreshed? Let's get back to learning!",
    nextMode: "focus",
    tips: ["Walk around", "Eat something light", "Mental reset", "Step outside"],
  },
};

const FocusStudyMode = () => {
  const [mode, setMode] = useState<Mode>("focus");
  const [customMinutes, setCustomMinutes] = useState<number>(modeConfigs.focus.defaultMinutes);
  const [timeLeft, setTimeLeft] = useState<number>(customMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState<string>("");
  const [hasShownMessage, setHasShownMessage] = useState(false);
  const [showSessionPopup, setShowSessionPopup] = useState(false);
  const config = modeConfigs[mode];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((customMinutes * 60 - timeLeft) / (customMinutes * 60)) * 100;

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setCustomMinutes(modeConfigs[newMode].defaultMinutes);
    setTimeLeft(modeConfigs[newMode].defaultMinutes * 60);
    setIsRunning(false);
    setIsComplete(false);
    setMotivationalMessage("");
    setHasShownMessage(false);
  };

  const handleTimeChange = (minutes: number) => {
    const validMinutes = Math.max(1, Math.min(120, minutes));
    setCustomMinutes(validMinutes);
    setTimeLeft(validMinutes * 60);
    setIsComplete(false);
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsComplete(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(customMinutes * 60);
    setIsRunning(false);
    setIsComplete(false);
    setMotivationalMessage("");
    setHasShownMessage(false);
  };

  const showMotivationalMessage = useCallback(() => {
    const messages = config.messages;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMotivationalMessage(randomMessage);
    setTimeout(() => setMotivationalMessage(""), 5000);
  }, [config.messages]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            // Show popup when 10+ minute focus session completes
            if (mode === "focus" && customMinutes >= 10) {
              setShowSessionPopup(true);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Show motivational message once around 40% progress for focus mode
      if (mode === "focus" && !hasShownMessage && progress > 40 && progress < 50) {
        showMotivationalMessage();
        setHasShownMessage(true);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, progress, hasShownMessage, showMotivationalMessage, customMinutes]);

  const handleNextMode = () => {
    handleModeChange(config.nextMode);
  };

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br transition-all duration-700",
      config.bgGradient,
      "bg-background"
    )}>
      <div className="container max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-2">Focus Study Mode</h1>
          <p className="text-muted-foreground">Stay focused. Take breaks. Learn deeply.</p>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {(Object.keys(modeConfigs) as Mode[]).map((m) => {
            const mConfig = modeConfigs[m];
            const Icon = mConfig.icon;
            return (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                disabled={isRunning}
                className={cn(
                  "p-4 rounded-xl transition-all duration-300 border-2",
                  mode === m
                    ? "bg-card border-primary shadow-lg scale-105"
                    : "bg-card/50 border-transparent hover:bg-card hover:border-border",
                  isRunning && mode !== m && "opacity-50 cursor-not-allowed"
                )}
              >
                <Icon className={cn("w-6 h-6 mx-auto mb-2", mode === m ? mConfig.color : "text-muted-foreground")} />
                <span className={cn("text-sm font-medium", mode === m ? "text-foreground" : "text-muted-foreground")}>
                  {mConfig.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Timer Card */}
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-8">
            {/* Time Input */}
            {!isRunning && !isComplete && (
              <div className="flex items-center justify-center gap-3 mb-8">
                <span className="text-muted-foreground">Set time:</span>
                <Input
                  type="number"
                  value={customMinutes}
                  onChange={(e) => handleTimeChange(parseInt(e.target.value) || 1)}
                  className="w-20 text-center"
                  min={1}
                  max={120}
                />
                <span className="text-muted-foreground">minutes</span>
              </div>
            )}

            {/* Progress Ring */}
            <div className="relative w-64 h-64 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/20"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 120}
                  strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                  strokeLinecap="round"
                  className={cn("transition-all duration-1000", config.color)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-mono font-bold text-foreground">{formatTime(timeLeft)}</span>
                <span className={cn("text-sm font-medium mt-2", config.color)}>{config.label}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              {!isComplete ? (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleReset}
                    disabled={timeLeft === customMinutes * 60 && !isRunning}
                    className="w-12 h-12 rounded-full"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={isRunning ? handlePause : handleStart}
                    size="lg"
                    className="w-16 h-16 rounded-full"
                  >
                    {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                  </Button>
                </>
              ) : (
                <Button onClick={handleNextMode} size="lg" className="px-8">
                  Start {modeConfigs[config.nextMode].label}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Motivational Message */}
        {motivationalMessage && (
          <div className="text-center mb-6 animate-fade-in">
            <p className="text-lg text-foreground/80 italic">"{motivationalMessage}"</p>
          </div>
        )}

        {/* Completion Message */}
        {isComplete && (
          <Card className="mb-6 border-primary/20 bg-primary/5 animate-fade-in">
            <CardContent className="p-6 text-center">
              <p className="text-lg font-medium text-foreground">{config.completionMessage}</p>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        <Card className="bg-card/50">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              {mode === "focus" ? "Focus Tips" : "Break Tips"}
            </h3>
            <div className="flex flex-wrap gap-2">
              {config.tips.map((tip, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-muted/50 rounded-full text-sm text-muted-foreground"
                >
                  {tip}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-sm mt-8">
          ZenStudy • Focus deeply, rest well
        </p>
      </div>

      {/* Session Complete Popup */}
      <SessionCompletePopup
        isOpen={showSessionPopup}
        onClose={() => setShowSessionPopup(false)}
        sessionType="focus"
        sessionDuration={customMinutes}
      />
    </div>
  );
};

export default FocusStudyMode;
