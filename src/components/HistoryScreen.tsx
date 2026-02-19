import React, { useState, useEffect } from 'react';
import BottomNav from './BottomNav';
import { TarotSpread } from '../constants/spreads';
import { TarotCard } from '../constants/cards';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface TarotReading {
  id: string;
  question: string;
  spread: TarotSpread;
  cards: { position: string; card: TarotCard }[];
  interpretation: string;
  timestamp: string;
}

interface HistoryScreenProps {
  onChangeTab: (tab: 'home' | 'spreads' | 'history' | 'profile') => void;
}

export default function HistoryScreen({ onChangeTab }: HistoryScreenProps) {
  const [readings, setReadings] = useState<TarotReading[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const { t } = useLanguage();

  const FILTER_TAGS = [
    { id: 'all', label: t('all') },
    { id: 'daily', label: t('dailyWisdom') },
    { id: 'love', label: t('love') },
    { id: 'career', label: t('career') },
    { id: 'year', label: t('fortune') },
  ];

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tarot_readings');
      if (saved) {
        setReadings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load readings:', error);
    }
  }, []);

  const filteredReadings = readings.filter(r => 
    activeFilter === 'all' || r.spread.category === activeFilter
  );

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return {
      dateStr: `${date.getMonth() + 1}月${date.getDate()}日`,
      timeStr: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
      dayStr: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()]
    };
  };

  return (
    <div className="relative flex h-full min-h-screen w-full max-w-md flex-col overflow-hidden max-w-md mx-auto shadow-2xl bg-[#f7f6f8] dark:bg-[#191121] text-slate-900 dark:text-slate-100 font-display">
      {/* Header Section */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-[#f7f6f8]/90 dark:bg-[#191121]/90 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#362447] border border-white/10 overflow-hidden shrink-0">
            <span className="material-symbols-outlined text-[#7f19e6] text-xl">help</span>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">{t('history')}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('appDesc')}</p>
          </div>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-black/5 dark:text-slate-400 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </header>

      {/* Filter Tags */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto hide-scrollbar border-b border-transparent dark:border-white/5 bg-[#f7f6f8] dark:bg-[#191121]">
        {FILTER_TAGS.map(tag => (
          <motion.button
            key={tag.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter(tag.id)}
            className={`flex h-8 shrink-0 items-center justify-center rounded-full px-4 text-xs font-bold transition-all ${
              activeFilter === tag.id 
                ? 'bg-[#7f19e6] text-white shadow-lg shadow-[#7f19e6]/20' 
                : 'bg-white dark:bg-[#362447] border border-gray-200 dark:border-white/5 text-slate-600 dark:text-slate-300'
            }`}
          >
            {tag.label}
          </motion.button>
        ))}
      </div>

      {/* Main Content List */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 hide-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredReadings.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4"
            >
              <span className="material-symbols-outlined text-6xl opacity-20">history_edu</span>
              <p className="text-sm">{t('noHistory')}</p>
              {activeFilter !== 'all' ? (
                <button 
                  onClick={() => setActiveFilter('all')}
                  className="text-[#7f19e6] text-xs font-bold"
                >
                  {t('all')}
                </button>
              ) : (
                <button 
                  onClick={() => onChangeTab('spreads')}
                  className="px-6 py-2 bg-[#7f19e6] text-white rounded-full text-sm font-bold shadow-lg shadow-[#7f19e6]/20"
                >
                  {t('startFirstReading')}
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 pt-2 pb-1">
                <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {activeFilter === 'all' ? t('recentHistory') : FILTER_TAGS.find(t => t.id === activeFilter)?.label}
                </h2>
                <div className="h-px flex-1 bg-gray-200 dark:bg-white/10"></div>
              </div>

              {filteredReadings.map((reading, index) => {
                const { dateStr, timeStr, dayStr } = formatDate(reading.timestamp);
                return (
                  <motion.article 
                    layout
                    key={reading.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative overflow-hidden rounded-2xl bg-white dark:bg-[#261a32] border border-gray-100 dark:border-white/5 shadow-sm transition-all hover:shadow-md hover:border-[#7f19e6]/30"
                  >
                    <div className="absolute top-0 right-0 p-3">
                      <div className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        reading.spread.tagType === 'hot' ? 'bg-orange-100 text-orange-600' :
                        reading.spread.tagType === 'expert' ? 'bg-blue-100 text-blue-600' :
                        'bg-[#7f19e6]/10 text-[#7f19e6]'
                      }`}>
                        {reading.spread.name}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-[#362447] text-slate-400">
                          <span className="material-symbols-outlined text-lg">calendar_today</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{dateStr}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{dayStr} • {timeStr}</p>
                        </div>
                      </div>
                      <h3 className="text-base font-bold mb-3 text-slate-800 dark:text-slate-200 line-clamp-1">{reading.question}</h3>
                      
                      <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar">
                        {reading.cards.map((d, idx) => (
                          <div key={idx} className="relative aspect-[2/3] w-20 shrink-0 rounded-lg bg-gray-200 dark:bg-[#362447] overflow-hidden border border-gray-100 dark:border-white/5">
                            {d.card.image ? (
                              <img alt={d.card.name} className="h-full w-full object-cover opacity-80 mix-blend-overlay" src={d.card.image} referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-[#191121]">
                                <span className="material-symbols-outlined text-gray-400 dark:text-white/10 text-xs">image_not_supported</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <span className="absolute bottom-1 left-1.5 text-[8px] text-white/90 font-medium">{d.card.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav currentTab="history" onChangeTab={onChangeTab} theme="purple" />
    </div>
  );
}
