
import React from 'react';
import { Module, Screen, Language, AppSettings } from '../types';
import { LANGUAGE_THEMES } from '../constants';
import Mascot from './Mascot';

interface ModuleOverviewProps {
  module: Module;
  language: Language;
  settings: AppSettings;
  onPlay: (game: Screen) => void;
  onBack: () => void;
}

const ModuleOverview: React.FC<ModuleOverviewProps> = ({ module, language, settings, onPlay, onBack }) => {
  const theme = LANGUAGE_THEMES[language];
  const activities = [
    { id: 'game-association', title: 'Aprender', icon: '🧩', text: 'Ver e ouvir' },
    { id: 'game-repetition', title: 'Falar', icon: '🗣️', text: 'Repita comigo' },
    { id: 'game-memory', title: 'Brincar', icon: '🎴', text: 'Jogo da memória' },
  ];

  if (module.sequences && module.sequences.length > 0) {
    activities.push({ id: 'game-logic-sequence', title: 'História', icon: '🎞️', text: 'Ordenar imagens' });
  }

  const welcomeMsg = `Vamos praticar o módulo ${module.title}? Escolha uma brincadeira!`;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-md border-b-4 border-slate-100">
           <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <div>
           <h2 className="text-2xl font-bold text-slate-800">{module.title}</h2>
           <p className="text-slate-400 text-sm">Etapa de aprendizado</p>
        </div>
      </div>

      <Mascot theme={theme} language={language} settings={settings} message={welcomeMsg} autoSpeak={true} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {activities.map((act) => (
          <button
            key={act.id}
            onClick={() => onPlay(act.id as Screen)}
            className="flex items-center gap-6 p-6 bg-white rounded-[2.5rem] shadow-lg border-b-8 border-slate-100 hover:border-blue-300 hover:-translate-y-1 transition-all group"
          >
            <div className={`w-16 h-16 ${theme.bg} rounded-3xl flex items-center justify-center text-4xl shrink-0 group-hover:rotate-12 transition-transform`}>
              {act.icon}
            </div>
            <div className="text-left">
              <h4 className="font-bold text-lg text-slate-800">{act.title}</h4>
              <p className="text-slate-400 text-sm">{act.text}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModuleOverview;
