import React from 'react';
import BottomNav from './BottomNav';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface ProfileScreenProps {
  onChangeTab: (tab: 'home' | 'spreads' | 'history' | 'profile') => void;
  onOpenSettings: () => void;
}

export default function ProfileScreen({ onChangeTab, onOpenSettings }: ProfileScreenProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto shadow-2xl bg-[#f9fcf8] dark:bg-[#132210] text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-12 pb-4 sticky top-0 z-20 bg-[#f9fcf8]/80 dark:bg-[#132210]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#4bee2b]/20 to-transparent border border-[#4bee2b]/30 text-[#052e00] dark:text-[#4bee2b]">
            <span className="material-symbols-outlined text-[24px]">person</span>
          </div>
          <div>
            <h1 className="font-display text-lg font-bold leading-tight tracking-tight">{t('profile')}</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto hide-scrollbar pb-24 px-6 space-y-8">
        {/* User Info Card */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-6 rounded-3xl bg-white dark:bg-[#1a2e16] shadow-sm border border-black/5 dark:border-white/5 flex items-center gap-4"
        >
          <div className="size-16 rounded-full bg-gradient-to-tr from-[#4bee2b] to-[#7f19e6] p-1">
            <div className="size-full rounded-full bg-white dark:bg-[#132210] flex items-center justify-center overflow-hidden">
              <span className="material-symbols-outlined text-4xl opacity-20">face</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">灵感旅人</h2>
            <p className="text-xs text-slate-500">探索灵性的第 1 天</p>
          </div>
        </motion.section>

        {/* Settings Section */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">{t('settings')}</h3>
          
          <div className="rounded-3xl bg-white dark:bg-[#1a2e16] overflow-hidden border border-black/5 dark:border-white/5">
            {/* AI Model Setting */}
            <button 
              onClick={onOpenSettings}
              className="w-full p-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 hover:bg-black/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#7f19e6]">auto_awesome</span>
                <span className="text-sm font-medium">AI 模型设置</span>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </button>

            {/* Language Setting */}
            <div className="p-4 flex items-center justify-between border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#4bee2b]">language</span>
                <span className="text-sm font-medium">{t('language')}</span>
              </div>
              <div className="flex bg-slate-100 dark:bg-black/20 p-1 rounded-xl">
                <button 
                  onClick={() => setLanguage('zh')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${language === 'zh' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-400'}`}
                >
                  中文
                </button>
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${language === 'en' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-400'}`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Other Mock Settings */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-orange-400">notifications</span>
                <span className="text-sm font-medium">每日提醒</span>
              </div>
              <div className="size-10 flex items-center justify-center">
                <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 rounded-full relative">
                  <div className="absolute left-1 top-1 size-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNav currentTab="profile" onChangeTab={onChangeTab} theme="green" />
    </div>
  );
}
