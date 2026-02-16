
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Screen, Language, AppSettings, GameState, Module, UserStats, DailyProgress } from './types';
import { LANGUAGES, MODULES } from './constants';
import Landing from './components/Landing';
import LanguageSelector from './components/LanguageSelector';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import ModuleOverview from './components/ModuleOverview';
import AssociationGame from './components/Games/AssociationGame';
import MemoryGame from './components/Games/MemoryGame';
import RepetitionGame from './components/Games/RepetitionGame';
import LogicSequenceGame from './components/Games/LogicSequenceGame';
import ParentDashboard from './components/ParentDashboard';
import Album from './components/Album';
import Layout from './components/Layout';
import VisualFeedback from './components/VisualFeedback';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [activeLanguage, setActiveLanguage] = useState<Language>('pt');
  const [settings, setSettings] = useState<AppSettings>({
    fontSize: 'medium',
    highContrast: false,
    calmMode: false,
    audioSpeed: 1.0,
    enableAnimations: true,
    enableSounds: true,
    preferredMascotId: 'default',
    enabledRewards: ['stickers', 'sounds', 'animations', 'confetti'],
    themeIntensity: 'normal'
  });
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    activeLanguage: 'pt',
    selectedModuleId: null,
    stats: {
      learnedWordIds: [],
      unlockedStickerIds: [],
      totalPracticeMinutes: 0,
      lastActive: new Date().toISOString(),
      starsEarned: 0,
      history: []
    }
  });

  const [rewardType, setRewardType] = useState<'confetti' | 'fireworks' | null>(null);

  const startTimeRef = useRef<number>(Date.now());

  // Load saved data
  useEffect(() => {
    const savedSettings = localStorage.getItem('mundo_palavras_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prev => ({
        ...prev,
        ...parsed,
        preferredMascotId: parsed.preferredMascotId || 'default',
        enabledRewards: parsed.enabledRewards || ['stickers', 'sounds', 'animations', 'confetti'],
        themeIntensity: parsed.themeIntensity || 'normal'
      }));
    }

    const savedStats = localStorage.getItem('mundo_palavras_stats');
    if (savedStats) {
      setGameState(prev => ({ ...prev, stats: JSON.parse(savedStats) }));
    }
  }, []);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('mundo_palavras_settings', JSON.stringify(settings));
  }, [settings]);

  // Persist stats and calculate practice time
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diffMs = now - startTimeRef.current;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins > 0) {
        setGameState(prev => {
          const newStats = {
            ...prev.stats,
            totalPracticeMinutes: prev.stats.totalPracticeMinutes + diffMins,
            lastActive: new Date().toISOString()
          };
          localStorage.setItem('mundo_palavras_stats', JSON.stringify(newStats));
          return { ...prev, stats: newStats };
        });
        startTimeRef.current = now;
      }
    }, 60000); 

    return () => clearInterval(interval);
  }, []);

  const navigateTo = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
  }, []);

  const selectLanguage = useCallback((lang: Language) => {
    setActiveLanguage(lang);
    setGameState(prev => ({ ...prev, activeLanguage: lang }));
    navigateTo('dashboard');
  }, [navigateTo]);

  const selectModule = (moduleId: string) => {
    setGameState(prev => ({ ...prev, selectedModuleId: moduleId }));
    navigateTo('module-overview');
  };

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  const addScore = (points: number, newlyLearnedIds: string[] = []) => {
    setGameState(prev => {
      const updatedLearned = Array.from(new Set([...prev.stats.learnedWordIds, ...newlyLearnedIds]));
      
      // Atualizar histórico
      const todayStr = new Date().toLocaleDateString('pt-BR', { weekday: 'short' });
      const currentHistory = prev.stats.history || [];
      const dayIndex = currentHistory.findIndex(h => h.date === todayStr);
      
      let newHistory = [...currentHistory];
      if (dayIndex > -1) {
        newHistory[dayIndex] = {
          ...newHistory[dayIndex],
          wordsLearned: newHistory[dayIndex].wordsLearned + newlyLearnedIds.length,
          starsEarned: newHistory[dayIndex].starsEarned + points
        };
      } else {
        newHistory.push({ date: todayStr, wordsLearned: newlyLearnedIds.length, starsEarned: points });
      }
      // Manter apenas última semana
      if (newHistory.length > 7) newHistory.shift();

      const newStats = {
        ...prev.stats,
        starsEarned: prev.stats.starsEarned + points,
        learnedWordIds: updatedLearned,
        unlockedStickerIds: settings.enabledRewards.includes('stickers') ? updatedLearned : prev.stats.unlockedStickerIds,
        history: newHistory
      };
      
      localStorage.setItem('mundo_palavras_stats', JSON.stringify(newStats));
      return {
        ...prev,
        score: prev.score + points,
        stats: newStats
      };
    });

    // Recompensas visuais baseadas em configurações
    if (settings.enableAnimations) {
      if (points >= 50 && settings.enabledRewards.includes('fireworks')) {
        setRewardType('fireworks');
      } else if (settings.enabledRewards.includes('confetti')) {
        setRewardType('confetti');
      }
      
      if (rewardType) {
        setTimeout(() => setRewardType(null), 4000);
      }
    }
  };

  const renderScreen = () => {
    const moduleId = gameState.selectedModuleId || '';
    switch (currentScreen) {
      case 'landing':
        return <Landing onStart={() => navigateTo('language-selector')} onParent={() => navigateTo('parent-dashboard')} />;
      case 'language-selector':
        return <LanguageSelector onSelect={selectLanguage} onBack={() => navigateTo('landing')} />;
      case 'dashboard':
        return <Dashboard 
                  activeLanguage={activeLanguage} 
                  stats={gameState.stats}
                  settings={settings}
                  onSelectModule={selectModule}
                  onBack={() => navigateTo('language-selector')}
                  onSettings={() => navigateTo('settings')}
                  onOpenAlbum={() => navigateTo('album')}
               />;
      case 'module-overview':
        const mod = MODULES.find(m => m.id === moduleId);
        return <ModuleOverview 
                  module={mod!} 
                  language={activeLanguage}
                  settings={settings}
                  onPlay={(game: Screen) => navigateTo(game)} 
                  onBack={() => navigateTo('dashboard')} 
               />;
      case 'settings':
        return <Settings settings={settings} onUpdate={updateSettings} onBack={() => navigateTo('dashboard')} />;
      case 'game-association':
        return <AssociationGame 
                  moduleId={moduleId}
                  language={activeLanguage} 
                  settings={settings}
                  onFinish={(points, learned) => { addScore(points, learned); navigateTo('module-overview'); }} 
                  onBack={() => navigateTo('module-overview')}
               />;
      case 'game-memory':
        return <MemoryGame 
                  moduleId={moduleId}
                  language={activeLanguage} 
                  settings={settings}
                  onFinish={(points, learned) => { addScore(points, learned); navigateTo('module-overview'); }} 
                  onBack={() => navigateTo('module-overview')}
               />;
      case 'game-repetition':
        return <RepetitionGame 
                  moduleId={moduleId}
                  language={activeLanguage} 
                  settings={settings}
                  onFinish={(points, learned) => { addScore(points, learned); navigateTo('module-overview'); }} 
                  onBack={() => navigateTo('module-overview')}
               />;
      case 'game-logic-sequence':
        return <LogicSequenceGame 
                  moduleId={moduleId}
                  language={activeLanguage} 
                  settings={settings}
                  onFinish={(points) => { addScore(points); navigateTo('module-overview'); }} 
                  onBack={() => navigateTo('module-overview')}
               />;
      case 'parent-dashboard':
        return <ParentDashboard stats={gameState.stats} onBack={() => navigateTo('landing')} />;
      case 'album':
        return <Album stats={gameState.stats} onBack={() => navigateTo('dashboard')} />;
      default:
        return <Landing onStart={() => navigateTo('language-selector')} onParent={() => navigateTo('parent-dashboard')} />;
    }
  };

  const appClasses = [
    settings.highContrast ? 'high-contrast' : '',
    settings.calmMode ? 'calm-mode' : '',
    !settings.enableAnimations ? 'no-animations' : '',
    settings.themeIntensity === 'vibrant' ? 'vibrant-theme' : '',
    settings.themeIntensity === 'soft' ? 'soft-theme' : ''
  ].join(' ');

  const showThemeOnLayout = currentScreen !== 'landing' && currentScreen !== 'language-selector' && currentScreen !== 'parent-dashboard';

  return (
    <div className={appClasses}>
      <Layout settings={settings} score={gameState.score} activeLanguage={showThemeOnLayout ? activeLanguage : undefined}>
        {renderScreen()}
        {rewardType && settings.enableAnimations && <VisualFeedback type={rewardType} />}
      </Layout>
    </div>
  );
};

export default App;
