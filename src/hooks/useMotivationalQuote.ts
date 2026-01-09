import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StoredQuote {
  quote: string;
  timestamp: number;
}

const QUOTE_STORAGE_KEY = "zenstudy_motivational_quote";
const QUOTE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export const useMotivationalQuote = () => {
  const [quote, setQuote] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if stored quote is still valid (less than 10 minutes old)
  const getStoredQuote = useCallback((): StoredQuote | null => {
    try {
      const stored = localStorage.getItem(QUOTE_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore parse errors
    }
    return null;
  }, []);

  const isQuoteValid = useCallback((storedQuote: StoredQuote | null): boolean => {
    if (!storedQuote) return false;
    const elapsed = Date.now() - storedQuote.timestamp;
    return elapsed < QUOTE_DURATION_MS;
  }, []);

  const saveQuote = useCallback((newQuote: string) => {
    const data: StoredQuote = {
      quote: newQuote,
      timestamp: Date.now(),
    };
    localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(data));
    setQuote(newQuote);
  }, []);

  const fetchNewQuote = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-notes', {
        body: {
          action: 'motivation',
          habitData: {
            habits: [],
            skippedToday: [],
            currentDay: new Date().getDate(),
            requestType: 'quote_only'
          }
        }
      });

      if (error) throw error;
      
      if (data?.result) {
        saveQuote(data.result);
        return data.result;
      }
    } catch (error) {
      console.error("Quote fetch error:", error);
      // Fallback quote
      const fallback = "Small steps every day lead to big results. Keep going! ✨";
      saveQuote(fallback);
      return fallback;
    } finally {
      setIsLoading(false);
    }
  }, [saveQuote]);

  // Initialize quote on mount - reuse if valid, fetch if expired
  const initializeQuote = useCallback(async () => {
    const stored = getStoredQuote();
    if (isQuoteValid(stored)) {
      setQuote(stored!.quote);
    } else {
      await fetchNewQuote();
    }
  }, [getStoredQuote, isQuoteValid, fetchNewQuote]);

  // Force change quote (user action)
  const changeQuote = useCallback(async () => {
    await fetchNewQuote();
  }, [fetchNewQuote]);

  // Get time remaining until quote can auto-refresh (in seconds)
  const getTimeRemaining = useCallback((): number => {
    const stored = getStoredQuote();
    if (!stored) return 0;
    const elapsed = Date.now() - stored.timestamp;
    const remaining = Math.max(0, QUOTE_DURATION_MS - elapsed);
    return Math.ceil(remaining / 1000);
  }, [getStoredQuote]);

  useEffect(() => {
    initializeQuote();
  }, [initializeQuote]);

  return {
    quote,
    isLoading,
    changeQuote,
    getTimeRemaining,
    isQuoteValid: isQuoteValid(getStoredQuote()),
  };
};
