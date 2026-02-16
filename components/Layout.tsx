
import React from 'react';
import { AppSettings, Language } from '../types';
import { LANGUAGE_THEMES } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  settings: AppSettings;
  score: number;
  activeLanguage?: Language;
}

const Layout: React.FC<LayoutProps> = ({ children, settings, score, activeLanguage }) => {
  const theme = activeLanguage ? LANGUAGE_THEMES[activeLanguage] : null;

  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-2xl';
      default: return 'text-lg';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-700 ${getFontSizeClass()} ${theme && !settings.calmMode ? theme.bg : 'bg-blue-50'}`}>
      <header className="p-4 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 flex justify-between items-center border-b border-white">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${theme ? theme.primary : 'bg-blue-500'} rounded-2xl flex items-center justify-center text-white font-bold shadow-lg transition-colors`}>
            {theme ? theme.icon : 'M'}
          </div>
          <h1 className={`font-bold ${theme ? theme.secondary : 'text-blue-600'} tracking-tight hidden sm:block`}>
            {theme ? `Mundo ${theme.scenario}` : 'Mundo das Palavras'}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-yellow-100/80 px-4 py-2 rounded-2xl flex items-center gap-2 border border-yellow-200 backdrop-blur-sm">
            <span className="text-xl">⭐</span>
            <span className="font-bold text-yellow-700">{score}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl relative">
        {children}
      </main>

      <footer className="p-6 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
        <div className="flex gap-2 opacity-50">
          <span>☁️</span>
          <span>🌳</span>
          <span>☁️</span>
        </div>
        <span>Feito com amor para crianças extraordinárias.</span>
      </footer>
    </div>
  );
};

export default Layout;
