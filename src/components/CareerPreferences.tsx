import { useState } from "react";
import { X, Briefcase, Code, Stethoscope, TrendingUp, Palette, GraduationCap, Building, Rocket, Check } from "lucide-react";

interface CareerPreferencesProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: CareerData) => void;
  initialData?: CareerData;
}

export interface CareerData {
  fields: string[];
  goals: string[];
  experienceLevel: string;
}

const careerFields = [
  { id: "technology", label: "Technology", icon: Code, color: "from-blue-400 to-cyan-400" },
  { id: "healthcare", label: "Healthcare", icon: Stethoscope, color: "from-rose-400 to-pink-400" },
  { id: "business", label: "Business", icon: TrendingUp, color: "from-emerald-400 to-green-400" },
  { id: "creative", label: "Creative & Arts", icon: Palette, color: "from-purple-400 to-violet-400" },
  { id: "education", label: "Education", icon: GraduationCap, color: "from-amber-400 to-orange-400" },
  { id: "finance", label: "Finance", icon: Building, color: "from-slate-400 to-gray-500" },
  { id: "startup", label: "Entrepreneurship", icon: Rocket, color: "from-red-400 to-rose-400" },
  { id: "other", label: "Other", icon: Briefcase, color: "from-indigo-400 to-blue-400" },
];

const learningGoals = [
  "Get a new job",
  "Career change",
  "Skill enhancement",
  "Academic success",
  "Personal growth",
  "Start a business",
  "Get promoted",
  "Freelancing",
];

const experienceLevels = [
  { id: "student", label: "Student" },
  { id: "beginner", label: "Beginner (0-2 years)" },
  { id: "intermediate", label: "Intermediate (2-5 years)" },
  { id: "experienced", label: "Experienced (5+ years)" },
  { id: "expert", label: "Expert / Senior" },
];

export const CareerPreferences = ({ isOpen, onClose, onSave, initialData }: CareerPreferencesProps) => {
  const [selectedFields, setSelectedFields] = useState<string[]>(initialData?.fields || []);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(initialData?.goals || []);
  const [experienceLevel, setExperienceLevel] = useState(initialData?.experienceLevel || "");
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const toggleField = (fieldId: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(f => f !== fieldId)
        : prev.length < 3 ? [...prev, fieldId] : prev
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : prev.length < 3 ? [...prev, goal] : prev
    );
  };

  const handleSave = () => {
    onSave({
      fields: selectedFields,
      goals: selectedGoals,
      experienceLevel,
    });
    onClose();
  };

  const canProceed = () => {
    if (step === 1) return selectedFields.length > 0;
    if (step === 2) return selectedGoals.length > 0;
    if (step === 3) return experienceLevel !== "";
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl mx-4 bg-card rounded-3xl shadow-deep overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-border">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Career Preferences</h2>
              <p className="text-sm text-muted-foreground">Personalize your learning journey</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">What fields interest you?</h3>
                <p className="text-sm text-muted-foreground">Select up to 3 career fields</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {careerFields.map((field) => {
                  const isSelected = selectedFields.includes(field.id);
                  return (
                    <button
                      key={field.id}
                      onClick={() => toggleField(field.id)}
                      className={`
                        relative p-4 rounded-2xl border-2 transition-all duration-200
                        ${isSelected 
                          ? "border-primary bg-primary/10 scale-[1.02]" 
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }
                      `}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${field.color} flex items-center justify-center mb-2`}>
                        <field.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{field.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">What are your learning goals?</h3>
                <p className="text-sm text-muted-foreground">Select up to 3 goals</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {learningGoals.map((goal) => {
                  const isSelected = selectedGoals.includes(goal);
                  return (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={`
                        px-4 py-2.5 rounded-xl border-2 transition-all duration-200 font-medium
                        ${isSelected 
                          ? "border-primary bg-primary text-primary-foreground" 
                          : "border-border text-foreground hover:border-primary/50 hover:bg-muted/50"
                        }
                      `}
                    >
                      {goal}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">What's your experience level?</h3>
                <p className="text-sm text-muted-foreground">This helps us recommend the right content</p>
              </div>
              
              <div className="space-y-2">
                {experienceLevels.map((level) => {
                  const isSelected = experienceLevel === level.id;
                  return (
                    <button
                      key={level.id}
                      onClick={() => setExperienceLevel(level.id)}
                      className={`
                        w-full p-4 rounded-xl border-2 text-left transition-all duration-200
                        ${isSelected 
                          ? "border-primary bg-primary/10" 
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{level.label}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-border flex justify-between">
          <button
            onClick={() => step > 1 && setStep(step - 1)}
            className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${
              step > 1 
                ? "text-foreground hover:bg-muted" 
                : "text-muted-foreground cursor-not-allowed"
            }`}
            disabled={step === 1}
          >
            Back
          </button>
          
          <button
            onClick={() => step < 3 ? setStep(step + 1) : handleSave()}
            disabled={!canProceed()}
            className={`
              px-6 py-2.5 rounded-xl font-medium transition-all
              ${canProceed()
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
              }
            `}
          >
            {step < 3 ? "Continue" : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
};
