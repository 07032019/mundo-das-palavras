
import React from 'react';
import { LANGUAGES, LANGUAGE_THEMES } from '../constants';
import { Language } from '../types';

interface LanguageSelectorProps {
  onSelect: (lang: Language) => void;
  onBack: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect, onBack }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-4 bg-white rounded-2xl shadow-md hover:bg-slate-50 transition-all active:scale-95">
           <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Para onde vamos agora?</h2>
          <p className="text-slate-400">Escolha um mundo para explorar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {LANGUAGES.map((lang) => {
          const theme = LANGUAGE_THEMES[lang.code];
          return (
            <button
              key={lang.code}
              onClick={() => onSelect(lang.code)}
              className="flex flex-col items-center p-6 bg-white rounded-[2.5rem] shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all group border-4 border-white relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-16 h-16 ${theme.primary} opacity-10 rounded-bl-full`}></div>
              <span className="text-6xl mb-4 group-hover:scale-110 transition-transform z-10">{lang.flag}</span>
              <div className="z-10 text-center">
                <span className="text-xl font-bold text-slate-800 block">{lang.label}</span>
                <span className={`text-sm font-semibold ${theme.secondary}`}>{theme.scenario}</span>
              </div>
              <div className="mt-4 text-3xl opacity-20 group-hover:opacity-100 transition-opacity">
                {theme.icon}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSelector;
