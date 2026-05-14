export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 22,
  xxl: 28,
  display: 38,
};

export const fontWeights = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

export const shadows = {
  soft: {
    shadowColor: "#C084FC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  glow: {
    shadowColor: "#C084FC",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const phaseNames: Record<string, string> = {
  menstrual: "Fase Menstrual",
  follicular: "Fase Folicular",
  ovulation: "Ovulação",
  luteal: "Fase Lútea",
  pms: "TPM",
};

export const phaseEmotions: Record<string, string> = {
  menstrual: "Tempo de descanso e autocuidado",
  follicular: "Energia crescente e criatividade",
  ovulation: "Pico de energia e sociabilidade",
  luteal: "Introspecção e cuidado",
  pms: "Sensibilidade e atenção especial",
};

export const moodLabels: Record<number, string> = {
  1: "Muito mal",
  2: "Mal",
  3: "Neutro",
  4: "Bem",
  5: "Ótimo",
};

export const moodColors: Record<number, string> = {
  1: "#EF4444",
  2: "#F97316",
  3: "#FBBF24",
  4: "#84CC16",
  5: "#22C55E",
};

export const symptomLabels: Record<string, string> = {
  cramps: "Cólicas",
  headache: "Dor de cabeça",
  bloating: "Inchaço",
  fatigue: "Cansaço",
  nausea: "Náusea",
  breast_tenderness: "Sensibilidade",
  acne: "Acne",
  mood_swings: "Oscilações de humor",
  insomnia: "Insônia",
  appetite: "Apetite alterado",
  anxiety: "Ansiedade",
  stress: "Estresse",
  libido_low: "Libido baixa",
  libido_high: "Libido alta",
  backache: "Dor nas costas",
  spotting: "Sangramento leve",
};

export const LEVELS = [
  { level: 1, name: "Lua Nova", xpRequired: 0, color: "#9CA3AF" },
  { level: 2, name: "Crescente", xpRequired: 100, color: "#A78BFA" },
  { level: 3, name: "Lua Cheia", xpRequired: 300, color: "#C084FC" },
  { level: 4, name: "Estrelas", xpRequired: 600, color: "#FBBF24" },
  { level: 5, name: "Cosmos", xpRequired: 1000, color: "#F9A8D4" },
];
