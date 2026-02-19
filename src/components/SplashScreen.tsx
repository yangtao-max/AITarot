import React, { useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#101322] text-slate-900 dark:text-slate-100 h-screen w-full overflow-hidden select-none flex flex-col items-center justify-center p-6 relative">
      {/* Abstract Light/Shadow Background Effects */}
      <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-br from-white/60 via-transparent to-transparent pointer-events-none mix-blend-soft-light"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(17,50,212,0.03)_0%,transparent_50%)] pointer-events-none"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center animate-fade-in-up">
        {/* Logo Container */}
        <div className="group relative w-32 h-48 mb-8 transition-transform duration-700 hover:scale-105">
          {/* Card Shape */}
          <div className="absolute inset-0 border-2 border-[#1132d4] rounded-xl bg-white/50 backdrop-blur-sm shadow-[0_20px_40px_-12px_rgba(17,50,212,0.1)] flex items-center justify-center">
            {/* Decorative inner border */}
            <div className="absolute inset-2 border border-[#1132d4]/20 rounded-lg pointer-events-none"></div>
            {/* Question Mark Symbol */}
            <span className="material-symbols-outlined text-[#1132d4] text-[64px] font-light">
              help_center
            </span>
          </div>
          {/* Decorative Card Stack Effect (Behind) */}
          <div className="absolute inset-0 bg-[#1132d4]/5 rounded-xl rotate-6 -z-10 scale-95 origin-bottom-right transition-transform duration-500 group-hover:rotate-12"></div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-[#1132d4] text-3xl font-bold tracking-tight font-display">
            灵感塔罗 AI
          </h1>
          <p className="text-[#1132d4]/60 text-sm tracking-wide font-medium uppercase">
            Aura Tarot
          </p>
        </div>
      </div>

      {/* Footer / Loading State */}
      <div className="absolute bottom-12 w-full flex flex-col items-center justify-center space-y-4">
        {/* Minimalist Loader */}
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#1132d4]/40 animate-pulse"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#1132d4]/40 animate-pulse delay-75"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#1132d4]/40 animate-pulse delay-150"></div>
        </div>
        {/* Version info */}
        <p className="text-[#1132d4]/30 text-xs font-medium">v1.0.2</p>
      </div>
    </div>
  );
}
