import { Sparkles } from "lucide-react";

interface WelcomeHeaderProps {
  userName: string;
}

export const WelcomeHeader = ({ userName }: WelcomeHeaderProps) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  
  return (
    <div className="opacity-0 animate-fade-in">
      <div className="flex items-center gap-2 text-[#78716C] text-sm mb-2">
        <div className="w-6 h-6 rounded-full bg-[#C7CEEA]/40 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-[#78716C]" />
        </div>
        <span className="font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
      </div>
      <h1 className="text-4xl font-extrabold text-[#44403C]">
        {greeting}, <span className="bg-gradient-to-r from-[#FF9AA2] via-[#B5EAD7] to-[#C7CEEA] bg-clip-text text-transparent">{userName}</span> 👋
      </h1>
      <p className="text-[#78716C] mt-2 text-lg">Ready to learn something new today?</p>
    </div>
  );
};
