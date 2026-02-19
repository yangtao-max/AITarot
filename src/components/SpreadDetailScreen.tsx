import React from 'react';
import { TarotSpread } from '../constants/spreads';

interface SpreadDetailScreenProps {
  spread: TarotSpread;
  onBack: () => void;
  onStart: (spread: TarotSpread) => void;
}

export default function SpreadDetailScreen({ spread, onBack, onStart }: SpreadDetailScreenProps) {
  return (
    <div className="relative flex h-full min-h-screen w-full max-w-md flex-col overflow-hidden bg-[#f7f6f8] dark:bg-[#191121] text-slate-900 dark:text-slate-100 shadow-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-[#f7f6f8]/90 dark:bg-[#191121]/90 px-4 py-3 backdrop-blur-md">
        <button 
          onClick={onBack}
          className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-white/10 text-slate-900 dark:text-slate-100 shadow-sm transition-colors hover:bg-slate-100 dark:hover:bg-white/20"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">牌阵详情</h1>
        <div className="size-10"></div> {/* Spacer */}
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-32 pt-4 hide-scrollbar">
        {/* Spread Visual Representation */}
        <div className="relative flex h-48 w-full items-center justify-center rounded-3xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 shadow-sm mb-8">
          {spread.layoutType === 'single' && (
            <div className="h-28 w-20 rounded-lg bg-white dark:bg-slate-700 shadow-md border-2 border-[#7f19e6]"></div>
          )}
          {spread.layoutType === 'triangle' && (
            <div className="relative h-32 w-48">
              <div className="absolute bottom-4 left-4 h-20 w-14 rounded-lg bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-20 w-14 rounded-lg bg-white dark:bg-slate-700 shadow-md border-2 border-[#7f19e6] z-10"></div>
              <div className="absolute bottom-4 right-4 h-20 w-14 rounded-lg bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600"></div>
            </div>
          )}
          {spread.layoutType === 'hexagram' && (
            <div className="relative h-40 w-40">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-12 w-8 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"></div>
              <div className="absolute top-[25%] right-0 h-12 w-8 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"></div>
              <div className="absolute bottom-[25%] right-0 h-12 w-8 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-12 w-8 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"></div>
              <div className="absolute bottom-[25%] left-0 h-12 w-8 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"></div>
              <div className="absolute top-[25%] left-0 h-12 w-8 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-10 rounded bg-[#7f19e6]/10 border-2 border-[#7f19e6] z-10"></div>
            </div>
          )}
          {spread.layoutType === 'cross' && (
            <div className="flex gap-8 items-center">
              <div className="relative h-32 w-24">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-10 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 z-0"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-16 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 z-10 rotate-90 opacity-50"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-10 w-7 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-10 w-7 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"></div>
                <div className="absolute top-1/2 left-0 -translate-y-1/2 h-10 w-7 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"></div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 h-10 w-7 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"></div>
              </div>
              <div className="flex flex-col gap-1.5">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-8 w-6 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"></div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{spread.name}</h2>
              {spread.tag && (
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  spread.tagType === 'hot' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300' :
                  spread.tagType === 'expert' ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' :
                  'bg-[#f2eafd] text-[#7f19e6] dark:bg-[#7f19e6]/20 dark:text-[#f2eafd]'
                }`}>
                  {spread.tag}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">style</span>
                {spread.cardCount} 张牌
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                {spread.duration}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {spread.fullDescription}
          </p>

          {/* Positions List */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">list_alt</span>
              牌位说明
            </h3>
            <div className="space-y-3">
              {spread.positions.map((pos) => (
                <div key={pos.id} className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 shadow-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f2eafd] dark:bg-[#7f19e6]/20 text-[#7f19e6] text-sm font-bold">
                    {pos.id}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{pos.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {pos.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Action Button */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#f7f6f8] via-[#f7f6f8] to-transparent dark:from-[#191121] dark:via-[#191121] z-30">
        <button 
          onClick={() => onStart(spread)}
          className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-[#7f19e6] text-white font-bold text-lg shadow-lg shadow-[#7f19e6]/30 transition-transform active:scale-[0.98] hover:bg-[#6a15c2]"
        >
          <span className="material-symbols-outlined">auto_awesome</span>
          开始占卜
        </button>
      </div>
    </div>
  );
}
