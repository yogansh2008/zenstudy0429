import { useState } from "react";
import { Settings, User, Bell, Palette, Volume2, Moon, Sun, Globe, Shield, HelpCircle, Briefcase, Loader2 } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useNavigationSound } from "@/hooks/useNavigationSound";
import { useCareerPreferences, CareerPreferencesData } from "@/hooks/useCareerPreferences";
import { useAuth } from "@/hooks/useAuth";
import { CareerPreferences } from "./CareerPreferences";

export const SettingsContent = () => {
  const [notifications, setNotifications] = useState(true);
  const { isDark, toggleTheme } = useTheme();
  const { isSoundEnabled, setSoundEnabled } = useNavigationSound();
  const [sound, setSound] = useState(isSoundEnabled());
  const [autoplay, setAutoplay] = useState(true);
  const [showCareerModal, setShowCareerModal] = useState(false);
  const { careerData, isLoading: careerLoading, savePreferences } = useCareerPreferences();
  const { user } = useAuth();

  const handleSoundToggle = () => {
    const newValue = !sound;
    setSound(newValue);
    setSoundEnabled(newValue);
  };

  const handleCareerSave = async (data: CareerPreferencesData) => {
    await savePreferences(data);
  };

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-12 h-6 rounded-full transition-colors relative ${
        enabled ? "bg-primary" : "bg-muted"
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
          enabled ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );

  const SettingItem = ({
    icon: Icon,
    label,
    description,
    children,
  }: {
    icon: React.ElementType;
    label: string;
    description: string;
    children?: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-medium text-foreground">{label}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
        <Settings className="w-7 h-7 text-primary" />
        Settings
      </h2>

      {/* Profile Section */}
      <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in">
        <h3 className="text-lg font-semibold text-foreground mb-4">Profile</h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground text-lg">Student</h4>
            <p className="text-muted-foreground">student@example.com</p>
          </div>
        </div>
        <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
          Edit Profile
        </button>
      </div>

      {/* Career Preferences */}
      <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in stagger-1">
        <h3 className="text-lg font-semibold text-foreground mb-4">Career Preferences</h3>
        
        {!user ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">
                Sign in to save your career preferences
              </p>
            </div>
          </div>
        ) : careerLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : careerData ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {careerData.fields.map((field) => (
                <span key={field} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium capitalize">
                  {field}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Goals: {careerData.goals.join(", ")}
            </p>
            <p className="text-sm text-muted-foreground capitalize">
              Level: {careerData.experienceLevel.replace("-", " ")}
            </p>
            <button 
              onClick={() => setShowCareerModal(true)}
              className="mt-2 px-4 py-2 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors"
            >
              Update Preferences
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">
                Set your career goals to get personalized recommendations
              </p>
            </div>
            <button 
              onClick={() => setShowCareerModal(true)}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Set Up
            </button>
          </div>
        )}
      </div>

      {/* Preferences */}
      <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in stagger-2">
        <h3 className="text-lg font-semibold text-foreground mb-2">Preferences</h3>
        
        <SettingItem
          icon={Bell}
          label="Notifications"
          description="Receive study reminders and updates"
        >
          <ToggleSwitch enabled={notifications} onChange={() => setNotifications(!notifications)} />
        </SettingItem>

        <SettingItem
          icon={isDark ? Moon : Sun}
          label="Dark Mode"
          description="Switch between light and dark theme"
        >
          <ToggleSwitch enabled={isDark} onChange={toggleTheme} />
        </SettingItem>

        <SettingItem
          icon={Volume2}
          label="Navigation Sounds"
          description="Play sounds when navigating"
        >
          <ToggleSwitch enabled={sound} onChange={handleSoundToggle} />
        </SettingItem>

        <SettingItem
          icon={Palette}
          label="Autoplay Videos"
          description="Automatically play next video"
        >
          <ToggleSwitch enabled={autoplay} onChange={() => setAutoplay(!autoplay)} />
        </SettingItem>
      </div>

      {/* Other Settings */}
      <div className="glass rounded-2xl p-6 opacity-0 animate-fade-in stagger-3">
        <h3 className="text-lg font-semibold text-foreground mb-2">More</h3>
        
        <SettingItem
          icon={Globe}
          label="Language"
          description="Choose your preferred language"
        >
          <select className="px-3 py-2 rounded-lg bg-muted text-foreground border-none outline-none">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </SettingItem>

        <SettingItem
          icon={Shield}
          label="Privacy"
          description="Manage your privacy settings"
        >
          <button className="text-primary hover:underline text-sm font-medium">
            Manage →
          </button>
        </SettingItem>

        <SettingItem
          icon={HelpCircle}
          label="Help & Support"
          description="Get help or send feedback"
        >
          <button className="text-primary hover:underline text-sm font-medium">
            Contact →
          </button>
        </SettingItem>
      </div>

      {/* Career Preferences Modal */}
      <CareerPreferences
        isOpen={showCareerModal}
        onClose={() => setShowCareerModal(false)}
        onSave={handleCareerSave}
        initialData={careerData || undefined}
      />
    </div>
  );
};
