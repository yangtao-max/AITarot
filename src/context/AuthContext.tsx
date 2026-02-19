import React, { createContext, useContext, useCallback, useState, useEffect, ReactNode } from 'react';
import { useUser } from './UserContext';

const ACCOUNTS_KEY = 'aura_tarot_accounts';
const GUEST_DAILY_DATE_KEY = 'user_guest_daily_date';
const GUEST_DAILY_COUNT_KEY = 'user_guest_daily_count';
export const GUEST_READINGS_PER_DAY = 20;

export interface Account {
  id: string;
  passwordHash: string;
  createdAt: string;
}

async function hashPassword(password: string): Promise<string> {
  const buf = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function loadAccounts(): Record<string, Account> {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAccounts(accounts: Record<string, Account>) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

interface AuthContextType {
  isGuest: boolean;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  guestRemainingToday: number;
  canGuestDoReading: () => boolean;
  recordGuestReading: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { currentUser, setCurrentUserId, ensureUser } = useUser();
  const [guestCount, setGuestCount] = useState(0);
  const [guestDate, setGuestDate] = useState('');

  const isGuest = currentUser?.id === 'guest';

  const refreshGuestDaily = useCallback(() => {
    const dateKey = getTodayKey();
    const storedDate = localStorage.getItem(GUEST_DAILY_DATE_KEY);
    const storedCount = localStorage.getItem(GUEST_DAILY_COUNT_KEY);
    if (storedDate !== dateKey) {
      localStorage.setItem(GUEST_DAILY_DATE_KEY, dateKey);
      localStorage.setItem(GUEST_DAILY_COUNT_KEY, '0');
      setGuestDate(dateKey);
      setGuestCount(0);
      return 0;
    }
    const count = parseInt(storedCount || '0', 10);
    setGuestDate(dateKey);
    setGuestCount(count);
    return count;
  }, []);

  useEffect(() => {
    if (isGuest) refreshGuestDaily();
  }, [isGuest, refreshGuestDaily]);

  const guestRemainingToday = Math.max(0, GUEST_READINGS_PER_DAY - guestCount);
  const canGuestDoReading = useCallback(() => {
    if (!isGuest) return true;
    const today = getTodayKey();
    const storedDate = localStorage.getItem(GUEST_DAILY_DATE_KEY);
    const storedCount = parseInt(localStorage.getItem(GUEST_DAILY_COUNT_KEY) || '0', 10);
    if (storedDate !== today) return true;
    return storedCount < GUEST_READINGS_PER_DAY;
  }, [isGuest]);

  const recordGuestReading = useCallback(() => {
    if (currentUser?.id !== 'guest') return;
    const today = getTodayKey();
    const storedDate = localStorage.getItem(GUEST_DAILY_DATE_KEY);
    let count = parseInt(localStorage.getItem(GUEST_DAILY_COUNT_KEY) || '0', 10);
    if (storedDate !== today) {
      count = 0;
      localStorage.setItem(GUEST_DAILY_DATE_KEY, today);
    }
    count += 1;
    localStorage.setItem(GUEST_DAILY_COUNT_KEY, String(count));
    setGuestCount(count);
    setGuestDate(today);
  }, [currentUser?.id]);

  const login = useCallback(
    async (username: string, password: string): Promise<{ ok: boolean; error?: string }> => {
      const trimmed = username.trim().toLowerCase();
      if (!trimmed || !password) return { ok: false, error: '请填写用户名和密码' };
      const accounts = loadAccounts();
      const acc = accounts[trimmed];
      if (!acc) return { ok: false, error: '用户不存在' };
      const hash = await hashPassword(password);
      if (hash !== acc.passwordHash) return { ok: false, error: '密码错误' };
      ensureUser(acc.id, trimmed);
      setCurrentUserId(acc.id);
      return { ok: true };
    },
    [setCurrentUserId, ensureUser]
  );

  const register = useCallback(
    async (username: string, password: string): Promise<{ ok: boolean; error?: string }> => {
      const trimmed = username.trim().toLowerCase();
      if (!trimmed || trimmed.length < 2) return { ok: false, error: '用户名至少 2 个字符' };
      if (!password || password.length < 6) return { ok: false, error: '密码至少 6 位' };
      const accounts = loadAccounts();
      if (accounts[trimmed]) return { ok: false, error: '用户名已存在' };
      const id = `acc_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      const passwordHash = await hashPassword(password);
      accounts[trimmed] = { id, passwordHash, createdAt: new Date().toISOString() };
      saveAccounts(accounts);
      ensureUser(id, trimmed);
      setCurrentUserId(id);
      return { ok: true };
    },
    [setCurrentUserId, ensureUser]
  );

  const logout = useCallback(() => {
    setCurrentUserId('guest');
  }, [setCurrentUserId]);

  const value: AuthContextType = {
    isGuest,
    login,
    register,
    logout,
    guestRemainingToday: isGuest ? guestRemainingToday : GUEST_READINGS_PER_DAY,
    canGuestDoReading,
    recordGuestReading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
