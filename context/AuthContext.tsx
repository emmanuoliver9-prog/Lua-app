import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { loadData, removeData, saveData, StorageKeys } from "@/utils/storage";
import type { Partner, PersonalityTrait, User } from "@/types";

interface AuthContextValue {
  user: User | null;
  partner: Partner | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<User>) => Promise<void>;
  connectPartner: (code: string) => Promise<boolean>;
  disconnectPartner: () => Promise<void>;
  updatePartnerMood: (mood: number) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

function generatePartnerCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const MOCK_PARTNER: Partner = {
  id: "partner-1",
  name: "Ana",
  mood: 4,
  moodNote: "Sentindo-me bem hoje!",
  lastActive: new Date().toISOString(),
  cyclePhase: "follicular",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await loadData<User>(StorageKeys.USER);
      if (saved) {
        setUser(saved);
        if (saved.partnerId) {
          setPartner(MOCK_PARTNER);
        }
      }
      setIsLoading(false);
    })();
  }, []);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    const existing = await loadData<User>(StorageKeys.USER);
    if (existing && existing.email === email) {
      setUser(existing);
      if (existing.partnerId) setPartner(MOCK_PARTNER);
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string): Promise<boolean> => {
    const newUser: User = {
      id: generateId(),
      name,
      email,
      cycleLength: 28,
      periodLength: 5,
      personality: ["romantic", "caring"] as PersonalityTrait[],
      partnerCode: generatePartnerCode(),
      joinedAt: new Date().toISOString(),
    };
    await saveData(StorageKeys.USER, newUser);
    setUser(newUser);
    return true;
  }, []);

  const logout = useCallback(async () => {
    await removeData(StorageKeys.USER);
    setUser(null);
    setPartner(null);
  }, []);

  const updateProfile = useCallback(async (patch: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...patch };
    await saveData(StorageKeys.USER, updated);
    setUser(updated);
  }, [user]);

  const connectPartner = useCallback(async (_code: string): Promise<boolean> => {
    if (!user) return false;
    const updated = { ...user, partnerId: "partner-1" };
    await saveData(StorageKeys.USER, updated);
    setUser(updated);
    setPartner(MOCK_PARTNER);
    return true;
  }, [user]);

  const disconnectPartner = useCallback(async () => {
    if (!user) return;
    const updated = { ...user, partnerId: undefined };
    await saveData(StorageKeys.USER, updated);
    setUser(updated);
    setPartner(null);
  }, [user]);

  const updatePartnerMood = useCallback((mood: number) => {
    if (!partner) return;
    setPartner({ ...partner, mood: mood as Partner["mood"] });
  }, [partner]);

  return (
    <AuthContext.Provider
      value={{
        user,
        partner,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        connectPartner,
        disconnectPartner,
        updatePartnerMood,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
