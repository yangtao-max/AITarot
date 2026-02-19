import React from 'react';
import BottomNav from './BottomNav';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { HERO_IMAGE } from '../constants/cardImages';
import type { SpreadInitialFilter } from '../App';

interface HomeScreenProps {
  onChangeTab: (tab: 'home' | 'spreads' | 'history' | 'profile', payload?: { initialSpreadFilter?: SpreadInitialFilter }) => void;
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
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto shadow-2xl bg-[#f7f6f8] dark:bg-[#191121] text-slate-900 dark:text-slate-100">
      {/* Header - 与牌阵/历史一致 */}
      <header className="flex items-center justify-between px-4 pt-10 pb-3 sticky top-0 z-20 bg-[#f7f6f8]/90 dark:bg-[#191121]/90 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#362447] border border-white/10 text-[#7f19e6]">
            <span className="material-symbols-outlined text-[24px]">help_center</span>
          </div>
          <div>
            <h1 className="font-display text-lg font-bold leading-tight tracking-tight">{t('appName')}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('appDesc')}</p>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-24 px-4">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Hero Section - 紧凑版 */}
          <motion.section variants={item} className="mt-2 mb-6">
            <div className="relative w-full max-h-[220px] aspect-[2/1] rounded-2xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(127,25,230,0.15)] group cursor-pointer" onClick={() => onChangeTab('spreads')}>
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-5 text-center pb-6">
                <span className="material-symbols-outlined text-white text-3xl opacity-90 mb-2">auto_awesome</span>
                <h2 className="text-xl font-display font-bold text-white mb-1 tracking-tight">开启今日启示</h2>
                <p className="text-white/80 text-xs font-medium mb-3">探索未知的指引，聆听内心的声音</p>
                <button type="button" className="rounded-xl bg-[#7f19e6] px-5 py-2.5 text-white text-sm font-bold shadow-lg shadow-[#7f19e6]/30 transition-transform active:scale-95">
                  <span className="flex items-center gap-1.5">
                    立即解读
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </span>
                </button>
              </div>
            </div>
          </motion.section>

          {/* Grid Section - 探索模式，卡片样式与历史页一致 */}
          <motion.section variants={item}>
            <div className="flex items-center justify-between mb-4 pt-2">
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">探索模式</h3>
              <button type="button" className="text-xs font-bold text-[#7f19e6] hover:opacity-80" onClick={() => onChangeTab('spreads')}>查看全部</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: 'wb_sunny', title: '每日一签', desc: '今日运势指引', color: 'bg-amber-100 dark:bg-[#362447] text-amber-600 dark:text-[#7f19e6]', filter: '运势' as SpreadInitialFilter },
                { icon: 'favorite', title: '情感解惑', desc: '爱与关系的启示', color: 'bg-pink-100 dark:bg-[#362447] text-pink-600 dark:text-[#7f19e6]', filter: '爱情' as SpreadInitialFilter, filled: true },
                { icon: 'work', title: '事业指引', desc: '职业发展方向', color: 'bg-blue-100 dark:bg-[#362447] text-blue-600 dark:text-[#7f19e6]', filter: '事业' as SpreadInitialFilter, filled: true },
                { icon: 'all_inclusive', title: '万事皆问', desc: '自由提问解惑', color: 'bg-violet-100 dark:bg-[#362447] text-violet-600 dark:text-[#7f19e6]', filter: '抉择' as SpreadInitialFilter },
              ].map((card) => (
                <motion.button
                  key={card.title}
                  type="button"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onChangeTab('spreads', { initialSpreadFilter: card.filter })}
                  className="group flex flex-col gap-3 rounded-2xl bg-white dark:bg-[#261a32] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all text-left border border-gray-100 dark:border-white/5 hover:border-[#7f19e6]/30"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${card.color} group-hover:scale-110 transition-transform`}>
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

          {/* Featured Article / Wisdom - 与历史卡片同风格 */}
          <motion.section variants={item} className="mt-8">
            <div className="rounded-2xl bg-white dark:bg-[#261a32] p-6 flex items-center justify-between gap-4 border border-gray-100 dark:border-white/5">
              <div className="flex-1">
                <span className="inline-block px-2 py-1 rounded bg-[#7f19e6]/10 text-[10px] font-bold text-[#7f19e6] uppercase tracking-wide mb-2">{t('dailyWisdom')}</span>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">"命运不是等待风暴过去，而是学会在雨中翩翩起舞。"</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#362447] flex items-center justify-center shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[#7f19e6]">spa</span>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </main>

      <BottomNav currentTab="home" onChangeTab={onChangeTab} theme="purple" />
    </div>
  );
}
