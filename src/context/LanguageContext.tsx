import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { TRANSLATIONS, Language } from '../constants/translations';
import { useUser } from './UserContext';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS['zh']) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { storageKey, currentUser } = useUser();
  const key = currentUser ? storageKey('app_language') : '';

  const [language, setLanguageState] = useState<Language>(() => {
    if (!key) return 'zh';
    const saved = localStorage.getItem(key);
    return (saved as Language) || 'zh';
  });

  useEffect(() => {
    if (!key) return;
    const saved = localStorage.getItem(key);
    setLanguageState((saved as Language) || 'zh');
  }, [key]);

  const setLanguage = useCallback(
    (lang: Language) => {
      setLanguageState(lang);
      if (key) localStorage.setItem(key, lang);
    },
    [key]
  );

  const t = useCallback(
    (k: keyof typeof TRANSLATIONS['zh']) => TRANSLATIONS[language][k] ?? (TRANSLATIONS['zh'] as any)[k],
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
