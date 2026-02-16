
import React from 'react';
import { Language, UserStats, AppSettings } from '../types';
import { LANGUAGES, MODULES, LANGUAGE_THEMES } from '../constants';
import Mascot from './Mascot';

interface DashboardProps {
  activeLanguage: Language;
  stats: UserStats;
  settings: AppSettings;
  onSelectModule: (id: string) => void;
  onBack: () => void;
  onSettings: () => void;
  onOpenAlbum: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ activeLanguage, stats, settings, onSelectModule, onBack, onSettings, onOpenAlbum }) => {
  const lang = LANGUAGES.find(l => l.code === activeLanguage);
  const theme = LANGUAGE_THEMES[activeLanguage];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-4 bg-white rounded-2xl shadow-md border-b-4 border-slate-100">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Caminho do {lang?.label}</h2>
            <p className={`font-semibold ${theme.secondary}`}>{theme.scenario}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {settings.enabledRewards.includes('stickers') && (
            <button onClick={onOpenAlbum} className="p-4 bg-white rounded-2xl shadow-md border-b-4 border-slate-100 text-2xl" title="Minha Coleção">
              🖼️
            </button>
          )}
          <button onClick={onSettings} className="p-4 bg-white rounded-2xl shadow-md border-b-4 border-slate-100 text-2xl">
            ⚙️
          </button>
        </div>
      </div>

      {/* Mascot Section */}
      <div className="px-2">
        <Mascot theme={theme} language={activeLanguage} settings={settings} autoSpeak={true} />
      </div>

      <div className="relative py-10 space-y-12">
        <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-white/50 -translate-x-1/2 rounded-full hidden md:block"></div>

        {MODULES.map((mod, index) => {
          const isEven = index % 2 === 0;
          const isUnlocked = index === 0 || stats.learnedWordIds.some(wid => MODULES[index-1].words.includes(wid));
          
          return (
            <div 
              key={mod.id} 
              className={`flex flex-col md:flex-row items-center gap-6 relative z-10 ${isEven ? 'md:flex-row-reverse' : ''} ${!isUnlocked ? 'opacity-60 grayscale' : ''}`}
            >
              <button
                disabled={!isUnlocked}
                onClick={() => onSelectModule(mod.id)}
                className={`flex items-center gap-6 p-6 bg-white rounded-[3rem] shadow-xl border-b-8 transition-all text-left relative overflow-hidden group w-full md:w-auto min-w-[320px] ${isUnlocked ? 'border-slate-100 hover:border-blue-200 hover:-translate-y-1' : 'border-slate-200 cursor-not-allowed'}`}
              >
                <div className={`w-20 h-20 ${theme.bg} rounded-3xl flex items-center justify-center text-4xl shrink-0 shadow-inner ${isUnlocked ? 'group-hover:rotate-12' : ''} transition-transform`}>
                  {isUnlocked ? mod.icon : '🔒'}
                </div>
                <div className="flex-1">
                  <span className={`text-xs font-bold ${theme.secondary} uppercase tracking-widest`}>Etapa {index + 1}</span>
                  <h3 className="text-xl font-bold text-slate-800">{mod.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-yellow-500 text-xs">{isUnlocked ? '✨' : '☁️'}</span>
                     <span className="text-slate-400 text-sm">
                       {isUnlocked ? `${mod.words.length} novas palavras` : 'Bloqueado'}
                     </span>
                  </div>
                </div>
                {isUnlocked && (
                  <div className={`${theme.secondary} group-hover:translate-x-2 transition-transform`}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                )}
              </button>
              
              <div className={`w-12 h-12 rounded-full border-8 shadow-md hidden md:flex items-center justify-center text-xs font-bold ${isUnlocked ? 'bg-white border-slate-50 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-300'}`}>
                {index + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
