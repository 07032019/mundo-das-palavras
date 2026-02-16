
import React from 'react';
import { AppSettings } from '../types';
import { MASCOTS } from '../constants';

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (s: AppSettings) => void;
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate, onBack }) => {
  const rewardOptions: {id: AppSettings['enabledRewards'][number], label: string, icon: string}[] = [
    { id: 'stickers', label: 'Figurinhas', icon: '🖼️' },
    { id: 'sounds', label: 'Sons', icon: '🎵' },
    { id: 'animations', label: 'Animações', icon: '✨' },
    { id: 'confetti', label: 'Confetes', icon: '🎊' },
    { id: 'fireworks', label: 'Fogos', icon: '🎆' },
  ];

  const toggleReward = (id: AppSettings['enabledRewards'][number]) => {
    const current = settings.enabledRewards || [];
    const updated = current.includes(id) 
      ? current.filter(r => r !== id)
      : [...current, id];
    onUpdate({ ...settings, enabledRewards: updated });
  };

  return (
    <div className="space-y-8 animate-fade-in bg-white p-8 rounded-[2.5rem] shadow-xl max-w-2xl mx-auto pb-20">
      <div className="flex items-center gap-4 border-b pb-6">
        <button onClick={onBack} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h2 className="text-3xl font-bold">Configurações para Pais</h2>
      </div>

      <div className="space-y-12">
        {/* Escolha do Mascote */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">🧸</span> Mascote Favorito
          </h3>
          <p className="text-sm text-slate-500 mb-4">Escolha quem acompanhará a criança em todos os mundos.</p>
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
            <button
              onClick={() => onUpdate({ ...settings, preferredMascotId: 'default' })}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                settings.preferredMascotId === 'default' 
                ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                : 'bg-slate-50 border-slate-100'
              }`}
            >
              <span className="text-2xl">🌍</span>
              <span className="text-[10px] font-bold">Padrão</span>
            </button>
            {MASCOTS.map(m => (
              <button
                key={m.id}
                onClick={() => onUpdate({ ...settings, preferredMascotId: m.id })}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                  settings.preferredMascotId === m.id 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                  : 'bg-slate-50 border-slate-100'
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-[10px] font-bold">{m.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Escolha de Recompensas */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">🎁</span> Recompensas Ativas
          </h3>
          <div className="flex flex-wrap gap-3">
            {rewardOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => toggleReward(opt.id)}
                className={`px-4 py-3 rounded-2xl border-2 font-bold flex items-center gap-2 transition-all ${
                  settings.enabledRewards?.includes(opt.id)
                  ? 'bg-green-100 border-green-500 text-green-700'
                  : 'bg-slate-50 border-slate-100 text-slate-400'
                }`}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">🎨</span> Intensidade Visual
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {(['soft', 'normal', 'vibrant'] as const).map(intensity => (
              <button
                key={intensity}
                onClick={() => onUpdate({ ...settings, themeIntensity: intensity })}
                className={`py-3 rounded-xl border-2 font-bold capitalize ${
                  settings.themeIntensity === intensity 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'bg-slate-50 border-slate-100'
                }`}
              >
                {intensity}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4 pt-6 border-t">
          <h3 className="text-xl font-bold">Opções Básicas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => onUpdate({ ...settings, calmMode: !settings.calmMode })}
              className={`py-4 rounded-2xl border-2 font-bold transition-all ${
                settings.calmMode ? 'bg-slate-700 text-white' : 'bg-slate-50'
              }`}
            >
              {settings.calmMode ? 'Modo Calmante ON' : 'Modo Calmante OFF'}
            </button>
            <button
              onClick={() => onUpdate({ ...settings, highContrast: !settings.highContrast })}
              className={`py-4 rounded-2xl border-2 font-bold transition-all ${
                settings.highContrast ? 'bg-black text-yellow-400' : 'bg-slate-50'
              }`}
            >
              Alto Contraste
            </button>
          </div>
        </section>
      </div>

      <button 
        onClick={onBack}
        className="w-full mt-12 py-6 bg-green-500 text-white rounded-[2rem] font-bold text-xl shadow-xl hover:bg-green-600 transition-all"
      >
        Salvar Alterações
      </button>
    </div>
  );
};

export default Settings;
