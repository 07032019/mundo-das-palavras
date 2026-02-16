
import React, { useState, useEffect } from 'react';
import { WordItem, Language, AppSettings } from '../../types';
import { WORDS, MODULES } from '../../constants';
import { speakWord, speakGuided, speakFeedback } from '../../services/geminiService';

interface RepetitionGameProps {
  moduleId: string;
  language: Language;
  settings: AppSettings;
  onFinish: (score: number, learnedIds: string[]) => void;
  onBack: () => void;
}

const RepetitionGame: React.FC<RepetitionGameProps> = ({ moduleId, language, settings, onFinish, onBack }) => {
  const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [learnedDuringSession] = useState<Set<string>>(new Set());
  
  const module = MODULES.find(m => m.id === moduleId);
  const moduleWords = WORDS.filter(w => module?.words.includes(w.id));

  useEffect(() => {
    setCurrentWord(moduleWords[wordIndex]);
  }, [wordIndex, moduleId]);

  const handleSpeak = () => {
    if (currentWord) {
      speakWord(currentWord.translations[language], language, settings.audioSpeed);
    }
  };

  const handleGuided = async () => {
    if (!currentWord || isSpeaking) return;
    setIsSpeaking(true);
    await speakGuided(currentWord.translations[language], language);
    setIsSpeaking(false);
  };

  const handleRecord = async () => {
    setIsRecording(true);
    setTimeout(async () => {
      setIsRecording(false);
      if (currentWord) learnedDuringSession.add(currentWord.id);
      await speakFeedback(language);
      
      if (wordIndex + 1 >= moduleWords.length) {
          setTimeout(() => onFinish(30, Array.from(learnedDuringSession)), 1000);
      } else {
          setWordIndex(prev => prev + 1);
      }
    }, 2000);
  };

  if (!currentWord) return null;

  return (
    <div className="space-y-12 animate-fade-in text-center max-w-lg mx-auto">
      <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm">
         <button onClick={onBack} className="p-2 text-slate-500">⬅️ Sair</button>
         <div className="font-bold text-blue-600">Treino: {wordIndex + 1} de {moduleWords.length}</div>
         <button 
           onClick={handleGuided} 
           className={`p-3 rounded-full transition-colors flex items-center gap-1 ${isSpeaking ? 'bg-orange-200' : 'bg-orange-50 text-orange-600'}`}
         >
           <span className="text-xs">🐢🐰 Escuta Guiada</span>
         </button>
      </div>

      <div className="space-y-6">
        <div className="relative inline-block">
          <img 
            src={currentWord.imageUrl} 
            alt="palavra" 
            className="w-64 h-64 mx-auto rounded-full border-8 border-white shadow-2xl object-cover"
          />
          {isSpeaking && (
            <div className="absolute inset-0 bg-blue-500/10 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <h2 className="text-5xl font-bold text-slate-800">{currentWord.translations[language]}</h2>
      </div>

      <div className="flex flex-col gap-6">
        <button 
          onClick={handleSpeak}
          className={`w-full p-8 rounded-3xl border-4 flex items-center justify-between group transition-colors ${
            settings.calmMode ? 'bg-slate-100 border-slate-200' : 'bg-blue-100 border-blue-200 hover:bg-blue-200'
          }`}
        >
          <span className="text-4xl">🔊</span>
          <span className={`text-2xl font-bold ${settings.calmMode ? 'text-slate-700' : 'text-blue-800'}`}>Ouvir</span>
          <span className="opacity-0 group-hover:opacity-100">▶️</span>
        </button>

        <button 
          onClick={handleRecord}
          disabled={isRecording || isSpeaking}
          className={`w-full p-8 rounded-3xl border-4 flex items-center justify-between transition-all ${
            isRecording 
            ? 'bg-red-100 border-red-500 animate-pulse' 
            : 'bg-green-100 border-green-200 hover:bg-green-200'
          } ${isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="text-4xl">{isRecording ? '🛑' : '🎤'}</span>
          <span className="text-2xl font-bold text-slate-800">
            {isRecording ? 'Ouvindo...' : 'Minha Vez!'}
          </span>
          <div className="flex gap-1">
             {[...Array(3)].map((_, i) => (
                <div key={i} className={`w-2 h-6 bg-current rounded-full ${isRecording ? 'animate-bounce' : 'opacity-20'}`} style={{animationDelay: `${i * 0.1}s`}}></div>
             ))}
          </div>
        </button>
      </div>
    </div>
  );
};

export default RepetitionGame;
