import React from 'react';
import { 
  Sparkles, 
  LayoutGrid, 
  Palette, 
  Scan, 
  Leaf, 
  MessageSquare, 
  Globe, 
  Heart,
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppTab, LanguageCode } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    language, 
    setLanguage, 
    vanityItems, 
    t 
  } = useApp();

  const tabs: { id: AppTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'shelf', label: t('tabShelf'), icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'beauty', label: t('tabBeauty'), icon: <Palette className="w-4 h-4" /> },
    { id: 'single', label: t('tabSingle'), icon: <Scan className="w-4 h-4" /> },
    { id: 'routine', label: t('tabRoutine'), icon: <SlidersHorizontal className="w-4 h-4" />, badge: 'New' },
    { id: 'natural', label: t('tabNatural'), icon: <Leaf className="w-4 h-4" /> },
    { 
      id: 'vanity', 
      label: t('tabVanity'), 
      icon: <Heart className="w-4 h-4" />, 
      badge: vanityItems.length > 0 ? String(vanityItems.length) : undefined 
    },
    { id: 'chat', label: t('tabChat'), icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'ja', label: '日本語' },
    { code: 'hi', label: 'हिन्दी' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-zinc-200/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('shelf')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-md shadow-zinc-900/10 transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5 text-rose-300 transition-transform group-hover:rotate-12" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-zinc-950 font-sans">
                  Dermalyze
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 rounded-md border border-rose-500/20">
                  2.0
                </span>
              </div>
              <p className="hidden sm:block text-[10px] text-zinc-500 font-medium tracking-tight">
                Clinical Dermatology & Cosmetic Intelligence
              </p>
            </div>
          </div>

          {/* Right Controls: Clean Language Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="pl-8 pr-3 py-1.5 bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 text-xs font-semibold rounded-full border-none outline-none cursor-pointer appearance-none transition-colors"
                aria-label="Select Language"
              >
                {languages.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Tab Bar */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto scrollbar-hide py-2.5 border-t border-zinc-200/40">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-zinc-950 text-white shadow-md shadow-zinc-950/10'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive 
                      ? 'bg-rose-500 text-white' 
                      : 'bg-zinc-200 text-zinc-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
