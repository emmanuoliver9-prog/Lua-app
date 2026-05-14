import type { CyclePhase, CyclePrediction } from "@/types";

export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export function diffDays(dateA: string, dateB: string): number {
  const a = new Date(dateA);
  const b = new Date(dateB);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export function today(): string {
  return new Date().toISOString().split("T")[0];
}

export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", options ?? { day: "numeric", month: "long" });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function isToday(dateStr: string): boolean {
  return dateStr === today();
}

export function isFuture(dateStr: string): boolean {
  return dateStr > today();
}

export function isPast(dateStr: string): boolean {
  return dateStr < today();
}

export function computePrediction(
  lastPeriodDate: string,
  cycleLength: number,
  periodLength: number
): CyclePrediction {
  const todayStr = today();
  const dayOfCycle = diffDays(lastPeriodDate, todayStr) + 1;

  const normalizedDay = ((dayOfCycle - 1) % cycleLength) + 1;

  const cyclesElapsed = Math.floor((dayOfCycle - 1) / cycleLength);
  const currentCycleStart = addDays(lastPeriodDate, cyclesElapsed * cycleLength);
  const nextPeriodDate = addDays(currentCycleStart, cycleLength);

  const ovulationDate = addDays(currentCycleStart, cycleLength - 14);
  const fertileWindowStart = addDays(ovulationDate, -5);
  const fertileWindowEnd = addDays(ovulationDate, 1);
  const pmsStart = addDays(nextPeriodDate, -5);

  const daysUntilPeriod = diffDays(todayStr, nextPeriodDate);

  let currentPhase: CyclePhase;
  if (normalizedDay <= periodLength) {
    currentPhase = "menstrual";
  } else if (todayStr >= pmsStart) {
    currentPhase = "pms";
  } else if (todayStr >= fertileWindowStart && todayStr <= fertileWindowEnd) {
    currentPhase = "ovulation";
  } else if (normalizedDay <= cycleLength / 2) {
    currentPhase = "follicular";
  } else {
    currentPhase = "luteal";
  }

  const cycleProgress = Math.min((normalizedDay / cycleLength) * 100, 100);

  return {
    currentPhase,
    dayOfCycle: normalizedDay,
    daysUntilPeriod: Math.max(0, daysUntilPeriod),
    nextPeriodDate,
    ovulationDate,
    fertileWindowStart,
    fertileWindowEnd,
    pmsStart,
    cycleProgress,
  };
}

export function getPhaseColor(phase: CyclePhase): string {
  const map: Record<CyclePhase, string> = {
    menstrual: "#F87171",
    follicular: "#FB923C",
    ovulation: "#FBBF24",
    luteal: "#A78BFA",
    pms: "#F472B6",
  };
  return map[phase];
}

export function getDayPhase(
  dateStr: string,
  lastPeriodDate: string,
  cycleLength: number,
  periodLength: number
): CyclePhase | null {
  if (dateStr < lastPeriodDate) return null;
  const dayOfCycle = (diffDays(lastPeriodDate, dateStr) % cycleLength) + 1;
  if (dayOfCycle <= periodLength) return "menstrual";
  if (dayOfCycle <= cycleLength / 2) return "follicular";
  if (dayOfCycle <= cycleLength / 2 + 2) return "ovulation";
  if (dayOfCycle >= cycleLength - 4) return "pms";
  return "luteal";
}

export function generateCalendarDays(year: number, month: number): string[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: string[] = [];
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    days.push(dateStr);
  }
  return days;
}

export function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function getMonthName(month: number): string {
  const names = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  return names[month];
}
