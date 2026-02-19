import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
  onBack: () => void;
  onSuccess: () => void;
  onGoRegister: () => void;
}

export default function LoginScreen({ onBack, onSuccess, onGoRegister }: LoginScreenProps) {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (result.ok) onSuccess();
    else setError(result.error || '登录失败');
  };

  return (
    <div className="min-h-screen bg-[#191121] text-white flex flex-col max-w-md mx-auto">
      <header className="flex items-center justify-between p-4 border-b border-white/10">
        <button type="button" onClick={onBack} className="p-2 rounded-full hover:bg-white/10">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">{t('loginTitle')}</h1>
        <div className="w-10" />
      </header>
      <main className="flex-1 p-6 flex flex-col justify-center">
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm text-slate-400 mb-2">{t('username')}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#7f19e6]"
              placeholder={t('username')}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#7f19e6]"
              placeholder={t('password')}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#7f19e6] text-white py-3.5 font-bold shadow-lg disabled:opacity-50"
          >
            {loading ? '...' : t('login')}
          </button>
          <p className="text-center text-slate-400 text-sm">
            还没有账号？{' '}
            <button type="button" onClick={onGoRegister} className="text-[#7f19e6] font-medium">
              {t('register')}
            </button>
          </p>
        </motion.form>
      </main>
    </div>
  );
}
