
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ChatInterface from './components/ChatInterface';
import VoiceInterface from './components/VoiceInterface';
import MarketInsight from './components/MarketInsight';
import { AppMode, LocationData } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);
  const [location, setLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const renderContent = () => {
    switch (mode) {
      case AppMode.CHAT:
        return <ChatInterface location={location} />;
      case AppMode.VOICE:
        return <VoiceInterface />;
      case AppMode.MARKET:
        return <MarketInsight location={location} />;
      default:
        return <ChatInterface location={location} />;
    }
  };

  return (
    <Layout activeMode={mode} onModeChange={setMode}>
      {renderContent()}
    </Layout>
  );
};

export default App;
