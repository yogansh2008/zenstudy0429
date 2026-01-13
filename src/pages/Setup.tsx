import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCareerPreferences } from "@/hooks/useCareerPreferences";

const careerGoals = [
  "Software Engineer",
  "Backend Developer",
  "Frontend Developer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Game Developer",
];

const preferredLanguages = [
  "C",
  "C++",
  "Python",
  "Java",
  "JavaScript",
  "Rust",
];

const Setup = () => {
  const [careerGoal, setCareerGoal] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, loading } = useAuth();
  const { savePreferences } = useCareerPreferences();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen zen-gradient-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!careerGoal || !preferredLanguage) {
      toast({
        title: "Please complete setup",
        description: "Select both your career goal and preferred language.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to database if user is logged in
      if (user) {
        await savePreferences({
          fields: [careerGoal],
          goals: [preferredLanguage],
          experienceLevel: "beginner",
        });
      }

      // Also save to localStorage
      localStorage.setItem("zenStudySetupComplete", "true");
      localStorage.setItem("zenStudyCareerGoal", careerGoal);
      localStorage.setItem("zenStudyPreferredLanguage", preferredLanguage);

      toast({
        title: "Setup complete! 🎉",
        description: "Let's start your learning journey.",
      });

      navigate("/", { replace: true });
    } catch (error) {
      toast({
        title: "Setup failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen zen-gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating decorative shapes */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-[#FF9AA2]/25 rounded-full blur-3xl animate-float-shape" />
      <div className="absolute bottom-32 right-16 w-52 h-52 bg-[#B5EAD7]/25 rounded-full blur-3xl animate-float-shape" style={{ animationDelay: "-7s" }} />
      <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-[#C7CEEA]/25 rounded-full blur-3xl animate-float-shape" style={{ animationDelay: "-14s" }} />
      <div className="absolute top-1/4 right-1/3 w-20 h-20 bg-[#FFDAC1]/25 rounded-full blur-3xl animate-float-shape" style={{ animationDelay: "-3s" }} />

      <div className="zen-glass-card w-full max-w-md p-10 animate-slide-up relative z-10">
        {/* Progress indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B5EAD7] to-[#9BD8C4] flex items-center justify-center shadow-md">
              <span className="text-white font-bold">1</span>
            </div>
            <div className="w-12 h-1.5 rounded-full bg-[#C7CEEA]/30" />
            <div className="w-10 h-10 rounded-full bg-white/60 border-2 border-dashed border-[#C7CEEA] flex items-center justify-center">
              <span className="text-[#A8A29E] font-bold">2</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gradient mb-3">
            Quick Setup
          </h1>
          <p className="text-[#78716C] text-lg font-medium">
            Tell us your goals so we personalize ZenStudy for you ✨
          </p>
        </div>

        <form onSubmit={handleContinue} className="space-y-6">
          {/* Career Goal Dropdown */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-[#44403C] uppercase tracking-wide">
              Career Goal
            </label>
            <Select value={careerGoal} onValueChange={setCareerGoal}>
              <SelectTrigger className="h-16 rounded-2xl border-2 border-white/50 bg-white/50 text-[#44403C] text-lg font-medium focus:ring-[#C7CEEA] focus:border-[#C7CEEA] shadow-sm">
                <SelectValue placeholder="Select your career goal" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl bg-white/98 backdrop-blur-xl border border-white/80 shadow-deep">
                {careerGoals.map((goal) => (
                  <SelectItem
                    key={goal}
                    value={goal}
                    className="rounded-xl text-[#44403C] focus:bg-[#B5EAD7]/20 cursor-pointer font-medium py-3"
                  >
                    {goal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preferred Language Dropdown */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-[#44403C] uppercase tracking-wide">
              Preferred Language
            </label>
            <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
              <SelectTrigger className="h-16 rounded-2xl border-2 border-white/50 bg-white/50 text-[#44403C] text-lg font-medium focus:ring-[#C7CEEA] focus:border-[#C7CEEA] shadow-sm">
                <SelectValue placeholder="Select your preferred language" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl bg-white/98 backdrop-blur-xl border border-white/80 shadow-deep">
                {preferredLanguages.map((lang) => (
                  <SelectItem
                    key={lang}
                    value={lang}
                    className="rounded-xl text-[#44403C] focus:bg-[#B5EAD7]/20 cursor-pointer font-medium py-3"
                  >
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Continue Button */}
          <Button
            type="submit"
            className="w-full h-16 zen-primary-btn text-white text-lg font-semibold mt-8 shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Continue to Dashboard
                <span className="text-xl">🚀</span>
              </span>
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-10 flex items-center justify-center gap-2">
          <div className="w-8 h-1 rounded-full bg-gradient-to-r from-[#FF9AA2] to-[#FFB7B2]" />
          <p className="text-[#A8A29E] text-sm font-medium">
            Designed for <span className="text-[#FF9AA2] font-semibold">Zen</span> Minds
          </p>
          <div className="w-8 h-1 rounded-full bg-gradient-to-r from-[#B5EAD7] to-[#C7CEEA]" />
        </div>
      </div>
    </div>
  );
};

export default Setup;