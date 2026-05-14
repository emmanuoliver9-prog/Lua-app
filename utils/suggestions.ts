import type { CyclePhase, PersonalityTrait, Suggestion } from "@/types";

interface SuggestionConfig {
  phase: CyclePhase;
  traits: PersonalityTrait[];
  mood: number;
}

const baseSuggestions: Record<CyclePhase, Suggestion[]> = {
  menstrual: [
    { id: "m1", title: "Noite de filmes aconchegantes", description: "Um lugar confortável, cobertor e um filme leve.", category: "movie", icon: "film", phase: "menstrual" },
    { id: "m2", title: "Delivery especial", description: "Peça a comida favorita dela sem que ela precise pedir.", category: "care", icon: "heart", phase: "menstrual" },
    { id: "m3", title: "Bolsa de água quente", description: "Um gesto simples que alivia muito as cólicas.", category: "care", icon: "droplets", phase: "menstrual" },
    { id: "m4", title: "Playlist tranquila", description: "Músicas suaves para relaxar juntos.", category: "music", icon: "music", phase: "menstrual" },
    { id: "m5", title: "Chocolate artesanal", description: "Um presente pequeno com grande significado.", category: "care", icon: "gift", phase: "menstrual" },
  ],
  follicular: [
    { id: "f1", title: "Passeio no parque", description: "Energia renovada — hora de explorar novos lugares.", category: "activity", icon: "map-pin", phase: "follicular" },
    { id: "f2", title: "Novo hobby juntos", description: "Tente algo diferente, como dança ou culinária.", category: "activity", icon: "star", phase: "follicular" },
    { id: "f3", title: "Jantar criativo", description: "Cozinhem juntos algo novo e diferente.", category: "restaurant", icon: "coffee", phase: "follicular" },
    { id: "f4", title: "Fotografia urbana", description: "Saiam para fotografar a cidade juntos.", category: "activity", icon: "camera", phase: "follicular" },
  ],
  ovulation: [
    { id: "o1", title: "Jantar romântico", description: "Reserva em um restaurante especial, ela está radiante.", category: "restaurant", icon: "star", phase: "ovulation" },
    { id: "o2", title: "Sessão de fotos", description: "Momento perfeito para criar memórias visuais.", category: "activity", icon: "camera", phase: "ovulation" },
    { id: "o3", title: "Aventura ao ar livre", description: "Trilha, praia, parque — ela está cheia de energia.", category: "activity", icon: "map-pin", phase: "ovulation" },
    { id: "o4", title: "Surpresa romântica", description: "Flores, cartinha, qualquer gesto espontâneo vale.", category: "care", icon: "heart", phase: "ovulation" },
  ],
  luteal: [
    { id: "l1", title: "Tarde de spa caseiro", description: "Massagem, velas e aromaterapia em casa.", category: "care", icon: "droplets", phase: "luteal" },
    { id: "l2", title: "Leitura compartilhada", description: "Escolham um livro para ler juntos aos poucos.", category: "activity", icon: "book", phase: "luteal" },
    { id: "l3", title: "Música ao vivo", description: "Um show intimista ou playlist favorita.", category: "music", icon: "music", phase: "luteal" },
    { id: "l4", title: "Conversa sem distrações", description: "Desliguem os celulares e conversem de verdade.", category: "tip", icon: "message-circle", phase: "luteal" },
  ],
  pms: [
    { id: "p1", title: "Valide os sentimentos", description: "Escute sem tentar resolver. Presença é tudo.", category: "tip", icon: "heart", phase: "pms" },
    { id: "p2", title: "Evite discussões desnecessárias", description: "Emoções estão intensas — paciência em dobro.", category: "tip", icon: "shield", phase: "pms" },
    { id: "p3", title: "Chocolate e carinho", description: "Simples e poderoso. Demonstre que você se importa.", category: "care", icon: "gift", phase: "pms" },
    { id: "p4", title: "Filme de comédia leve", description: "Rir juntos muda tudo. Escolha algo descontraído.", category: "movie", icon: "film", phase: "pms" },
    { id: "p5", title: "Café aconchegante", description: "Um café gostoso do lado de fora, ambiente tranquilo.", category: "restaurant", icon: "coffee", phase: "pms" },
  ],
};

export function getSuggestions(config: SuggestionConfig): Suggestion[] {
  const phaseSuggestions = baseSuggestions[config.phase] || [];
  return phaseSuggestions.slice(0, 3);
}

export function getDailyTip(phase: CyclePhase, traits: PersonalityTrait[]): string {
  const tips: Record<CyclePhase, string[]> = {
    menstrual: [
      "Hoje é dia de aconchego. Esteja presente, seja gentil.",
      "Ela precisa de descanso. Cuide sem esperar nada em troca.",
      "Um gesto simples pode ser imenso hoje. Seja atencioso.",
    ],
    follicular: [
      "Energia em alta! Proponha algo novo e divertido.",
      "Ela está criativa e animada. Apoie as ideias dela.",
      "Bom momento para planejar algo especial juntos.",
    ],
    ovulation: [
      "Ela está radiante hoje. Mostre o quanto você a admira.",
      "Ótimo momento para um encontro romântico especial.",
      "Expresse seus sentimentos — ela está receptiva.",
    ],
    luteal: [
      "Dê espaço e apoio. Equilíbrio é a chave agora.",
      "Ela pode estar mais introspectiva. Respeite o ritmo.",
      "Conforto e segurança são o que ela mais precisa.",
    ],
    pms: [
      "Paciência e empatia. Os sentimentos são reais e intensos.",
      "Hoje mais do que nunca: escute antes de falar.",
      "Evite críticas. Foque em apoiar e validar.",
    ],
  };
  const list = tips[phase];
  return list[Math.floor(Math.random() * list.length)];
}
