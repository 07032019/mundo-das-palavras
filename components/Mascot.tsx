
import React, { useEffect } from 'react';
import { LanguageTheme, Language, AppSettings } from '../types';
import { MASCOTS } from '../constants';
import { speakMascot } from '../services/geminiService';

interface MascotProps {
  theme: LanguageTheme;
  language: Language;
  settings: AppSettings;
  message?: string;
  autoSpeak?: boolean;
}

const Mascot: React.FC<MascotProps> = ({ theme, language, settings, message, autoSpeak = false }) => {
  const displayMessage = message || theme.welcomeMsg[language] || theme.welcomeMsg['pt'] || theme.welcomeMsg['en'];

  // Determinar qual mascote exibir
  const preferredMascot = settings.preferredMascotId !== 'default' 
    ? MASCOTS.find(m => m.id === settings.preferredMascotId)
    : MASCOTS.find(m => m.id === theme.mascotId);

  const mascotToUse = preferredMascot || MASCOTS[0];

  useEffect(() => {
    if (autoSpeak && displayMessage && settings.enableSounds) {
      speakMascot(displayMessage, language, mascotToUse.name);
    }
  }, [autoSpeak, displayMessage, language, mascotToUse.name, settings.enableSounds]);

  return (
    <div className="flex items-center gap-6 animate-fade-in py-4">
      <div className="relative group cursor-pointer" onClick={() => speakMascot(displayMessage, language, mascotToUse.name)}>
        <div className={`absolute inset-0 ${theme.primary} opacity-20 blur-2xl rounded-full group-hover:opacity-40 transition-opacity`}></div>
        <div className="relative w-24 h-24 bg-white rounded-full shadow-xl border-4 border-white flex items-center justify-center text-5xl hover:scale-110 transition-transform">
          {mascotToUse.emoji}
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md border text-[10px] font-bold text-slate-500 uppercase tracking-tighter whitespace-nowrap">
          {mascotToUse.name}
        </div>
      </div>
      
      <div className="relative flex-1">
        <div className="bg-white p-5 rounded-[2rem] shadow-lg border-2 border-slate-50 text-slate-700 relative">
          <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 w-4 h-4 bg-white border-l-2 border-b-2 border-slate-50 rotate-45 -mr-2"></div>
          <p className="font-semibold leading-relaxed">
            {displayMessage}
          </p>
          <button 
            onClick={() => speakMascot(displayMessage, language, mascotToUse.name)}
            className={`mt-2 text-xs font-bold uppercase tracking-widest ${theme.secondary} flex items-center gap-1 hover:opacity-70`}
          >
            <span>🔊 Ouvir novamente</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mascot;
