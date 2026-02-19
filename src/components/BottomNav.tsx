import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavProps {
  currentTab: 'home' | 'spreads' | 'history' | 'profile';
  onChangeTab: (tab: 'home' | 'spreads' | 'history' | 'profile') => void;
  theme?: 'green' | 'purple';
}

export default function BottomNav({ currentTab, onChangeTab, theme = 'purple' }: BottomNavProps) {
  const { t } = useLanguage();
  const isGreen = theme === 'green';
  
  const activeColor = isGreen ? 'text-[#4bee2b]' : 'text-[#7f19e6]';
  const inactiveColor = 'text-slate-400 dark:text-slate-500';
  
  const getTabClass = (tab: string) => {
    return `flex flex-col items-center justify-center gap-1 transition-colors flex-1 ${
      currentTab === tab ? activeColor : `${inactiveColor} hover:${activeColor}`
    }`;
  };

  const getIconClass = (tab: string) => {
    return `material-symbols-outlined text-[24px] ${currentTab === tab ? 'icon-filled' : 'icon-outlined'}`;
  };

  return (
    <nav className={`fixed bottom-0 w-full max-w-md backdrop-blur-lg border-t px-6 pb-6 pt-2 z-30 ${
      isGreen ? 'bg-white/95 dark:bg-[#1a2e16]/95 border-slate-100 dark:border-slate-800' : 'bg-white/95 dark:bg-[#191121]/95 border-slate-100 dark:border-white/5'
    }`}>
      <div className="flex items-center justify-around">
        <button onClick={() => onChangeTab('home')} className={getTabClass('home')}>
          <span className={getIconClass('home')}>home</span>
          <span className="text-[10px] font-bold">{t('home')}</span>
        </button>
        
        <button onClick={() => onChangeTab('spreads')} className={getTabClass('spreads')}>
          {currentTab === 'spreads' && !isGreen ? (
            <div className="flex size-10 items-center justify-center rounded-full bg-[#7f19e6] text-white shadow-lg shadow-[#7f19e6]/30 transition-transform active:scale-95 -mt-4">
              <span className="material-symbols-outlined text-2xl icon-filled">style</span>
            </div>
          ) : (
            <>
              <span className={getIconClass('spreads')}>style</span>
              <span className="text-[10px] font-medium">{t('spreads')}</span>
            </>
          )}
        </button>
        
        <button onClick={() => onChangeTab('history')} className={getTabClass('history')}>
          {currentTab === 'history' && !isGreen ? (
            <>
              <div className="flex h-10 w-12 items-center justify-center rounded-2xl bg-[#7f19e6]/10">
                <span className="material-symbols-outlined text-[24px] icon-filled">history</span>
              </div>
              <span className="text-[10px] font-medium">{t('history')}</span>
            </>
          ) : (
            <>
              <span className={getIconClass('history')}>history</span>
              <span className="text-[10px] font-medium">{t('history')}</span>
            </>
          )}
        </button>
        
        <button onClick={() => onChangeTab('profile')} className={getTabClass('profile')}>
          <span className={getIconClass('person')}>person</span>
          <span className="text-[10px] font-medium">{t('profile')}</span>
        </button>
      </div>
    </nav>
  );
}
