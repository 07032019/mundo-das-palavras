
import React from 'react';
import { UserStats, DailyProgress } from '../types';
import { WORDS } from '../constants';

interface ParentDashboardProps {
  stats: UserStats;
  onBack: () => void;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ stats, onBack }) => {
  const learnedWords = WORDS.filter(w => stats.learnedWordIds.includes(w.id));
  
  // Mock data se o histórico estiver vazio
  const history: DailyProgress[] = stats.history?.length > 0 ? stats.history : [
    { date: 'Seg', wordsLearned: 3, starsEarned: 30 },
    { date: 'Ter', wordsLearned: 5, starsEarned: 50 },
    { date: 'Qua', wordsLearned: 2, starsEarned: 20 },
    { date: 'Qui', wordsLearned: 8, starsEarned: 80 },
    { date: 'Sex', wordsLearned: 4, starsEarned: 40 },
    { date: 'Sáb', wordsLearned: 6, starsEarned: 60 },
    { date: 'Dom', wordsLearned: 7, starsEarned: 70 },
  ];

  const maxLearned = Math.max(...history.map(d => d.wordsLearned), 1);

  return (
    <div className="space-y-8 animate-fade-in bg-white p-8 rounded-[2.5rem] shadow-xl max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4 border-b pb-6">
        <button onClick={onBack} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h2 className="text-3xl font-bold text-slate-800">Relatório de Progresso</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-3xl text-center border-b-4 border-blue-200">
          <span className="text-4xl mb-2 block">⏱️</span>
          <h3 className="text-slate-500 font-semibold uppercase text-xs tracking-widest">Tempo Total</h3>
          <p className="text-3xl font-bold text-blue-700">{stats.totalPracticeMinutes} min</p>
        </div>
        <div className="bg-green-50 p-6 rounded-3xl text-center border-b-4 border-green-200">
          <span className="text-4xl mb-2 block">📚</span>
          <h3 className="text-slate-500 font-semibold uppercase text-xs tracking-widest">Palavras</h3>
          <p className="text-3xl font-bold text-green-700">{stats.learnedWordIds.length}</p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-3xl text-center border-b-4 border-yellow-200">
          <span className="text-4xl mb-2 block">⭐</span>
          <h3 className="text-slate-500 font-semibold uppercase text-xs tracking-widest">Estrelas</h3>
          <p className="text-3xl font-bold text-yellow-700">{stats.starsEarned}</p>
        </div>
      </div>

      {/* Gráfico Ilustrado: "Pomar do Conhecimento" */}
      <div className="bg-slate-50 p-8 rounded-[3rem] space-y-6">
        <h3 className="text-xl font-bold text-slate-700 text-center">Ritmo da Semana (Palavras por dia)</h3>
        <div className="flex items-end justify-between h-48 gap-2">
          {history.map((day, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="relative w-full flex flex-col items-center">
                 {/* Stack de maçãs visual */}
                 <div className="flex flex-col-reverse gap-1 mb-2">
                    {[...Array(Math.min(day.wordsLearned, 5))].map((_, i) => (
                      <span key={i} className="text-xl animate-bounce-slow" style={{animationDelay: `${i*0.1}s`}}>🍎</span>
                    ))}
                    {day.wordsLearned > 5 && <span className="text-xs font-bold text-red-500">+{day.wordsLearned - 5}</span>}
                 </div>
                 {/* Barra de fundo */}
                 <div 
                  className="w-full bg-green-200 rounded-t-xl transition-all duration-1000 ease-out min-h-[10px]"
                  style={{ height: `${(day.wordsLearned / maxLearned) * 100}px` }}
                 ></div>
              </div>
              <span className="text-xs font-bold text-slate-400">{day.date}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-700">Palavras Aprendidas</h3>
        {learnedWords.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-3xl text-slate-400">
            Ainda não há palavras registradas. Continue praticando!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {learnedWords.map(word => (
              <div key={word.id} className="bg-white border rounded-2xl p-2 shadow-sm hover:shadow-md transition-shadow text-center">
                <img src={word.imageUrl} alt={word.id} className="w-full aspect-square object-cover rounded-xl mb-2" />
                <span className="text-xs font-bold text-slate-600 capitalize">{word.id}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-600 text-white p-8 rounded-[2rem] shadow-lg flex items-center gap-6">
        <div className="text-5xl">💡</div>
        <div>
          <h4 className="font-bold text-lg mb-1">Dica Pedagógica</h4>
          <p className="text-blue-100 text-sm">Crianças no espectro autista frequentemente se beneficiam de previsibilidade. Tente manter o mesmo mascote por algumas semanas para criar um vínculo de confiança.</p>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
