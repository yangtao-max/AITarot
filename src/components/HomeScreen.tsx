import React from 'react';
import BottomNav from './BottomNav';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { HERO_IMAGE } from '../constants/cardImages';

interface HomeScreenProps {
  onChangeTab: (tab: 'home' | 'spreads' | 'history' | 'profile') => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function HomeScreen({ onChangeTab }: HomeScreenProps) {
  const { t } = useLanguage();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto shadow-2xl bg-[#f9fcf8] dark:bg-[#132210] text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-12 pb-4 sticky top-0 z-20 bg-[#f9fcf8]/80 dark:bg-[#132210]/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#4bee2b]/20 to-transparent border border-[#4bee2b]/30 text-[#052e00] dark:text-[#4bee2b]">
            <span className="material-symbols-outlined text-[24px]">help_center</span>
          </div>
          <div>
            <h1 className="font-display text-lg font-bold leading-tight tracking-tight">{t('appName')}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('appDesc')}</p>
          </div>
        </motion.div>
        <motion.button 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
        >
          <span className="material-symbols-outlined">settings</span>
        </motion.button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-24 px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Hero Section */}
          <motion.section variants={item} className="mt-4 mb-8">
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(75,238,43,0.05),0_10px_15px_-3px_rgba(0,0,0,0.02)] group cursor-pointer" onClick={() => onChangeTab('spreads')}>
              {/* Background Image with Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center pb-12">
                <div className="mb-6 opacity-90">
                  <span className="material-symbols-outlined text-white text-[48px] animate-pulse">auto_awesome</span>
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">开启今日启示</h2>
                <p className="text-white/80 text-sm font-medium mb-6">探索未知的指引，聆听内心的声音</p>
                <button className="relative overflow-hidden rounded-xl bg-[#4bee2b] px-8 py-3.5 text-[#052e00] font-bold shadow-lg shadow-[#4bee2b]/30 transition-transform active:scale-95 hover:bg-[#3cd620]">
                  <span className="relative z-10 flex items-center gap-2">
                    立即解读
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </button>
              </div>
            </div>
          </motion.section>

          {/* Grid Section */}
          <motion.section variants={item}>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">探索模式</h3>
              <button className="text-xs font-semibold text-[#4bee2b] hover:opacity-80" onClick={() => onChangeTab('spreads')}>查看全部</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: 'wb_sunny', title: '每日一签', desc: '今日运势指引', color: 'orange' },
                { icon: 'favorite', title: '情感解惑', desc: '爱与关系的启示', color: 'pink', filled: true },
                { icon: 'work', title: '事业指引', desc: '职业发展方向', color: 'blue', filled: true },
                { icon: 'all_inclusive', title: '万事皆问', desc: '自由提问解惑', color: 'purple' },
              ].map((card, idx) => (
                <motion.button 
                  key={card.title}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex flex-col gap-3 rounded-2xl bg-white dark:bg-[#1a2e16] p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all text-left border border-transparent hover:border-[#4bee2b]/20"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-${card.color}-50 dark:bg-${card.color}-900/30 text-${card.color}-500 dark:text-${card.color}-300 group-hover:scale-110 transition-transform`}>
                    <span className={`material-symbols-outlined ${card.filled ? 'icon-filled' : ''}`}>{card.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{card.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{card.desc}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.section>

          {/* Featured Article / Wisdom */}
          <motion.section variants={item} className="mt-8">
            <div className="rounded-2xl bg-[#e9f3e7] dark:bg-[#1a2e16]/50 p-6 flex items-center justify-between gap-4 border border-[#4bee2b]/10">
              <div className="flex-1">
                <span className="inline-block px-2 py-1 rounded bg-white dark:bg-slate-700 text-[10px] font-bold text-[#4bee2b] uppercase tracking-wide mb-2">{t('dailyWisdom')}</span>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">"命运不是等待风暴过去，而是学会在雨中翩翩起舞。"</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[#4bee2b]">spa</span>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </main>

      <BottomNav currentTab="home" onChangeTab={onChangeTab} theme="green" />
    </div>
  );
}
