
import { WordItem, Language, Module, LogicSequence, LanguageTheme, MascotInfo } from './types';

export const MASCOTS: MascotInfo[] = [
  { id: 'kika', name: 'Kika', emoji: '🦜', description: 'Uma Arara-azul muito alegre.', personality: 'Playful, bright, and encouraging. Speaks with a slightly higher pitch but very clearly. Like a friendly big sister.' },
  { id: 'ollie', name: 'Ollie', emoji: '🦉', description: 'Uma Coruja sábia e paciente.', personality: 'Wise, calm, and slow. Speaks with a deeper, comforting, and steady tone. Like a kind grandparent.' },
  { id: 'tico', name: 'Tico', emoji: '🐢', description: 'Uma Tartaruga calma e amiga.', personality: 'Very slow, relaxed, and gentle. Takes pauses between phrases. Extremely soothing.' },
  { id: 'lulu', name: 'Lulu', emoji: '🐈', description: 'Uma Gatinha carinhosa.', personality: 'Soft, whispery, and sweet. Speaks gently and warmly. Very comforting.' },
  { id: 'pippo', name: 'Pippo', emoji: '🐬', description: 'Um Golfinho brincalhão.', personality: 'Energetic but smooth. Sounds happy and melodic, like singing a little bit.' },
  { id: 'ming', name: 'Ming', emoji: '🐼', description: 'Um Panda muito sereno.', personality: 'Peaceful, zen, and quiet. Speaks with a soft, round tone. Very grounding.' },
  { id: 'duque', name: 'Duque', emoji: '🐕', description: 'Um Cãozinho leal.', personality: 'Loyal, enthusiastic but controlled. Trustworthy and solid tone. Like a best friend.' },
  { id: 'bela', name: 'Bela', emoji: '🦋', description: 'Uma Borboleta mágica.', personality: 'Light, airy, and delicate. Speaks with a high, gentle, fairy-like quality.' },
];

export const LANGUAGE_THEMES: Record<Language, LanguageTheme> = {
  pt: {
    primary: 'bg-blue-500',
    secondary: 'text-blue-600',
    bg: 'bg-blue-50',
    scenario: 'Parque das Pipas',
    icon: '🪁',
    mascotId: 'kika',
    welcomeMsg: { pt: 'Oi! Eu sou a Kika. Vamos brincar no parque?', en: '', es: '', fr: '', it: '', zh: '' }
  },
  en: {
    primary: 'bg-emerald-500',
    secondary: 'text-emerald-600',
    bg: 'bg-emerald-50',
    scenario: 'Floresta Encantada',
    icon: '🌲',
    mascotId: 'ollie',
    welcomeMsg: { en: 'Hello! I am Ollie. Ready for a forest adventure?', pt: '', es: '', fr: '', it: '', zh: '' }
  },
  es: {
    primary: 'bg-amber-500',
    secondary: 'text-amber-600',
    bg: 'bg-amber-50',
    scenario: 'Ilha do Sol',
    icon: '☀️',
    mascotId: 'tico',
    welcomeMsg: { es: '¡Hola! Soy Tico. ¿Buscamos tesoros en la isla?', pt: '', en: '', fr: '', it: '', zh: '' }
  },
  fr: {
    primary: 'bg-purple-500',
    secondary: 'text-purple-600',
    bg: 'bg-purple-50',
    scenario: 'Reino das Estrelas',
    icon: '🏰',
    mascotId: 'lulu',
    welcomeMsg: { fr: 'Bonjour ! Je suis Lulu. On voyage vers les étoiles ?', pt: '', en: '', es: '', it: '', zh: '' }
  },
  it: {
    primary: 'bg-orange-400',
    secondary: 'text-orange-500',
    bg: 'bg-orange-50',
    scenario: 'Vale das Flores',
    icon: '🌻',
    mascotId: 'pippo',
    welcomeMsg: { it: 'Ciao! Sono Pippo. Vuoi scoprire i fiori con me?', pt: '', en: '', es: '', fr: '', zh: '' }
  },
  zh: {
    primary: 'bg-rose-400',
    secondary: 'text-rose-500',
    bg: 'bg-rose-50',
    scenario: 'Jardim dos Pandas',
    icon: '🎋',
    mascotId: 'ming',
    welcomeMsg: { zh: '你好！我是小明。我们一起在花园里散步吧', pt: '', en: '', es: '', fr: '', it: '' }
  },
};

export const LANGUAGES: { code: Language; label: string; flag: string; native: string }[] = [
  { code: 'pt', label: 'Português do Brasil', native: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'Inglês', native: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Espanhol', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Francês', native: 'Français', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', native: 'Italiano', flag: '🇮🇹' },
  { code: 'zh', label: 'Mandarim', native: '普通话', flag: '🇨🇳' },
];

export const WORDS: WordItem[] = [
  {
    id: 'apple',
    category: 'Fruits',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?w=400',
    translations: { en: 'Apple', es: 'Manzana', fr: 'Pomme', it: 'Mela', zh: '苹果', pt: 'Maçã' }
  },
  {
    id: 'banana',
    category: 'Fruits',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ad9902d73647?w=400',
    translations: { en: 'Banana', es: 'Plátano', fr: 'Banane', it: 'Banana', zh: '香蕉', pt: 'Banana' }
  },
  {
    id: 'dog',
    category: 'Animals',
    imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400',
    translations: { en: 'Dog', es: 'Perro', fr: 'Chien', it: 'Cane', zh: '狗', pt: 'Cachorro' }
  },
  {
    id: 'cat',
    category: 'Animals',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
    translations: { en: 'Cat', es: 'Gato', fr: 'Chat', it: 'Gatto', zh: '猫', pt: 'Gato' }
  },
  {
    id: 'sun',
    category: 'Nature',
    imageUrl: 'https://images.unsplash.com/photo-1534840693217-d1714a3b797a?w=400',
    translations: { en: 'Sun', es: 'Sol', fr: 'Soleil', it: 'Sole', zh: '太阳', pt: 'Sol' }
  },
  {
    id: 'house',
    category: 'Objects',
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400',
    translations: { en: 'House', es: 'Casa', fr: 'Maison', it: 'Casa', zh: '房子', pt: 'Casa' }
  },
];

export const LOGIC_SEQUENCES: LogicSequence[] = [
  {
    id: 'sun-house',
    phraseTranslations: {
      pt: 'O sol está na casa',
      en: 'The sun is in the house',
      es: 'El sol está en la casa',
      fr: 'Le soleil est dans la maison',
      it: 'Il sole è nella casa',
      zh: '太阳在房子里'
    },
    parts: [
      { wordId: 'sun', order: 0 },
      { wordId: 'house', order: 1 }
    ]
  },
  {
    id: 'dog-cat',
    phraseTranslations: {
      pt: 'O cachorro e o gato',
      en: 'The dog and the cat',
      es: 'El perro y el gato',
      fr: 'Le chien et le chat',
      it: 'Il cane e il gatto',
      zh: '狗和猫'
    },
    parts: [
      { wordId: 'dog', order: 0 },
      { wordId: 'cat', order: 1 }
    ]
  }
];

export const MODULES: Module[] = [
  {
    id: 'fruits',
    title: 'Frutas Gostosas',
    icon: '🍎',
    words: ['apple', 'banana']
  },
  {
    id: 'animals',
    title: 'Amigos Animais',
    icon: '🐶',
    words: ['dog', 'cat'],
    sequences: ['dog-cat']
  },
  {
    id: 'essentials',
    title: 'Meu Mundo',
    icon: '🏠',
    words: ['sun', 'house'],
    sequences: ['sun-house']
  }
];
