
import React, { useState, useEffect } from 'react';
import { WordItem, Language, AppSettings, LogicSequence } from '../../types';
import { WORDS, MODULES, LOGIC_SEQUENCES } from '../../constants';
import { speakWord, speakFeedback } from '../../services/geminiService';
import VisualFeedback from '../VisualFeedback';

interface LogicSequenceGameProps {
  moduleId: string;
  language: Language;
  settings: AppSettings;
  onFinish: (score: number) => void;
  onBack: () => void;
}

const LogicSequenceGame: React.FC<LogicSequenceGameProps> = ({ moduleId, language, settings, onFinish, onBack }) => {
  const [currentSequence, setCurrentSequence] = useState<LogicSequence | null>(null);
  const [shuffledParts, setShuffledParts] = useState<{wordId: string, id: string}[]>([]);
  const [userOrder, setUserOrder] = useState<{wordId: string, id: string}[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rounds, setRounds] = useState(0);

  const module = MODULES.find(m => m.id === moduleId);
  const moduleSequences = LOGIC_SEQUENCES.filter(s => module?.sequences?.includes(s.id));
  const maxRounds = moduleSequences.length;

  useEffect(() => {
    if (rounds < maxRounds) {
      const seq = moduleSequences[rounds];
      setCurrentSequence(seq);
      const parts = seq.parts.map((p, i) => ({ wordId: p.wordId, id: `${p.wordId}-${i}` }));
      setShuffledParts([...parts].sort(() => 0.5 - Math.random()));
      setUserOrder([]);
      setIsSuccess(false);
    } else if (rounds > 0) {
      onFinish(rounds * 15);
    }
  }, [rounds, moduleId]);

  const handlePartClick = (part: {wordId: string, id: string}) => {
    if (isSuccess) return;
    
    // Add to user order
    const newUserOrder = [...userOrder, part];
    setUserOrder(newUserOrder);
    
    // Play word sound
    const word = WORDS.find(w => w.id === part.wordId);
    if (word) speakWord(word.translations[language], language, settings.audioSpeed);

    // Filter from shuffled
    setShuffledParts(prev => prev.filter(p => p.id !== part.id));

    // Check if finished
    if (newUserOrder.length === currentSequence?.parts.length) {
      checkResult(newUserOrder);
    }
  };

  const checkResult = async (order: {wordId: string, id: string}[]) => {
    const isCorrect = order.every((p, i) => p.wordId === currentSequence?.parts[i].wordId);
    
    if (isCorrect) {
      setIsSuccess(true);
      await speakFeedback(language);
      if (currentSequence) {
        speakWord(currentSequence.phraseTranslations[language], language, settings.audioSpeed);
      }
      setTimeout(() => {
        setRounds(prev => prev + 1);
      }, 3000);
    } else {
      // Incorrect - soft reset
      setTimeout(() => {
        const parts = currentSequence!.parts.map((p, i) => ({ wordId: p.wordId, id: `${p.wordId}-${i}` }));
        setShuffledParts([...parts].sort(() => 0.5 - Math.random()));
        setUserOrder([]);
      }, 1000);
    }
  };

  const handleUndo = () => {
    if (userOrder.length === 0 || isSuccess) return;
    const last = userOrder[userOrder.length - 1];
    setUserOrder(prev => prev.slice(0, -1));
    setShuffledParts(prev => [...prev, last].sort(() => 0.5 - Math.random()));
  };

  if (!currentSequence) return null;

  return (
    <div className="space-y-12 animate-fade-in text-center max-w-2xl mx-auto">
      <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm">
         <button onClick={onBack} className="p-2 text-slate-500">⬅️ Sair</button>
         <div className="font-bold text-blue-600">Sequência {rounds + 1} de {maxRounds}</div>
         <button onClick={handleUndo} className="p-2 text-orange-500 font-bold" disabled={userOrder.length === 0 || isSuccess}>↩️ Voltar</button>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-700">Ordene a frase:</h2>
        <p className="text-slate-400 italic">Toque nas imagens para colocar na ordem certa</p>
      </div>

      {/* Target Slot Area */}
      <div className="flex justify-center gap-4 min-h-[160px] p-4 bg-slate-100 rounded-[2rem] border-4 border-dashed border-slate-200">
        {userOrder.map((part, i) => {
          const word = WORDS.find(w => w.id === part.wordId);
          return (
            <div key={part.id} className="w-32 animate-fade-in">
              <div className="bg-white p-2 rounded-2xl shadow-md">
                <img src={word?.imageUrl} className="w-full aspect-square object-cover rounded-xl" alt="part" />
                <div className="mt-1 font-bold text-sm truncate">{word?.translations[language]}</div>
              </div>
            </div>
          );
        })}
        {[...Array(Math.max(0, currentSequence.parts.length - userOrder.length))].map((_, i) => (
          <div key={i} className="w-32 h-32 bg-white/50 rounded-2xl"></div>
        ))}
      </div>

      {/* Choice Area */}
      <div className="flex justify-center gap-6 flex-wrap">
        {shuffledParts.map((part) => {
          const word = WORDS.find(w => w.id === part.wordId);
          return (
            <button
              key={part.id}
              onClick={() => handlePartClick(part)}
              className="w-32 bg-white p-3 rounded-[2rem] shadow-lg border-4 border-transparent hover:border-blue-300 hover:scale-105 transition-all"
            >
              <img src={word?.imageUrl} className="w-full aspect-square object-cover rounded-[1.5rem]" alt="choice" />
            </button>
          );
        })}
      </div>

      {isSuccess && (
        <div className="p-6 bg-green-50 rounded-3xl border-4 border-green-200 animate-fade-in">
          <h3 className="text-3xl font-bold text-green-700">{currentSequence.phraseTranslations[language]}</h3>
        </div>
      )}

      {isSuccess && <VisualFeedback type="balloon" />}
    </div>
  );
};

export default LogicSequenceGame;
