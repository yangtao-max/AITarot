import React, { useState, useEffect } from 'react';
import BottomNav from './BottomNav';
import { SPREADS, TarotSpread } from '../constants/spreads';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import type { SpreadInitialFilter } from '../App';

interface SpreadsScreenProps {
  onChangeTab: (tab: 'home' | 'spreads' | 'history' | 'profile') => void;
  onSelectSpread: (spread: TarotSpread) => void;
  onStartReading: (spread: TarotSpread) => void;
  initialFilter?: SpreadInitialFilter | null;
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

export default function SpreadsScreen({ onChangeTab, onSelectSpread, onStartReading, initialFilter = null }: SpreadsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter ?? '全部');
  const { t } = useLanguage();

  useEffect(() => {
    if (initialFilter) setActiveFilter(initialFilter);
  }, [initialFilter]);

  const filterOptions = [
    { id: '全部', label: t('all') },
    { id: '爱情', label: t('love') },
    { id: '事业', label: t('career') },
    { id: '运势', label: t('fortune') },
    { id: '抉择', label: t('choice') },
  ];

  const filteredSpreads = SPREADS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === '全部' ||
      (activeFilter === '爱情' && (s.category === 'love' || s.category === 'general')) ||
      (activeFilter === '事业' && (s.category === 'career' || s.category === 'general')) ||
      (activeFilter === '运势' && (s.category === 'daily' || s.category === 'general')) ||
      (activeFilter === '抉择' && s.category === 'general');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="relative flex h-full min-h-screen w-full max-w-md flex-col overflow-hidden bg-[#f7f6f8] dark:bg-[#191121] text-slate-900 dark:text-slate-100 shadow-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-[#f7f6f8]/90 dark:bg-[#191121]/90 px-4 py-3 backdrop-blur-md">
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onChangeTab('home')}
          className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-white/10 text-slate-900 dark:text-slate-100 shadow-sm transition-colors hover:bg-slate-100 dark:hover:bg-white/20"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </motion.button>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-bold text-slate-900 dark:text-slate-100"
        >
          {t('selectSpread')}
        </motion.h1>
        <div className="size-10" />
      </header>

      {/* Search Bar */}
      <div className="px-4 py-2">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="group flex w-full items-center rounded-2xl bg-white dark:bg-white/5 px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all focus-within:ring-2 focus-within:ring-[#7f19e6]/50"
        >
          <span className="material-symbols-outlined text-[#7f19e6]/60 dark:text-[#7f19e6]/80 mr-3">search</span>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none dark:text-slate-100" 
            placeholder={t('searchSpread')} 
            type="text"
          />
        </motion.div>
      </div>

      {/* Filter Tags */}
      <div className="flex gap-3 overflow-x-auto px-4 py-3 hide-scrollbar">
        {filterOptions.map(option => (
          <motion.button 
            key={option.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter(option.id)}
            className={`flex h-9 min-w-[60px] shrink-0 items-center justify-center rounded-full text-sm font-medium transition-all ${
              activeFilter === option.id 
                ? 'bg-[#7f19e6] text-white shadow-lg shadow-[#7f19e6]/20' 
                : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-white/10 hover:bg-[#f2eafd] hover:text-[#7f19e6]'
            }`}
          >
            {option.label}
          </motion.button>
        ))}
      </div>

      {/* Spread List */}
      <main className="flex-1 overflow-y-auto px-4 pb-24 pt-2 space-y-4 hide-scrollbar">
        <AnimatePresence mode="popLayout">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {filteredSpreads.map((spread) => (
              <motion.div 
                layout
                variants={item}
                key={spread.id}
                whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(127,25,230,0.1)" }}
                className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-white dark:bg-white/5 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all border border-transparent hover:border-[#7f19e6]/20 cursor-pointer"
              >
                <div className="flex items-start justify-between" onClick={() => onSelectSpread(spread)}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{spread.name}</h3>
                      {spread.tag && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          spread.tagType === 'hot' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300' :
                          spread.tagType === 'expert' ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' :
                          'bg-[#f2eafd] text-[#7f19e6] dark:bg-[#7f19e6]/20 dark:text-[#f2eafd]'
                        }`}>
                          {spread.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{spread.description}</p>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 dark:bg-white/10 text-slate-400 group-hover:bg-[#7f19e6] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </div>
                </div>
                
                {/* Visual Diagram */}
                <div className="relative flex h-32 w-full items-center justify-center rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 py-4" onClick={() => onSelectSpread(spread)}>
                  {spread.layoutType === 'single' && (
                    <div className="h-20 w-14 rounded bg-white dark:bg-slate-700 shadow-sm border-2 border-[#7f19e6]/40 group-hover:border-[#7f19e6] transition-colors"></div>
                  )}
                  {spread.layoutType === 'triangle' && (
                    <div className="relative h-24 w-40">
                      <div className="absolute bottom-0 left-4 h-14 w-10 rounded bg-white dark:bg-slate-700 shadow-sm border-2 border-dashed border-slate-300 dark:border-slate-600 group-hover:border-[#7f19e6]/40 transition-colors"></div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-14 w-10 rounded bg-white dark:bg-slate-700 shadow-md border-2 border-[#7f19e6] group-hover:scale-105 transition-transform z-10"></div>
                      <div className="absolute bottom-0 right-4 h-14 w-10 rounded bg-white dark:bg-slate-700 shadow-sm border-2 border-dashed border-slate-300 dark:border-slate-600 group-hover:border-[#7f19e6]/40 transition-colors"></div>
                    </div>
                  )}
                  {spread.layoutType === 'hexagram' && (
                    <div className="relative h-28 w-28">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-5 rounded-[2px] bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600"></div>
                      <div className="absolute top-[25%] right-0 h-8 w-5 rounded-[2px] bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600"></div>
                      <div className="absolute bottom-[25%] right-0 h-8 w-5 rounded-[2px] bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600"></div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-8 w-5 rounded-[2px] bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600"></div>
                      <div className="absolute bottom-[25%] left-0 h-8 w-5 rounded-[2px] bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600"></div>
                      <div className="absolute top-[25%] left-0 h-8 w-5 rounded-[2px] bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-6 rounded bg-[#7f19e6]/10 border-2 border-[#7f19e6] z-10"></div>
                    </div>
                  )}
                  {spread.layoutType === 'cross' && (
                    <div className="flex gap-6 items-center">
                      <div className="relative h-24 w-20">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-8 rounded-[2px] bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 z-0"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-12 rounded-[2px] bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 z-10 rotate-90 opacity-50"></div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-5 rounded-[2px] bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600"></div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-8 w-5 rounded-[2px] bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600"></div>
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 h-8 w-5 rounded-[2px] bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600"></div>
                        <div className="absolute top-1/2 right-0 -translate-y-1/2 h-8 w-5 rounded-[2px] bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600"></div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="h-6 w-4 rounded-[2px] bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600"></div>
                        <div className="h-6 w-4 rounded-[2px] bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600"></div>
                        <div className="h-6 w-4 rounded-[2px] bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600"></div>
                        <div className="h-6 w-4 rounded-[2px] bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600"></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">style</span>
                      {spread.cardCount} {t('cardCount')}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      {spread.duration}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartReading(spread);
                    }}
                    className="bg-[#7f19e6] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-[#7f19e6]/20"
                  >
                    {t('startReading')}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav currentTab="spreads" onChangeTab={onChangeTab} theme="purple" />
    </div>
  );
}
