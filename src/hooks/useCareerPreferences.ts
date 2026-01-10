import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface CareerPreferencesData {
  fields: string[];
  goals: string[];
  experienceLevel: string;
}

export const useCareerPreferences = () => {
  const { user } = useAuth();
  const [careerData, setCareerData] = useState<CareerPreferencesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPreferences = useCallback(async () => {
    if (!user) {
      setCareerData(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("career_preferences")
        .select("fields, goals, experience_level")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCareerData({
          fields: data.fields || [],
          goals: data.goals || [],
          experienceLevel: data.experience_level || "",
        });
      } else {
        setCareerData(null);
      }
    } catch (error) {
      console.error("Error fetching career preferences:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const savePreferences = async (data: CareerPreferencesData): Promise<boolean> => {
    if (!user) {
      toast.error("Please sign in to save preferences");
      return false;
    }

    try {
      const { error } = await supabase
        .from("career_preferences")
        .upsert(
          {
            user_id: user.id,
            fields: data.fields,
            goals: data.goals,
            experience_level: data.experienceLevel,
          },
          { onConflict: "user_id" }
        );

      if (error) throw error;

      setCareerData(data);
      toast.success("Career preferences saved!");
      return true;
    } catch (error) {
      console.error("Error saving career preferences:", error);
      toast.error("Failed to save preferences");
      return false;
    }
  };

  return {
    careerData,
    isLoading,
    savePreferences,
    refetch: fetchPreferences,
  };
};
