import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { loadData, saveData, StorageKeys } from "@/utils/storage";

interface AppContextValue {
  hasSeenOnboarding: boolean;
  isPremium: boolean;
  isLoading: boolean;
  completeOnboarding: () => void;
  unlockPremium: () => void;
  totalXP: number;
  level: number;
  addXP: (amount: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

interface Settings {
  hasSeenOnboarding: boolean;
  isPremium: boolean;
  totalXP: number;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const settings = await loadData<Settings>(StorageKeys.SETTINGS);
      if (settings) {
        setHasSeenOnboarding(settings.hasSeenOnboarding ?? false);
        setIsPremium(settings.isPremium ?? false);
        setTotalXP(settings.totalXP ?? 0);
      }
      setIsLoading(false);
    })();
  }, []);

  const persistSettings = useCallback(
    async (patch: Partial<Settings>) => {
      const updated: Settings = {
        hasSeenOnboarding,
        isPremium,
        totalXP,
        ...patch,
      };
      await saveData(StorageKeys.SETTINGS, updated);
    },
    [hasSeenOnboarding, isPremium, totalXP]
  );

  const completeOnboarding = useCallback(() => {
    setHasSeenOnboarding(true);
    persistSettings({ hasSeenOnboarding: true });
  }, [persistSettings]);

  const unlockPremium = useCallback(() => {
    setIsPremium(true);
    persistSettings({ isPremium: true });
  }, [persistSettings]);

  const addXP = useCallback(
    (amount: number) => {
      const newXP = totalXP + amount;
      setTotalXP(newXP);
      persistSettings({ totalXP: newXP });
    },
    [totalXP, persistSettings]
  );

  const level = totalXP >= 1000 ? 5 : totalXP >= 600 ? 4 : totalXP >= 300 ? 3 : totalXP >= 100 ? 2 : 1;

  return (
    <AppContext.Provider
      value={{
        hasSeenOnboarding,
        isPremium,
        isLoading,
        completeOnboarding,
        unlockPremium,
        totalXP,
        level,
        addXP,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
