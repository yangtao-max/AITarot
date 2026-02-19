import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen';
import SpreadsScreen from './components/SpreadsScreen';
import HistoryScreen from './components/HistoryScreen';
import SpreadDetailScreen from './components/SpreadDetailScreen';
import ReadingScreen from './components/ReadingScreen';
import ProfileScreen from './components/ProfileScreen';
import SettingsScreen from './components/SettingsScreen';
import { TarotSpread } from './constants/spreads';
import { TarotCard } from './constants/cards';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'home' | 'spreads' | 'history' | 'profile' | 'spreadDetail' | 'reading' | 'settings'>('splash');
  const [selectedSpread, setSelectedSpread] = useState<TarotSpread | null>(null);

  const handleSplashComplete = () => {
    setCurrentScreen('home');
  };

  const handleChangeTab = (tab: 'home' | 'spreads' | 'history' | 'profile') => {
    setCurrentScreen(tab);
  };

  const handleSelectSpread = (spread: TarotSpread) => {
    setSelectedSpread(spread);
    setCurrentScreen('spreadDetail');
  };

  const handleBackToSpreads = () => {
    setCurrentScreen('spreads');
  };

  const handleStartReading = (spread: TarotSpread) => {
    setSelectedSpread(spread);
    setCurrentScreen('reading');
  };

  const handleReadingComplete = (result: { question: string; spread: TarotSpread; cards: { position: string; card: TarotCard }[]; interpretation: string }) => {
    const newReading = {
      ...result,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    try {
      const existingReadingsJson = localStorage.getItem('tarot_readings');
      const existingReadings = existingReadingsJson ? JSON.parse(existingReadingsJson) : [];
      const updatedReadings = [newReading, ...existingReadings];
      localStorage.setItem('tarot_readings', JSON.stringify(updatedReadings));
    } catch (error) {
      console.error('Failed to save reading to localStorage:', error);
    }

    setCurrentScreen('history');
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
        />
      )}
      {currentScreen === 'history' && <HistoryScreen onChangeTab={handleChangeTab} />}
      {currentScreen === 'profile' && (
        <ProfileScreen 
          onChangeTab={handleChangeTab} 
          onOpenSettings={() => setCurrentScreen('settings')}
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
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </LanguageProvider>
  );
}
