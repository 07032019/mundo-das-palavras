
import React from 'react';
import { UserStats } from '../types';
import { WORDS } from '../constants';

interface AlbumProps {
  stats: UserStats;
  onBack: () => void;
}

const Album: React.FC<AlbumProps> = ({ stats, onBack }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-4 bg-white rounded-2xl shadow-md border-b-4 border-slate-100">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Meus Amigos</h2>
          <p className="text-slate-400">Sua coleção de figurinhas!</p>
        </div>
      </div>

      <div className="bg-white/60 p-8 rounded-[3rem] border-4 border-dashed border-white flex flex-col items-center gap-4 text-center">
        <div className="text-6xl animate-bounce-slow">✨</div>
        <p className="text-slate-600 font-bold">Você já desbloqueou {stats.learnedWordIds.length} amigos de {WORDS.length}!</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {WORDS.map((word) => {
          const isUnlocked = stats.learnedWordIds.includes(word.id);
          return (
            <div 
              key={word.id} 
              className={`relative bg-white p-4 rounded-[2rem] shadow-lg border-b-8 border-slate-100 transition-all ${isUnlocked ? 'grayscale-0 scale-100' : 'grayscale opacity-40 scale-95'}`}
            >
              <img src={word.imageUrl} alt={word.id} className="w-full aspect-square object-cover rounded-[1.5rem]" />
              <div className="mt-3 text-center">
                <span className="font-bold text-slate-700 block text-sm">
                  {isUnlocked ? word.id.toUpperCase() : '???'}
                </span>
                {isUnlocked && <span className="text-xs text-green-500 font-bold">Amigo desbloqueado!</span>}
              </div>
              {isUnlocked && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-white rounded-full p-2 shadow-md animate-pulse">
                  ⭐
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Album;
