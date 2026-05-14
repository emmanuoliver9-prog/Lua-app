import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  USER: "@lua/user",
  CYCLE: "@lua/cycle",
  MOODS: "@lua/moods",
  MEMORIES: "@lua/memories",
  SPECIAL_DATES: "@lua/special_dates",
  ONBOARDING: "@lua/onboarding",
  SETTINGS: "@lua/settings",
};

export async function saveData<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function loadData<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function removeData(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export const StorageKeys = KEYS;
