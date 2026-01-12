import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const emailSchema = z.string().trim().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const displayNameSchema = z.string().trim().min(1, "Please enter your name").max(50, "Name must be less than 50 characters");

const Auth = () => {
  const [mode, setMode] = useState<"welcome" | "signin">("welcome");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const { signIn, signUp, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Check if user has completed setup
      const hasCompletedSetup = localStorage.getItem("zenStudySetupComplete");
      if (hasCompletedSetup) {
        navigate("/", { replace: true });
      } else {
        navigate("/setup", { replace: true });
      }
    }
  }, [isAuthenticated, loading, navigate]);

  const validateWelcomeForm = (): boolean => {
    const newErrors: typeof errors = {};
    const nameResult = displayNameSchema.safeParse(name);
    if (!nameResult.success) {
      newErrors.name = nameResult.error.errors[0].message;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignInForm = (): boolean => {
    const newErrors: typeof errors = {};
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartJourney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateWelcomeForm()) return;
    
    // Store name temporarily and switch to sign up with email
    localStorage.setItem("zenStudyTempName", name);
    setMode("signin");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignInForm()) return;

    setIsSubmitting(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        // If sign in fails, try to sign up
        const tempName = localStorage.getItem("zenStudyTempName") || name;
        const { error: signUpError } = await signUp(email, password, tempName || undefined);
        if (signUpError) {
          if (signUpError.message.includes("Invalid login credentials")) {
            toast({
              title: "Login failed",
              description: "Invalid email or password. Please try again.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Authentication failed",
              description: signUpError.message,
              variant: "destructive",
            });
          }
          return;
        }
        toast({
          title: "Welcome to ZenStudy! 🎉",
          description: "Your account has been created.",
        });
      } else {
        toast({
          title: "Welcome back! 🐼",
          description: "You've successfully signed in.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen zen-gradient-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen zen-gradient-bg flex items-center justify-center p-4">
      <div className="zen-glass-card w-full max-w-md p-8 animate-slide-up">
        {/* Floating Panda Badge */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#B5EAD7] flex items-center justify-center animate-float-badge shadow-lg">
            <span className="text-4xl">🐼</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#44403C] to-[#78716C] bg-clip-text text-transparent">
            ZenStudy
          </h1>
          <p className="text-[#78716C] mt-2">Focus better, study smarter.</p>
        </div>

        {mode === "welcome" ? (
          <form onSubmit={handleStartJourney} className="space-y-6">
            {/* Name Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]">
                <Sparkles className="w-5 h-5" />
              </div>
              <Input
                type="text"
                placeholder="Enter your name…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-12 h-14 rounded-2xl border-2 border-transparent bg-white/50 zen-input text-[#44403C] placeholder:text-[#A8A29E] text-lg"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-2">{errors.name}</p>
              )}
            </div>

            {/* Start Journey Button */}
            <Button
              type="submit"
              className="w-full h-14 zen-primary-btn text-white text-lg font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Start Your Journey 🚀</>
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#A8A29E]/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-[#78716C]">or</span>
              </div>
            </div>

            {/* Sign In Link */}
            <p className="text-center text-[#78716C]">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-[#44403C] font-medium hover:underline transition-colors"
              >
                Sign In
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Email Input */}
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-2xl border-2 border-transparent bg-white/50 zen-input text-[#44403C] placeholder:text-[#A8A29E] text-lg px-5"
                disabled={isSubmitting}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-2">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 rounded-2xl border-2 border-transparent bg-white/50 zen-input text-[#44403C] placeholder:text-[#A8A29E] text-lg px-5 pr-12"
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#44403C] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.password && (
                <p className="text-sm text-red-500 mt-2">{errors.password}</p>
              )}
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full h-14 zen-primary-btn text-white text-lg font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Sign In →</>
              )}
            </Button>

            {/* Back Link */}
            <p className="text-center text-[#78716C]">
              <button
                type="button"
                onClick={() => setMode("welcome")}
                className="text-[#44403C] font-medium hover:underline transition-colors"
              >
                ← Back to welcome
              </button>
            </p>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-[#A8A29E] text-sm mt-8">
          Designed for <span className="text-[#FF9AA2]">Zen</span> Minds
        </p>
      </div>
    </div>
  );
};

export default Auth;