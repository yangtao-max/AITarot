import React, { useState, useEffect } from 'react';
import { TarotSpread } from '../constants/spreads';
import { TarotCard, TAROT_CARDS } from '../constants/cards';
import { interpretTarot } from '../services/aiService';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

interface ReadingScreenProps {
  spread: TarotSpread;
  onBack: () => void;
  onComplete: (result: { question: string; spread: TarotSpread; cards: { position: string; card: TarotCard }[]; interpretation: string }) => void;
}

export default function ReadingScreen({ spread, onBack, onComplete }: ReadingScreenProps) {
  const [step, setStep] = useState<'question' | 'draw' | 'interpreting' | 'result'>('question');
  const [question, setQuestion] = useState(() => localStorage.getItem('aura_tarot_current_question') || '');
  const [drawnCards, setDrawnCards] = useState<{ position: string; card: TarotCard }[]>([]);
  const [interpretation, setInterpretation] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [interpretingMessageIndex, setInterpretingMessageIndex] = useState(0);
  const { t } = useLanguage();
  const { settings } = useSettings();

  // Persist question
  useEffect(() => {
    localStorage.setItem('aura_tarot_current_question', question);
  }, [question]);

  const handleStartDraw = () => {
    if (!question.trim()) {
      alert(t('questionPlaceholder'));
      return;
    }
    setStep('draw');
  };

  const drawCard = () => {
    if (isDrawing || isShuffling || drawnCards.length >= spread.cardCount) return;

    setIsShuffling(true);
    
    // Shuffle animation
    setTimeout(() => {
      setIsShuffling(false);
      setIsDrawing(true);
      
      setTimeout(() => {
        const remainingCards = TAROT_CARDS.filter(c => !drawnCards.find(d => d.card.name === c.name));
        const randomCard = remainingCards[Math.floor(Math.random() * remainingCards.length)];
        const currentPosition = spread.positions[drawnCards.length].name;
        
        setDrawnCards([...drawnCards, { position: currentPosition, card: randomCard }]);
        setIsDrawing(false);
      }, 600);
    }, 1000);
  };

  useEffect(() => {
    if (drawnCards.length === spread.cardCount && step === 'draw') {
      const timer = setTimeout(() => {
        handleInterpret();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [drawnCards]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'interpreting') {
      interval = setInterval(() => {
        setInterpretingMessageIndex(prev => (prev + 1) % (t('interpretingMessages') as any[]).length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [step, t]);

  const handleInterpret = async () => {
    setStep('interpreting');
    const result = await interpretTarot(question, spread, drawnCards, settings);
    setInterpretation(result);
    setStep('result');
    // Clear persisted question on completion
    localStorage.removeItem('aura_tarot_current_question');
  };

  const handleCopy = async () => {
    const shareText = `${t('shareTitle')}\n\n${t('questionHint')}: ${question}\n\n${interpretation.replace(/!\[.*?\]\(.*?\)/g, '')}`;
    try {
      await navigator.clipboard.writeText(shareText);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.log('Copy failed', err);
    }
  };

  const handleShare = async () => {
    const shareText = `${t('shareTitle')}\n\n${t('questionHint')}: ${question}\n\n${interpretation.replace(/!\[.*?\]\(.*?\)/g, '')}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('shareTitle'),
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full max-w-md flex-col overflow-hidden bg-[#191121] text-white shadow-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-[#191121]/90 px-4 py-3 backdrop-blur-md">
        <button 
          onClick={onBack}
          className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white shadow-sm transition-colors hover:bg-white/20"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <h1 className="text-lg font-bold">{spread.name}{t('startReading')}</h1>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-24 pt-4 hide-scrollbar flex flex-col items-center">
        <AnimatePresence mode="wait">
          {step === 'question' && (
            <motion.div 
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full space-y-8 mt-12"
            >
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <span className="material-symbols-outlined text-6xl text-[#7f19e6] animate-pulse">psychic</span>
                </div>
                <h2 className="text-2xl font-bold">{t('prepareQuestion')}</h2>
                <p className="text-slate-400 text-sm">{t('questionHint')}</p>
              </div>

              <div className="space-y-4">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={t('questionPlaceholder')}
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#7f19e6]/50 transition-all resize-none"
                />
                <button
                  onClick={handleStartDraw}
                  className="w-full h-14 rounded-2xl bg-[#7f19e6] text-white font-bold text-lg shadow-lg shadow-[#7f19e6]/30 transition-transform active:scale-95"
                >
                  {t('ready')}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'draw' && (
            <motion.div 
              key="draw"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center space-y-8 mt-8"
            >
              <div className="text-center">
                <h2 className="text-xl font-bold">{t('drawHint')}</h2>
                <p className="text-slate-400 text-sm mt-1">{t('drawn')} {drawnCards.length} / {spread.cardCount}</p>
              </div>

              {/* Card Stack */}
              <div className="relative h-64 w-44 cursor-pointer group" onClick={drawCard}>
                <AnimatePresence>
                  {isShuffling ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ x: 0, rotate: 0 }}
                          animate={{ 
                            x: [0, (i - 2) * 40, 0],
                            rotate: [0, (i - 2) * 15, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 0.8, 
                            repeat: Infinity,
                            delay: i * 0.1
                          }}
                          className="absolute inset-0 bg-[#7f19e6] rounded-xl border-2 border-white/20 shadow-xl"
                        >
                          <div className="absolute inset-2 border border-white/10 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl text-white/20">style</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      layoutId="card-stack"
                      className="absolute inset-0 bg-[#7f19e6] rounded-xl border-2 border-white/20 shadow-2xl transform transition-transform group-hover:-translate-y-2"
                    >
                      <div className="absolute inset-2 border border-white/10 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-white/30">style</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Decorative layers */}
                {!isShuffling && (
                  <>
                    <div className="absolute inset-0 bg-[#7f19e6] rounded-xl border-2 border-white/20 -z-10 translate-x-1 translate-y-1"></div>
                    <div className="absolute inset-0 bg-[#7f19e6] rounded-xl border-2 border-white/20 -z-20 translate-x-2 translate-y-2"></div>
                  </>
                )}
              </div>

              {/* Drawn Cards Display */}
              <div className="grid grid-cols-3 gap-4 w-full pt-8">
                {drawnCards.map((d, i) => (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0, rotate: -20, y: 50 }}
                    animate={{ scale: 1, rotate: 0, y: 0 }}
                    whileHover={{ scale: 1.05, y: -5, zIndex: 10 }}
                    className="flex flex-col items-center gap-2 relative group"
                    onMouseEnter={() => setHoveredCardIndex(i)}
                    onMouseLeave={() => setHoveredCardIndex(null)}
                  >
                      <div className="aspect-[2/3] w-full rounded-lg bg-white/10 border border-white/20 overflow-hidden relative shadow-lg">
                        {d.card.image ? (
                          <img src={d.card.image} alt={d.card.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800">
                            <span className="material-symbols-outlined text-white/20">image_not_supported</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <span className="absolute bottom-1 left-1 text-[8px] font-bold">{d.card.name}</span>
                      </div>
                    <span className="text-[10px] text-slate-400 font-medium">{d.position}</span>
                    
                    {/* Tooltip */}
                    <AnimatePresence>
                      {hoveredCardIndex === i && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-32 p-2 bg-white text-slate-900 rounded-lg shadow-xl z-50 text-[10px] leading-relaxed"
                        >
                          <div className="font-bold mb-1 text-[#7f19e6]">{d.card.name}</div>
                          {d.card.meaning}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white"></div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'interpreting' && (
            <motion.div 
              key="interpreting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex flex-col items-center justify-center space-y-10 mt-24"
            >
              <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="size-32 rounded-full border-2 border-dashed border-[#7f19e6]/40"
                ></motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="size-20 rounded-full border-4 border-[#7f19e6]/20 border-t-[#7f19e6] animate-spin"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-[#7f19e6] animate-pulse">auto_awesome</span>
                </div>
              </div>
              <div className="text-center space-y-4 max-w-[240px]">
                <h2 className="text-xl font-bold">{t('interpreting')}</h2>
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={interpretingMessageIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-slate-400 text-sm italic"
                  >
                    {(t('interpretingMessages') as any[])[interpretingMessageIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-8 pb-12"
            >
              <div className="bg-white/5 rounded-3xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#7f19e6]">
                    <span className="material-symbols-outlined">auto_awesome</span>
                    <h2 className="text-lg font-bold">{t('interpretationResult')}</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                      {t('copy')}
                    </button>
                    <button 
                      onClick={handleShare}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">share</span>
                      {t('share')}
                    </button>
                  </div>
                </div>
                <div className="markdown-body prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">
                  <ReactMarkdown
                    components={{
                      img: ({ node, ...props }) => {
                        if (!props.src) return null;
                        return (
                          <img 
                            {...props} 
                            className="rounded-xl border border-white/10 my-4 w-full aspect-video object-cover shadow-lg" 
                            referrerPolicy="no-referrer"
                          />
                        );
                      },
                      p: ({ children }) => <p className="mb-4">{children}</p>,
                      h3: ({ children }) => <h3 className="text-[#7f19e6] font-bold mt-6 mb-2">{children}</h3>,
                      strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
                    }}
                  >
                    {interpretation}
                  </ReactMarkdown>
                </div>
              </div>

              <button
                onClick={() => onComplete({ question, spread, cards: drawnCards, interpretation })}
                className="w-full h-14 rounded-2xl bg-[#7f19e6] text-white font-bold text-lg shadow-lg shadow-[#7f19e6]/30 transition-transform active:scale-95"
              >
                {t('saveAndBack')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-6 py-3 rounded-full shadow-2xl z-50 font-bold text-sm"
          >
            {t('copySuccess')}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
