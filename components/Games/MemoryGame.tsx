
import React, { useState, useEffect } from 'react';
import { WordItem, Language, AppSettings } from '../../types';
import { WORDS, MODULES } from '../../constants';
import { speakWord, speakFeedback } from '../../services/geminiService';

interface MemoryGameProps {
  moduleId: string;
  language: Language;
  settings: AppSettings;
  onFinish: (score: number, learnedIds: string[]) => void;
  onBack: () => void;
}

interface Card {
  id: string;
  wordId: string;
  type: 'image' | 'text';
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ moduleId, language, settings, onFinish, onBack }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [learnedDuringSession] = useState<Set<string>>(new Set());

  const module = MODULES.find(m => m.id === moduleId);
  const moduleWords = WORDS.filter(w => module?.words.includes(w.id));

  useEffect(() => {
    const gameCards: Card[] = [];

    moduleWords.forEach((word) => {
      gameCards.push({
        id: `${word.id}-img`,
        wordId: word.id,
        type: 'image',
        content: word.imageUrl,
        isFlipped: false,
        isMatched: false
      });
      gameCards.push({
        id: `${word.id}-txt`,
        wordId: word.id,
        type: 'text',
        content: word.translations[language],
        isFlipped: false,
        isMatched: false
      });
    });

    setCards(gameCards.sort(() => 0.5 - Math.random()));
  }, [language, moduleId]);

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newFlipped = [...flipped, index];
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    setFlipped(newFlipped);

    if (newCards[index].type === 'text') {
      speakWord(newCards[index].content, language, settings.audioSpeed);
    } else {
        const word = WORDS.find(w => w.id === newCards[index].wordId);
        if (word) speakWord(word.translations[language], language, settings.audioSpeed);
    }

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].wordId === cards[second].wordId) {
        // Match!
        learnedDuringSession.add(cards[first].wordId);
        setTimeout(async () => {
          const matchedCards = [...newCards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setFlipped([]);
          
          await speakFeedback(language);
          
          setMatches(prev => {
            const next = prev + 1;
            if (next === moduleWords.length) setTimeout(() => onFinish(50, Array.from(learnedDuringSession)), 1000);
            return next;
          });
        }, 800);
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlipped([]);
        }, 1200);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-center">
      <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm">
         <button onClick={onBack} className="p-2 text-slate-500">⬅️ Sair</button>
         <div className="font-bold text-blue-600">Pares: {matches} de {moduleWords.length}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(idx)}
            className={`aspect-square rounded-[1.5rem] shadow-xl transition-all duration-500 transform relative ${
                card.isFlipped || card.isMatched ? '[transform:rotateY(180deg)]' : ''
            }`}
          >
            <div className={`absolute inset-0 ${settings.calmMode ? 'bg-slate-400' : 'bg-blue-500'} rounded-[1.5rem] flex items-center justify-center border-4 border-white ${
                card.isFlipped || card.isMatched ? 'invisible' : 'visible'
            }`}>
              <span className="text-4xl text-white">?</span>
            </div>
            <div className={`absolute inset-0 bg-white rounded-[1.5rem] flex items-center justify-center border-4 border-blue-200 [transform:rotateY(180deg)] ${
                card.isFlipped || card.isMatched ? 'visible' : 'invisible'
            }`}>
              {card.type === 'image' ? (
                <img src={card.content} alt="memoria" className="w-full h-full object-cover rounded-[1.2rem]" />
              ) : (
                <span className="text-xl font-bold px-2">{card.content}</span>
              )}
              {card.isMatched && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-lg z-10">✅</div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
