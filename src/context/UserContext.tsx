import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

const USERS_KEY = 'aura_tarot_users';
const CURRENT_USER_ID_KEY = 'aura_tarot_current_user_id';

export interface User {
  id: string;
  name: string;
  createdAt: string;
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

function loadUsers(): Record<string, User> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, User>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadCurrentUserId(): string | null {
  return localStorage.getItem(CURRENT_USER_ID_KEY);
}

function saveCurrentUserId(id: string) {
  localStorage.setItem(CURRENT_USER_ID_KEY, id);
}

/** 迁移旧数据到首个用户（无用户体系时的数据） */
function migrateToFirstUser(userId: string) {
  const prefix = `user_${userId}_`;
  const migrate = (oldKey: string, newKey: string) => {
    try {
      const v = localStorage.getItem(oldKey);
      if (v) {
        localStorage.setItem(newKey, v);
        localStorage.removeItem(oldKey);
      }
    } catch (_) {}
  };
  migrate('tarot_readings', `${prefix}tarot_readings`);
  migrate('aura_tarot_settings', `${prefix}aura_tarot_settings`);
  migrate('app_language', `${prefix}app_language`);
  migrate('aura_tarot_current_question', `${prefix}aura_tarot_current_question`);
}

interface UserContextType {
  currentUser: User | null;
  users: User[];
  setCurrentUserId: (id: string) => void;
  createUser: (name?: string) => User;
  updateUserName: (id: string, name: string) => void;
  /** 为账号 id 确保存在一个 User（用于注册后） */
  ensureUser: (id: string, name: string) => void;
  /** 当前用户下的存储键，用于隔离数据 */
  storageKey: (suffix: string) => string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_NAME = '用户1';
export const GUEST_USER_ID = 'guest';

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsersState] = useState<Record<string, User>>(() => loadUsers());
  const [currentUserId, setCurrentUserIdState] = useState<string | null>(() => loadCurrentUserId());

  const setCurrentUserId = useCallback((id: string) => {
    setCurrentUserIdState(id);
    saveCurrentUserId(id);
  }, []);

  const storageKey = useCallback(
    (suffix: string) => (currentUserId ? `user_${currentUserId}_${suffix}` : ''),
    [currentUserId]
  );

  const createUser = useCallback(
    (name?: string): User => {
      const id = generateId();
      const user: User = {
        id,
        name: name?.trim() || `用户${Object.keys(users).length + 1}`,
        createdAt: new Date().toISOString(),
      };
      const next = { ...users, [id]: user };
      setUsersState(next);
      saveUsers(next);
      setCurrentUserId(id);
      return user;
    },
    [users, setCurrentUserId]
  );

  const updateUserName = useCallback((id: string, name: string) => {
    const trimmed = name.trim() || DEFAULT_NAME;
    setUsersState((prev) => {
      const u = prev[id];
      if (!u) return prev;
      const next = { ...prev, [id]: { ...u, name: trimmed } };
      saveUsers(next);
      return next;
    });
  }, []);

  const ensureUser = useCallback((id: string, name: string) => {
    setUsersState((prev) => {
      if (prev[id]) return prev;
      const next = { ...prev, [id]: { id, name: name.trim() || DEFAULT_NAME, createdAt: new Date().toISOString() } };
      saveUsers(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const userMap = loadUsers();
    const currentId = loadCurrentUserId();
    const hasUsers = Object.keys(userMap).length > 0;

    if (!hasUsers) {
      const guestUser: User = {
        id: GUEST_USER_ID,
        name: '游客',
        createdAt: new Date().toISOString(),
      };
      migrateToFirstUser(GUEST_USER_ID);
      const next = { [GUEST_USER_ID]: guestUser };
      setUsersState(next);
      saveUsers(next);
      setCurrentUserIdState(GUEST_USER_ID);
      saveCurrentUserId(GUEST_USER_ID);
      return;
    }

    if (!currentId || !userMap[currentId]) {
      const firstId = Object.keys(userMap)[0];
      setCurrentUserIdState(firstId);
      saveCurrentUserId(firstId);
    }
  }, []);

  const usersList = Object.values(users);
  const currentUser = currentUserId && users[currentUserId] ? users[currentUserId] : usersList[0] ?? null;

  const value: UserContextType = {
    currentUser,
    users: usersList,
    setCurrentUserId,
    createUser,
    updateUserName,
    ensureUser,
    storageKey,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (ctx === undefined) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
