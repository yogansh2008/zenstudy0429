import { Sparkles, Sun, Moon, CloudSun } from "lucide-react";

interface WelcomeHeaderProps {
  userName: string;
}

export const WelcomeHeader = ({ userName }: WelcomeHeaderProps) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const GreetingIcon = hour < 12 ? Sun : hour < 18 ? CloudSun : Moon;
  
  return (
    <div className="opacity-0 animate-fade-in">
      {/* Date badge */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/60 backdrop-blur-sm shadow-sm">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#C7CEEA] to-[#B5EAD7] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[#78716C] font-medium text-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>
      
      {/* Greeting */}
      <div className="flex items-center gap-3">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-[#44403C] tracking-tight">
          {greeting}, <span className="text-gradient">{userName}</span>
        </h1>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFB7B2] to-[#FFDAC1] flex items-center justify-center shadow-md animate-float-badge">
          <GreetingIcon className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <p className="text-[#78716C] mt-3 text-lg font-medium">
        Ready to learn something amazing today? ✨
      </p>
    </div>
  );
};
