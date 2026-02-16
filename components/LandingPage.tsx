
import React from 'react';

interface LandingProps {
  onStart: () => void;
  onParent: () => void;
}

const LandingPage: React.FC<LandingProps> = ({ onStart, onParent }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-fade-in relative">
      <div className="relative">
        <div className="absolute -inset-4 bg-blue-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <img
          src="https://picsum.photos/seed/kids/200/200"
          alt="Amigo do Mundo das Palavras"
          className="relative w-48 h-48 rounded-full border-8 border-white shadow-xl object-cover animate-bounce-slow"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-blue-700">Olá, explorador!</h2>
        <p className="text-xl text-slate-600 max-w-md mx-auto">
          Pronto para descobrir novas palavras e se divertir em muitos idiomas?
        </p>
      </div>

      <button
        onClick={onStart}
        className="group relative inline-flex items-center justify-center px-10 py-6 font-bold text-white transition-all duration-200 bg-blue-600 font-pj rounded-3xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 shadow-xl hover:bg-blue-700 active:scale-95"
      >
        <span className="text-2xl">Começar Agora</span>
        <svg className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
        </svg>
      </button>

      <button
        onClick={onParent}
        className="mt-12 text-slate-400 hover:text-blue-500 text-sm font-semibold flex items-center gap-2 border border-slate-200 px-4 py-2 rounded-full hover:bg-white transition-all"
      >
        <span>Área dos Pais e Professores</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
      </button>
    </div>
  );
};

export default LandingPage;
