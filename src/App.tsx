import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen';
import SpreadsScreen from './components/SpreadsScreen';
import HistoryScreen from './components/HistoryScreen';
import SpreadDetailScreen from './components/SpreadDetailScreen';
import ReadingScreen from './components/ReadingScreen';
import ProfileScreen from './components/ProfileScreen';
import SettingsScreen from './components/SettingsScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import { TarotSpread } from './constants/spreads';
import { TarotCard } from './constants/cards';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import { UserProvider, useUser } from './context/UserContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';

export type SpreadInitialFilter = '全部' | '爱情' | '事业' | '运势' | '抉择';

function AppContent() {
  const { t } = useLanguage();
  const { storageKey, currentUser } = useUser();
  const { canGuestDoReading, recordGuestReading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'home' | 'spreads' | 'history' | 'profile' | 'spreadDetail' | 'reading' | 'settings' | 'login' | 'register'>('splash');
  const [selectedSpread, setSelectedSpread] = useState<TarotSpread | null>(null);
  const [spreadInitialFilter, setSpreadInitialFilter] = useState<SpreadInitialFilter | null>(null);
  const [guestLimitToast, setGuestLimitToast] = useState(false);

  const handleSplashComplete = () => {
    setCurrentScreen('home');
  };

  const handleChangeTab = (tab: 'home' | 'spreads' | 'history' | 'profile', payload?: { initialSpreadFilter?: SpreadInitialFilter }) => {
    setCurrentScreen(tab);
    if (tab === 'spreads') {
      setSpreadInitialFilter(payload?.initialSpreadFilter ?? null);
    } else {
      setSpreadInitialFilter(null);
    }
  };

  const handleSelectSpread = (spread: TarotSpread) => {
    setSelectedSpread(spread);
    setCurrentScreen('spreadDetail');
  };

  const handleBackToSpreads = () => {
    setCurrentScreen('spreads');
  };

  const handleStartReading = (spread: TarotSpread) => {
    if (!canGuestDoReading()) {
      setGuestLimitToast(true);
      setTimeout(() => setGuestLimitToast(false), 3000);
      return;
    }
    setSelectedSpread(spread);
    setCurrentScreen('reading');
  };

  const handleReadingComplete = (result: { question: string; spread: TarotSpread; cards: { position: string; card: TarotCard }[]; interpretation: string }) => {
    if (!canGuestDoReading()) {
      setGuestLimitToast(true);
      setTimeout(() => setGuestLimitToast(false), 3000);
      return;
    }
    const newReading = {
      ...result,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    const key = currentUser ? storageKey('tarot_readings') : '';
    if (!key) return;
    try {
      const existingReadingsJson = localStorage.getItem(key);
      const existingReadings = existingReadingsJson ? JSON.parse(existingReadingsJson) : [];
      const updatedReadings = [newReading, ...existingReadings];
      localStorage.setItem(key, JSON.stringify(updatedReadings));
      recordGuestReading();
    } catch (error) {
      console.error('Failed to save reading to localStorage:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6f8] dark:bg-[#191121]">
      {currentScreen === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}
      {currentScreen === 'home' && <HomeScreen onChangeTab={handleChangeTab} />}
      {currentScreen === 'spreads' && (
        <SpreadsScreen 
          onChangeTab={handleChangeTab} 
          onSelectSpread={handleSelectSpread} 
          onStartReading={handleStartReading}
          initialFilter={spreadInitialFilter}
        />
      )}
      {currentScreen === 'history' && <HistoryScreen onChangeTab={handleChangeTab} />}
      {currentScreen === 'profile' && (
        <ProfileScreen 
          onChangeTab={handleChangeTab} 
          onOpenSettings={() => setCurrentScreen('settings')}
          onOpenLogin={() => setCurrentScreen('login')}
          onOpenRegister={() => setCurrentScreen('register')}
        />
      )}
      {currentScreen === 'settings' && (
        <SettingsScreen onBack={() => setCurrentScreen('profile')} />
      )}
      {currentScreen === 'spreadDetail' && selectedSpread && (
        <SpreadDetailScreen 
          spread={selectedSpread} 
          onBack={handleBackToSpreads} 
          onStart={handleStartReading}
        />
      )}
      {currentScreen === 'reading' && selectedSpread && (
        <ReadingScreen
          spread={selectedSpread}
          onBack={() => setCurrentScreen('spreadDetail')}
          onComplete={handleReadingComplete}
        />
      )}
      {currentScreen === 'login' && (
        <LoginScreen
          onBack={() => setCurrentScreen('profile')}
          onSuccess={() => setCurrentScreen('profile')}
          onGoRegister={() => setCurrentScreen('register')}
        />
      )}
      {currentScreen === 'register' && (
        <RegisterScreen
          onBack={() => setCurrentScreen('profile')}
          onSuccess={() => setCurrentScreen('profile')}
          onGoLogin={() => setCurrentScreen('login')}
        />
      )}
      {guestLimitToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-4 py-3 rounded-xl shadow-lg z-50 text-sm font-medium max-w-[90%] text-center">
          {t('guestLimitReached')}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AuthProvider>
        <LanguageProvider>
          <SettingsProvider>
            <AppContent />
          </SettingsProvider>
        </LanguageProvider>
      </AuthProvider>
    </UserProvider>
  );
}
