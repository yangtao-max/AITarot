import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="bg-[#0d0614] text-white h-screen w-full overflow-hidden select-none flex flex-col items-center justify-center relative">
      {/* 深色渐变与星点 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a24] via-[#0d0614] to-[#050208]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_20%,rgba(127,25,230,0.15)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(75,238,43,0.06)_0%,transparent_40%)]" />

      {/* 装饰：塔罗牌轮廓 */}
      <motion.div
        className="absolute top-[18%] left-1/2 -translate-x-1/2 w-28 h-[180px] rounded-xl border-2 border-[#7f19e6]/40 bg-gradient-to-b from-[#2a1a3a] to-[#1a0a24] shadow-[0_0_40px_rgba(127,25,230,0.2)]"
        initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-24 h-40 rounded-lg border border-[#7f19e6]/30 bg-[#1a0a24]/80 flex items-center justify-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <span className="material-symbols-outlined text-[#7f19e6]/70 text-5xl">auto_awesome</span>
      </motion.div>

      {/* 标题 */}
      <motion.div
        className="relative z-10 text-center mt-[200px] px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold tracking-[0.2em] text-white/95 font-serif">
          灵感塔罗
        </h1>
        <p className="text-[#7f19e6]/80 text-sm tracking-[0.3em] mt-2 font-medium uppercase">
          Aura Tarot
        </p>
      </motion.div>

      {/* 副文案 */}
      <motion.p
        className="absolute bottom-[22%] left-0 right-0 text-center text-white/40 text-xs tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
      >
        聆听牌面 · 洞见内心
      </motion.p>

      {/* 底部加载指示 */}
      <motion.div
        className="absolute bottom-14 flex gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#7f19e6]/60"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  );
}
