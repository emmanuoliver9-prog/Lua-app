export type CyclePhase = "menstrual" | "follicular" | "ovulation" | "luteal" | "pms";
export type FlowLevel = "none" | "light" | "medium" | "heavy";
export type MoodLevel = 1 | 2 | 3 | 4 | 5;
export type EnergyLevel = 1 | 2 | 3 | 4 | 5;
export type PersonalityTrait =
  | "sensitive"
  | "introverted"
  | "extroverted"
  | "romantic"
  | "caring"
  | "adventurous"
  | "independent"
  | "anxious"
  | "calm"
  | "intense";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  birthdate?: string;
  cycleLength: number;
  periodLength: number;
  lastPeriodDate?: string;
  personality: PersonalityTrait[];
  partnerCode: string;
  partnerId?: string;
  joinedAt: string;
}

export interface Partner {
  id: string;
  name: string;
  avatar?: string;
  mood?: MoodLevel;
  moodNote?: string;
  lastActive?: string;
  cyclePhase?: CyclePhase;
}

export type Symptom =
  | "cramps"
  | "headache"
  | "bloating"
  | "fatigue"
  | "nausea"
  | "breast_tenderness"
  | "acne"
  | "mood_swings"
  | "insomnia"
  | "appetite"
  | "anxiety"
  | "stress"
  | "libido_low"
  | "libido_high"
  | "backache"
  | "spotting";

export interface DayLog {
  date: string;
  flow: FlowLevel;
  symptoms: Symptom[];
  mood: MoodLevel;
  energy: EnergyLevel;
  notes: string;
  sleep: number;
}

export interface CycleData {
  lastPeriodDate: string;
  cycleLength: number;
  periodLength: number;
  logs: Record<string, DayLog>;
}

export interface CyclePrediction {
  currentPhase: CyclePhase;
  dayOfCycle: number;
  daysUntilPeriod: number;
  nextPeriodDate: string;
  ovulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  pmsStart: string;
  cycleProgress: number;
}

export interface Memory {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
  type: "photo" | "note" | "milestone" | "anniversary";
  isFavorite: boolean;
}

export interface SpecialDate {
  id: string;
  name: string;
  date: string;
  type: "anniversary" | "birthday" | "firstDate" | "trip" | "custom";
  icon: string;
  notes?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  xp: number;
}

export interface Place {
  id: string;
  name: string;
  type: "restaurant" | "cafe" | "cinema" | "park" | "bar" | "spa" | "other";
  description: string;
  distance: string;
  rating: number;
  tags: string[];
  phase: CyclePhase[];
  image?: string;
  mapsUrl?: string;
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: "restaurant" | "activity" | "movie" | "music" | "tip" | "care";
  icon: string;
  phase: CyclePhase;
}

export interface MoodEntry {
  date: string;
  mood: MoodLevel;
  note?: string;
  partnerMood?: MoodLevel;
}

export interface CoupleStats {
  daysTogether: number;
  connectionStreak: number;
  syncScore: number;
  totalMemories: number;
  xp: number;
  level: number;
}
