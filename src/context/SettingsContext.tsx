import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [settings, setSettings] = useState<AISettings>(() => {
    const saved = localStorage.getItem('aura_tarot_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const updateSettings = (newSettings: Partial<AISettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('aura_tarot_settings', JSON.stringify(updated));
      return updated;
    });
  };

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
