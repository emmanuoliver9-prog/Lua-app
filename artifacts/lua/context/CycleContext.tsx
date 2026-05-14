import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { loadData, saveData, StorageKeys } from "@/utils/storage";
import { computePrediction, today } from "@/utils/cycle";
import type { CycleData, CyclePrediction, DayLog, EnergyLevel, FlowLevel, MoodLevel, Symptom } from "@/types";

interface CycleContextValue {
  cycleData: CycleData;
  prediction: CyclePrediction | null;
  isLoading: boolean;
  logDay: (date: string, log: Partial<DayLog>) => Promise<void>;
  getDayLog: (date: string) => DayLog | null;
  updateCycleSettings: (lastPeriod: string, cycleLength: number, periodLength: number) => Promise<void>;
  startPeriod: (date?: string) => Promise<void>;
}

const DEFAULT_CYCLE: CycleData = {
  lastPeriodDate: (() => {
    const d = new Date();
    d.setDate(d.getDate() - 12);
    return d.toISOString().split("T")[0];
  })(),
  cycleLength: 28,
  periodLength: 5,
  logs: {},
};

const CycleContext = createContext<CycleContextValue | null>(null);

export function CycleProvider({ children }: { children: React.ReactNode }) {
  const [cycleData, setCycleData] = useState<CycleData>(DEFAULT_CYCLE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await loadData<CycleData>(StorageKeys.CYCLE);
      if (saved) setCycleData(saved);
      setIsLoading(false);
    })();
  }, []);

  const persist = useCallback(async (data: CycleData) => {
    await saveData(StorageKeys.CYCLE, data);
  }, []);

  const logDay = useCallback(
    async (date: string, log: Partial<DayLog>) => {
      const existing = cycleData.logs[date] ?? {
        date,
        flow: "none" as FlowLevel,
        symptoms: [] as Symptom[],
        mood: 3 as MoodLevel,
        energy: 3 as EnergyLevel,
        notes: "",
        sleep: 7,
      };
      const updated: CycleData = {
        ...cycleData,
        logs: {
          ...cycleData.logs,
          [date]: { ...existing, ...log, date },
        },
      };
      setCycleData(updated);
      await persist(updated);
    },
    [cycleData, persist]
  );

  const getDayLog = useCallback(
    (date: string): DayLog | null => cycleData.logs[date] ?? null,
    [cycleData]
  );

  const updateCycleSettings = useCallback(
    async (lastPeriod: string, cycleLength: number, periodLength: number) => {
      const updated: CycleData = { ...cycleData, lastPeriodDate: lastPeriod, cycleLength, periodLength };
      setCycleData(updated);
      await persist(updated);
    },
    [cycleData, persist]
  );

  const startPeriod = useCallback(
    async (date?: string) => {
      const d = date ?? today();
      const updated: CycleData = { ...cycleData, lastPeriodDate: d };
      setCycleData(updated);
      await persist(updated);
    },
    [cycleData, persist]
  );

  const prediction = isLoading
    ? null
    : computePrediction(
        cycleData.lastPeriodDate,
        cycleData.cycleLength,
        cycleData.periodLength
      );

  return (
    <CycleContext.Provider
      value={{ cycleData, prediction, isLoading, logDay, getDayLog, updateCycleSettings, startPeriod }}
    >
      {children}
    </CycleContext.Provider>
  );
}

export function useCycle() {
  const ctx = useContext(CycleContext);
  if (!ctx) throw new Error("useCycle must be used inside CycleProvider");
  return ctx;
}
