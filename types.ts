
export type Language = 'en' | 'es' | 'fr' | 'it' | 'zh' | 'pt';

export interface MascotInfo {
  id: string;
  name: string;
  emoji: string;
  description: string;
  personality: string; // New field for TTS persona
}

export interface LanguageTheme {
  primary: string;
  secondary: string;
  bg: string;
  scenario: string;
  icon: string;
  mascotId: string; // Referência ao ID do mascote padrão
  welcomeMsg: Record<Language, string>;
}

export interface WordItem {
  id: string;
  category: string;
  translations: Record<Language, string>;
  imageUrl: string;
}

export interface LogicSequence {
  id: string;
  phraseTranslations: Record<Language, string>;
  parts: {
    wordId: string;
    order: number;
  }[];
}

export interface Module {
  id: string;
  title: string;
  icon: string;
  words: string[]; // word IDs
  sequences?: string[]; // sequence IDs
}

export interface AppSettings {
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  calmMode: boolean;
  audioSpeed: number;
  enableAnimations: boolean;
  enableSounds: boolean;
  preferredMascotId: string | 'default'; // Permite escolher um mascote global
  enabledRewards: ('stickers' | 'sounds' | 'animations' | 'confetti' | 'fireworks')[];
  themeIntensity: 'soft' | 'normal' | 'vibrant';
}

export interface DailyProgress {
  date: string;
  wordsLearned: number;
  starsEarned: number;
}

export interface UserStats {
  learnedWordIds: string[];
  unlockedStickerIds: string[];
  totalPracticeMinutes: number;
  lastActive: string;
  starsEarned: number;
  history: DailyProgress[];
}

export type Screen = 'landing' | 'language-selector' | 'dashboard' | 'game-association' | 'memory-game' | 'game-repetition' | 'game-logic-sequence' | 'settings' | 'module-overview' | 'game-memory' | 'parent-dashboard' | 'album';

export interface GameState {
  score: number;
  activeLanguage: Language;
  selectedModuleId: string | null;
  stats: UserStats;
}
