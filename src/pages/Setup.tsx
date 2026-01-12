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
      {/* Floating pastel shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#FF9AA2]/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-32 right-16 w-40 h-40 bg-[#B5EAD7]/30 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#C7CEEA]/30 rounded-full blur-3xl"></div>

      <div className="zen-glass-card w-full max-w-md p-8 animate-slide-up relative z-10">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#44403C] to-[#78716C] bg-clip-text text-transparent">
            Quick Setup
          </h1>
          <p className="text-[#78716C] mt-2">
            Tell us your goals so we personalize ZenStudy for you ✨
          </p>
        </div>

        <form onSubmit={handleContinue} className="space-y-6">
          {/* Career Goal Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#44403C]">
              Career Goal
            </label>
            <Select value={careerGoal} onValueChange={setCareerGoal}>
              <SelectTrigger className="h-14 rounded-2xl border-2 border-transparent bg-white/50 text-[#44403C] text-lg focus:ring-[#C7CEEA] focus:border-[#C7CEEA]">
                <SelectValue placeholder="Select your career goal" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl bg-white/95 backdrop-blur-lg border border-white/80">
                {careerGoals.map((goal) => (
                  <SelectItem
                    key={goal}
                    value={goal}
                    className="rounded-xl text-[#44403C] focus:bg-[#B5EAD7]/30 cursor-pointer"
                  >
                    {goal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preferred Language Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#44403C]">
              Preferred Language
            </label>
            <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
              <SelectTrigger className="h-14 rounded-2xl border-2 border-transparent bg-white/50 text-[#44403C] text-lg focus:ring-[#C7CEEA] focus:border-[#C7CEEA]">
                <SelectValue placeholder="Select your preferred language" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl bg-white/95 backdrop-blur-lg border border-white/80">
                {preferredLanguages.map((lang) => (
                  <SelectItem
                    key={lang}
                    value={lang}
                    className="rounded-xl text-[#44403C] focus:bg-[#B5EAD7]/30 cursor-pointer"
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
            className="w-full h-14 zen-primary-btn text-white text-lg font-medium mt-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>Continue to Dashboard 🚀</>
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-[#A8A29E] text-sm mt-8">
          Designed for <span className="text-[#FF9AA2]">Zen</span> Minds
        </p>
      </div>
    </div>
  );
};

export default Setup;