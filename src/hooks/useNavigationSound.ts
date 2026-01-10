import { useCallback, useRef } from "react";

const NAVIGATION_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3";

export const useNavigationSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playNavigationSound = useCallback(() => {
    const enabled = localStorage.getItem("navigationSound") !== "false";
    if (!enabled) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(NAVIGATION_SOUND_URL);
      audioRef.current.volume = 0.3;
    }
    
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      // Audio play failed, likely due to autoplay policy
    });
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    localStorage.setItem("navigationSound", enabled ? "true" : "false");
  }, []);

  const isSoundEnabled = useCallback(() => {
    return localStorage.getItem("navigationSound") !== "false";
  }, []);

  return { playNavigationSound, setSoundEnabled, isSoundEnabled };
};
