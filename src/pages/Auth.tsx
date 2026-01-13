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
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-3xl">🐼</span>
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-[#44403C]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen zen-gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating decorative shapes */}
      <div className="absolute top-16 left-16 w-40 h-40 bg-[#FF9AA2]/25 rounded-full blur-3xl animate-float-shape" />
      <div className="absolute bottom-24 right-20 w-56 h-56 bg-[#B5EAD7]/25 rounded-full blur-3xl animate-float-shape" style={{ animationDelay: "-5s" }} />
      <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-[#C7CEEA]/25 rounded-full blur-3xl animate-float-shape" style={{ animationDelay: "-10s" }} />
      <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-[#FFDAC1]/25 rounded-full blur-3xl animate-float-shape" style={{ animationDelay: "-15s" }} />

      <div className="zen-glass-card w-full max-w-md p-10 animate-slide-up relative z-10">
        {/* Floating Panda Badge */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#B5EAD7] to-[#9BD8C4] rounded-full blur-lg opacity-50" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#B5EAD7] to-[#9BD8C4] flex items-center justify-center animate-float-badge shadow-xl">
              <span className="text-5xl">🐼</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-[#FF9AA2] to-[#FFB7B2] rounded-full flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gradient mb-2">
            ZenStudy
          </h1>
          <p className="text-[#78716C] text-lg font-medium">Focus better, study smarter.</p>
        </div>

        {mode === "welcome" ? (
          <form onSubmit={handleStartJourney} className="space-y-7">
            {/* Name Input */}
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C7CEEA] to-[#B5BCE0] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <Input
                type="text"
                placeholder="What's your name?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-20 h-16 rounded-2xl border-2 border-white/50 bg-white/50 zen-input text-[#44403C] placeholder:text-[#A8A29E] text-lg font-medium shadow-sm focus:shadow-md transition-shadow"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-2 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Start Journey Button */}
            <Button
              type="submit"
              className="w-full h-16 zen-primary-btn text-white text-lg font-semibold shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Start Your Journey
                  <span className="text-xl">🚀</span>
                </span>
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-[#C7CEEA]/30"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-5 bg-white/60 text-[#78716C] font-medium rounded-full">or</span>
              </div>
            </div>

            {/* Sign In Link */}
            <p className="text-center text-[#78716C] font-medium">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-[#44403C] font-bold hover:text-[#FF9AA2] transition-colors underline underline-offset-4"
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
                className="h-16 rounded-2xl border-2 border-white/50 bg-white/50 zen-input text-[#44403C] placeholder:text-[#A8A29E] text-lg px-6 font-medium shadow-sm"
                disabled={isSubmitting}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-2 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-16 rounded-2xl border-2 border-white/50 bg-white/50 zen-input text-[#44403C] placeholder:text-[#A8A29E] text-lg px-6 pr-14 font-medium shadow-sm"
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl hover:bg-[#C7CEEA]/20 flex items-center justify-center text-[#A8A29E] hover:text-[#44403C] transition-all"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.password && (
                <p className="text-sm text-red-500 mt-2 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full h-16 zen-primary-btn text-white text-lg font-semibold shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <span className="text-xl">→</span>
                </span>
              )}
            </Button>

            {/* Back Link */}
            <p className="text-center">
              <button
                type="button"
                onClick={() => setMode("welcome")}
                className="text-[#44403C] font-bold hover:text-[#FF9AA2] transition-colors underline underline-offset-4"
              >
                ← Back to welcome
              </button>
            </p>
          </form>
        )}

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

export default Auth;