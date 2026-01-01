import { Sparkles } from "lucide-react";

interface WelcomeHeaderProps {
  userName: string;
}

export const WelcomeHeader = ({ userName }: WelcomeHeaderProps) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  
  return (
    <div className="opacity-0 animate-fade-in">
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
        <Sparkles className="w-4 h-4" />
        <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
      </div>
      <h1 className="text-4xl font-extrabold text-foreground">
        {greeting}, <span className="bg-gradient-to-r from-gradient-coral via-gradient-mint to-gradient-lavender bg-clip-text text-transparent">{userName}</span> 👋
      </h1>
      <p className="text-muted-foreground mt-2">Ready to learn something new today?</p>
    </div>
  );
};
