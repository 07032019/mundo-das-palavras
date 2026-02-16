
import React, { useState, useEffect, useCallback } from 'react';
import { WordItem, Language, AppSettings } from '../../types';
import { WORDS, MODULES } from '../../constants';
import { speakWord, speakGuided, speakFeedback, playUISound, prefetchAudio } from '../../services/geminiService';

interface AssociationGameProps {
  moduleId: string;
  language: Language;
  settings: AppSettings;
  onFinish: (score: number, learnedIds: string[]) => void;
  onBack: () => void;
}

const AssociationGame: React.FC<AssociationGameProps> = ({ moduleId, language, settings, onFinish, onBack }) => {
  const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
  const [options, setOptions] = useState<WordItem[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [rounds, setRounds] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [learnedDuringSession] = useState<Set<string>>(new Set());

  const module = MODULES.find(m => m.id === moduleId);
  const moduleWords = WORDS.filter(w => module?.words.includes(w.id));
  const maxRounds = moduleWords.length;

  const nextRound = useCallback(() => {
    if (rounds >= maxRounds) {
      onFinish(rounds * 10, Array.from(learnedDuringSession));
      return;
    }

    const target = moduleWords[rounds];
    const otherWords = WORDS.filter(w => w.id !== target.id).sort(() => 0.5 - Math.random()).slice(0, 2);
    const opts = [target, ...otherWords].sort(() => 0.5 - Math.random());

    setCurrentWord(target);
    setOptions(opts);
    setFeedback(null);
    setRounds(prev => prev + 1);

    setTimeout(() => {
      speakWord(target.translations[language], language, settings.audioSpeed);
      if (rounds + 1 < maxRounds) {
        const nextTarget = moduleWords[rounds + 1];
        if (nextTarget) {
          prefetchAudio(nextTarget.translations[language], language);
        }
      }
    }, 500);
  }, [rounds, language, settings.audioSpeed, onFinish, moduleWords, maxRounds, learnedDuringSession]);

  useEffect(() => {
    nextRound();
  }, []);

  const handleChoice = async (word: WordItem) => {
    if (feedback) return;

    if (word.id === currentWord?.id) {
      setFeedback('correct');
      learnedDuringSession.add(word.id);
      playUISound('success', settings.enableSounds);
      await speakFeedback(language);
      setTimeout(nextRound, 1500);
    } else {
      setFeedback('wrong');
      playUISound('pop', settings.enableSounds);
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const handleGuided = async () => {
    if (!currentWord || isSpeaking) return;
    setIsSpeaking(true);
    await speakGuided(currentWord.translations[language], language);
    setIsSpeaking(false);
  };

  if (!currentWord) return null;

  return (
    <div className="space-y-12 animate-fade-in text-center max-w-4xl mx-auto px-4">
      {/* Header Previsível */}
      <div className="flex justify-between items-center bg-white/90 backdrop-blur p-5 rounded-[2rem] shadow-sm border border-white">
        <button onClick={onBack} className="p-3 text-slate-400 hover:text-blue-500 transition-colors bg-slate-50 rounded-2xl active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <div className="font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full text-sm">Palavra {rounds} de {maxRounds}</div>
        <div className="flex gap-2">
          <button
            onClick={() => speakWord(currentWord.translations[language], language, settings.audioSpeed)}
            className="p-4 bg-blue-100 text-blue-700 rounded-2xl hover:bg-blue-200 transition-all active:scale-95 shadow-sm"
          >
            🔊
          </button>
          <button
            onClick={handleGuided}
            className={`p-4 rounded-2xl transition-all flex items-center gap-1 active:scale-95 shadow-sm ${isSpeaking ? 'bg-orange-300 text-orange-900' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
          >
            <span className="text-xs font-bold">🐢 Escuta</span>
          </button>
        </div>
      </div>

      {/* Espaço em Branco e Layout Limpo */}
      <div className={`${settings.calmMode ? 'bg-slate-100/50' : 'bg-blue-100/50'} py-16 px-8 rounded-[4rem] border-8 border-white shadow-inner relative overflow-hidden transition-colors`}>
        <h2 className={`text-6xl font-bold ${settings.calmMode ? 'text-slate-700' : 'text-blue-800'} mb-6 ${settings.calmMode || !settings.enableAnimations ? '' : 'animate-bounce-slow'}`}>
          {currentWord.translations[language]}
        </h2>
        <p className="text-slate-400 text-lg font-medium">Toque na imagem correta</p>

        {isSpeaking && settings.enableAnimations && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleChoice(opt)}
            className={`relative group bg-white p-5 rounded-[3.5rem] shadow-lg border-[10px] transition-all overflow-hidden active:scale-95 ${feedback === 'correct' && opt.id === currentWord.id ? 'border-green-400 scale-105' :
              feedback === 'wrong' && opt.id === opt.id ? 'border-red-100 opacity-80' : 'border-transparent'
              } ${feedback === 'wrong' && opt.id !== currentWord.id ? 'opacity-40' : ''}`}
          >
            <img src={opt.imageUrl} alt="opção" className="w-full aspect-square object-cover rounded-[2.5rem]" />
            {feedback === 'correct' && opt.id === currentWord.id && settings.enableAnimations && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-sm">
                <span className="text-8xl animate-bounce">⭐</span>
              </div>
            )}
            {feedback === 'correct' && opt.id === currentWord.id && (!settings.enableAnimations || settings.calmMode) && (
              <div className="absolute inset-0 bg-slate-400/20 flex items-center justify-center">
                <span className="text-6xl">✅</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AssociationGame;
