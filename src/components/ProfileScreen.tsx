import React, { useState } from 'react';
import BottomNav from './BottomNav';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';

interface ProfileScreenProps {
  onChangeTab: (tab: 'home' | 'spreads' | 'history' | 'profile') => void;
  onOpenSettings: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

function daysSince(isoDate: string): number {
  return Math.max(1, Math.floor((Date.now() - new Date(isoDate).getTime()) / 86400000));
}

export default function ProfileScreen({ onChangeTab, onOpenSettings, onOpenLogin, onOpenRegister }: ProfileScreenProps) {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, users, setCurrentUserId, createUser, updateUserName } = useUser();
  const { isGuest, guestRemainingToday, logout } = useAuth();
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');

  const startEditName = (user: { id: string; name: string }) => {
    setEditingName(user.id);
    setEditInput(user.name);
  };
  const saveEditName = () => {
    if (editingName && editInput.trim()) {
      updateUserName(editingName, editInput.trim());
      setEditingName(null);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto shadow-2xl bg-[#f7f6f8] dark:bg-[#191121] text-slate-900 dark:text-slate-100 font-display">
      {/* Header - 与牌阵/历史一致 */}
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-20 bg-[#f7f6f8]/90 dark:bg-[#191121]/90 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#362447] border border-white/10 text-[#7f19e6] shrink-0">
            <span className="material-symbols-outlined text-xl">person</span>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">{t('profile')}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('appDesc')}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto hide-scrollbar pb-24 px-4 space-y-6">
        {/* Current User Card */}
        {currentUser && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-6 rounded-2xl bg-white dark:bg-[#261a32] shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-4"
          >
            <div className="size-16 rounded-full bg-[#362447] p-1 shrink-0 border border-white/10">
              <div className="size-full rounded-full bg-slate-100 dark:bg-[#362447] flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-white/20">face</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {editingName === currentUser.id ? (
                  <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      onBlur={saveEditName}
                      onKeyDown={(e) => e.key === 'Enter' && saveEditName()}
                      className="flex-1 min-w-0 rounded-lg border border-[#7f19e6]/40 bg-white dark:bg-[#191121] px-3 py-2 text-base font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7f19e6]/50"
                      autoFocus
                      aria-label={t('editUserName')}
                      placeholder={t('editUserName')}
                    />
                    <button type="button" onClick={saveEditName} className="shrink-0 p-2 text-[#7f19e6]">
                      <span className="material-symbols-outlined">check</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <h2 className="text-xl font-bold truncate">{currentUser.name}</h2>
                    {currentUser.id !== 'guest' && (
                      <button
                        type="button"
                        onClick={() => startEditName(currentUser)}
                        className="shrink-0 p-1 rounded-full text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#7f19e6]"
                        aria-label={t('editUserName')}
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              <p className="text-xs text-slate-500 mt-0.5">
                {isGuest
                  ? (t('guestRemaining') as string).replace('{n}', String(guestRemainingToday))
                  : (t('daysExploring') as string).replace('{n}', String(daysSince(currentUser.createdAt)))}
              </p>
            </div>
          </motion.section>
        )}

        {/* 登录/注册 或 退出 */}
        <section className="space-y-3">
          {isGuest ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onOpenLogin}
                className="flex-1 rounded-2xl bg-[#7f19e6] text-white py-3.5 font-bold shadow-lg shadow-[#7f19e6]/20 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined">login</span>
                {t('login')}
              </button>
              <button
                type="button"
                onClick={onOpenRegister}
                className="flex-1 rounded-2xl border-2 border-[#7f19e6] text-[#7f19e6] py-3.5 font-bold flex items-center justify-center gap-2 hover:bg-[#7f19e6]/5 dark:hover:bg-[#7f19e6]/10 transition-colors"
              >
                <span className="material-symbols-outlined">person_add</span>
                {t('register')}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={logout}
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-300 py-3.5 font-medium flex items-center justify-center gap-2 hover:bg-black/5 dark:hover:bg-white/5"
            >
              <span className="material-symbols-outlined">logout</span>
              {t('logout')}
            </button>
          )}
        </section>

        {/* 用户列表 - 与历史列表卡片同风格 */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">{t('currentUser')}</h3>
          <div className="rounded-2xl bg-white dark:bg-[#261a32] overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm">
            {users.map((u) => (
              <div
                key={u.id}
                className={`flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 last:border-b-0 ${
                  currentUser?.id === u.id ? 'bg-[#7f19e6]/5 dark:bg-[#7f19e6]/10' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="size-10 rounded-full bg-[#362447] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#7f19e6] text-xl">person</span>
                  </div>
                  {editingName === u.id ? (
                    <input
                      type="text"
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      onBlur={saveEditName}
                      onKeyDown={(e) => e.key === 'Enter' && saveEditName()}
                      className="flex-1 min-w-0 rounded-lg border border-[#7f19e6]/40 bg-white dark:bg-[#191121] px-2 py-1.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7f19e6]/50"
                      autoFocus
                      aria-label={t('editUserName')}
                      placeholder={t('editUserName')}
                    />
                  ) : (
                    <>
                      <span className="font-medium truncate">{u.name}</span>
                      {currentUser?.id === u.id && (
                        <span className="text-xs text-[#7f19e6] shrink-0">({t('currentUser')})</span>
                      )}
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {editingName !== u.id && u.id !== 'guest' && (
                    <button
                      type="button"
                      onClick={() => startEditName(u)}
                      className="p-2 rounded-full text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#7f19e6]"
                      aria-label={t('editUserName')}
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                  )}
                  {currentUser?.id !== u.id && (
                    <button
                      type="button"
                      onClick={() => setCurrentUserId(u.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#7f19e6] text-white text-xs font-bold"
                    >
                      {t('switchUser')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Settings Section - 与历史卡片同风格 */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">{t('settings')}</h3>
          
          <div className="rounded-2xl bg-white dark:bg-[#261a32] overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm">
            {/* AI Model Setting */}
            <button 
              onClick={onOpenSettings}
              className="w-full p-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#7f19e6]">auto_awesome</span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">AI 模型设置</span>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </button>

            {/* Language Setting */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#7f19e6]">language</span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{t('language')}</span>
              </div>
              <div className="flex bg-slate-100 dark:bg-[#362447] p-1 rounded-xl border border-transparent dark:border-white/5">
                <button 
                  onClick={() => setLanguage('zh')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${language === 'zh' ? 'bg-white dark:bg-[#7f19e6] dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  中文
                </button>
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${language === 'en' ? 'bg-white dark:bg-[#7f19e6] dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Other Mock Settings */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#7f19e6]">notifications</span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">每日提醒</span>
              </div>
              <div className="size-10 flex items-center justify-center">
                <div className="w-10 h-5 bg-slate-200 dark:bg-[#362447] rounded-full relative border border-white/5">
                  <div className="absolute left-1 top-1 size-3 bg-white dark:bg-[#7f19e6] rounded-full shadow"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNav currentTab="profile" onChangeTab={onChangeTab} theme="purple" />
    </div>
  );
}
