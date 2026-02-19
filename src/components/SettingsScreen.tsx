import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useSettings, AIProvider } from '../context/SettingsContext';

interface SettingsScreenProps {
  onBack: () => void;
}

const PROVIDERS: { id: AIProvider; name: string; models: string[] }[] = [
  { id: 'gemini', name: 'Google Gemini', models: ['gemini-3-flash-preview', 'gemini-3.1-pro-preview'] },
  { id: 'deepseek', name: 'DeepSeek', models: ['deepseek-chat', 'deepseek-reasoner'] },
  { id: 'qwen', name: 'Alibaba Qwen', models: ['qwen-max', 'qwen-plus', 'qwen-turbo'] },
  { id: 'kimi', name: 'Moonshot Kimi', models: ['moonshot-v1-8k', 'moonshot-v1-32k'] },
];

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { t } = useLanguage();
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
    onBack();
  };

  return (
    <div className="relative flex h-full min-h-screen w-full max-w-md flex-col overflow-hidden bg-[#f7f6f8] dark:bg-[#191121] text-slate-900 dark:text-slate-100 shadow-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-[#f7f6f8]/90 dark:bg-[#191121]/90 px-4 py-3 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <button 
          onClick={onBack}
          className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">{t('aiModelSettings')}</h1>
        <button 
          onClick={handleSave}
          className="text-[#7f19e6] font-bold px-4 py-2 rounded-lg hover:bg-[#7f19e6]/10 transition-colors"
        >
          {t('save')}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('selectProvider')}</h2>
          <div className="grid grid-cols-2 gap-3">
            {PROVIDERS.map(p => (
              <button
                key={p.id}
                onClick={() => setLocalSettings({ ...localSettings, provider: p.id, model: p.models[0] })}
                className={`p-4 rounded-2xl border-2 transition-all text-left space-y-1 ${
                  localSettings.provider === p.id 
                    ? 'border-[#7f19e6] bg-[#7f19e6]/5' 
                    : 'border-gray-100 dark:border-white/5 bg-white dark:bg-white/5'
                }`}
              >
                <div className="font-bold">{p.name}</div>
                <div className="text-[10px] text-slate-500">{p.id === 'gemini' ? t('recommended') : t('needKey')}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">API Key</h2>
          <div className="relative">
            <input
              type="password"
              value={localSettings.apiKey}
              onChange={(e) => setLocalSettings({ ...localSettings, apiKey: e.target.value })}
              placeholder={localSettings.provider === 'gemini' ? `${t('all')} (${t('recommended')})` : t('apiKeyPlaceholder')}
              className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f19e6]/50 transition-all"
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">key</span>
          </div>
          <p className="text-[10px] text-slate-500 px-1">
            {t('apiKeyHint')}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('selectModel')}</h2>
          <div className="space-y-2">
            {PROVIDERS.find(p => p.id === localSettings.provider)?.models.map(m => (
              <button
                key={m}
                onClick={() => setLocalSettings({ ...localSettings, model: m })}
                className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${
                  localSettings.model === m 
                    ? 'border-[#7f19e6] bg-[#7f19e6]/5 text-[#7f19e6]' 
                    : 'border-gray-100 dark:border-white/5 bg-white dark:bg-white/5'
                }`}
              >
                <span className="text-sm font-medium">{m}</span>
                {localSettings.model === m && <span className="material-symbols-outlined text-sm">check_circle</span>}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
