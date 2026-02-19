import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser } from './UserContext';

export type AIProvider = 'gemini' | 'deepseek' | 'qwen' | 'kimi';

export interface AISettings {
  provider: AIProvider;
  apiKey: string;
  model: string;
}

interface SettingsContextType {
  settings: AISettings;
  updateSettings: (newSettings: Partial<AISettings>) => void;
}

const DEFAULT_SETTINGS: AISettings = {
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-3-flash-preview',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { storageKey, currentUser } = useUser();
  const key = currentUser ? storageKey('aura_tarot_settings') : '';

  const [settings, setSettings] = useState<AISettings>(() => {
    if (!key) return DEFAULT_SETTINGS;
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    if (!key) return;
    try {
      const saved = localStorage.getItem(key);
      setSettings(saved ? JSON.parse(saved) : DEFAULT_SETTINGS);
    } catch {
      setSettings(DEFAULT_SETTINGS);
    }
  }, [key]);

  const updateSettings = useCallback(
    (newSettings: Partial<AISettings>) => {
      setSettings((prev) => {
        const updated = { ...prev, ...newSettings };
        if (key) localStorage.setItem(key, JSON.stringify(updated));
        return updated;
      });
    },
    [key]
  );

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
