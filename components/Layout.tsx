
import React from 'react';
import { AppMode } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeMode, onModeChange }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-emerald-800 text-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-full">
            <svg className="w-6 h-6 text-emerald-800" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/>
            </svg>
          </div>
          <h1 className="heading-font text-xl md:text-2xl font-bold tracking-tight">AgriSense AI</h1>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <button 
            onClick={() => onModeChange(AppMode.CHAT)}
            className={`${activeMode === AppMode.CHAT ? 'border-b-2 border-white' : 'opacity-80 hover:opacity-100'}`}
          >
            Consultant
          </button>
          <button 
             onClick={() => onModeChange(AppMode.VOICE)}
             className={`${activeMode === AppMode.VOICE ? 'border-b-2 border-white' : 'opacity-80 hover:opacity-100'}`}
          >
            Hands-Free
          </button>
          <button 
             onClick={() => onModeChange(AppMode.MARKET)}
             className={`${activeMode === AppMode.MARKET ? 'border-b-2 border-white' : 'opacity-80 hover:opacity-100'}`}
          >
            Market Insight
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>

      {/* Mobile Footer Navigation */}
      <nav className="md:hidden sticky bottom-0 z-50 bg-white border-t border-stone-200 flex justify-around p-3">
        <button 
          onClick={() => onModeChange(AppMode.CHAT)}
          className={`flex flex-col items-center gap-1 ${activeMode === AppMode.CHAT ? 'text-emerald-700' : 'text-stone-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="text-[10px]">Chat</span>
        </button>
        <button 
          onClick={() => onModeChange(AppMode.VOICE)}
          className={`flex flex-col items-center gap-1 ${activeMode === AppMode.VOICE ? 'text-emerald-700' : 'text-stone-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          <span className="text-[10px]">Voice</span>
        </button>
        <button 
          onClick={() => onModeChange(AppMode.MARKET)}
          className={`flex flex-col items-center gap-1 ${activeMode === AppMode.MARKET ? 'text-emerald-700' : 'text-stone-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-[10px]">Market</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
