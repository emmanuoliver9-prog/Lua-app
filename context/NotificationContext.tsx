import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";
import { loadData, saveData } from "@/utils/storage";
import { scheduleAllNotifications, cancelAll } from "@/utils/notifications";

const NOTIF_PREFS_KEY = "@lua/notif_prefs";

export interface NotifPrefs {
  mood: boolean;
  pms: boolean;
  period: boolean;
  partner: boolean;
  ovulation: boolean;
  hasPermission: boolean;
}

const DEFAULT_PREFS: NotifPrefs = {
  mood: true,
  pms: true,
  period: true,
  partner: true,
  ovulation: true,
  hasPermission: false,
};

interface NotificationContextValue {
  prefs: NotifPrefs;
  isLoading: boolean;
  updatePref: (key: keyof NotifPrefs, value: boolean) => Promise<void>;
  rescheduleAll: (opts: { pmsStartDate: string; nextPeriodDate: string; ovulationDate: string }) => Promise<void>;
  requestAndSchedule: (opts: { pmsStartDate: string; nextPeriodDate: string; ovulationDate: string }) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<NotifPrefs>(DEFAULT_PREFS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await loadData<NotifPrefs>(NOTIF_PREFS_KEY);
      if (saved) setPrefs(saved);
      setIsLoading(false);
    })();
  }, []);

  const persist = useCallback(async (p: NotifPrefs) => {
    await saveData(NOTIF_PREFS_KEY, p);
  }, []);

  const updatePref = useCallback(async (key: keyof NotifPrefs, value: boolean) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    await persist(updated);
  }, [prefs, persist]);

  const rescheduleAll = useCallback(async (opts: {
    pmsStartDate: string;
    nextPeriodDate: string;
    ovulationDate: string;
  }) => {
    if (Platform.OS === "web" || !prefs.hasPermission) return;
    await scheduleAllNotifications({ ...prefs, ...opts });
  }, [prefs]);

  const requestAndSchedule = useCallback(async (opts: {
    pmsStartDate: string;
    nextPeriodDate: string;
    ovulationDate: string;
  }): Promise<boolean> => {
    if (Platform.OS === "web") return false;
    const ok = await scheduleAllNotifications({ ...prefs, ...opts });
    if (ok) {
      const updated = { ...prefs, hasPermission: true };
      setPrefs(updated);
      await persist(updated);
    }
    return ok;
  }, [prefs, persist]);

  return (
    <NotificationContext.Provider value={{ prefs, isLoading, updatePref, rescheduleAll, requestAndSchedule }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be inside NotificationProvider");
  return ctx;
}
