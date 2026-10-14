import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppTab, 
  LanguageCode, 
  UserPreferences, 
  VanityItem, 
  ShelfProduct, 
  AnalysisResult, 
  ShelfScanResult, 
  BeautyAnalysisResult, 
  NaturalRemedyResult 
} from '../types';
import { storageService } from '../services/storageService';
import { getTranslation } from '../services/i18nService';

interface AppContextType {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  vanityItems: VanityItem[];
  addToVanity: (item: Omit<VanityItem, 'id' | 'addedAt'>) => void;
  removeFromVanity: (id: string) => void;
  toggleFavoriteVanity: (id: string) => void;
  // Shared active data across tabs
  currentShelfProducts: ShelfProduct[];
  setCurrentShelfProducts: (prods: ShelfProduct[]) => void;
  lastSingleResult: AnalysisResult | null;
  setLastSingleResult: (res: AnalysisResult | null) => void;
  lastShelfResult: ShelfScanResult | null;
  setLastShelfResult: (res: ShelfScanResult | null) => void;
  lastBeautyResult: BeautyAnalysisResult | null;
  setLastBeautyResult: (res: BeautyAnalysisResult | null) => void;
  lastNaturalResult: NaturalRemedyResult | null;
  setLastNaturalResult: (res: NaturalRemedyResult | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => storageService.getPreferences());
  const [activeTab, setActiveTab] = useState<AppTab>('shelf');
  const [vanityItems, setVanityItems] = useState<VanityItem[]>(() => storageService.getVanityItems());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Shared state
  const [currentShelfProducts, setCurrentShelfProducts] = useState<ShelfProduct[]>([]);
  const [lastSingleResult, setLastSingleResult] = useState<AnalysisResult | null>(null);
  const [lastShelfResult, setLastShelfResult] = useState<ShelfScanResult | null>(null);
  const [lastBeautyResult, setLastBeautyResult] = useState<BeautyAnalysisResult | null>(null);
  const [lastNaturalResult, setLastNaturalResult] = useState<NaturalRemedyResult | null>(null);

  const language = preferences.language;

  const setLanguage = (lang: LanguageCode) => {
    const updated = storageService.savePreferences({ language: lang });
    setPreferences(updated);
  };

  const updatePreferences = (partial: Partial<UserPreferences>) => {
    const updated = storageService.savePreferences(partial);
    setPreferences(updated);
  };

  const addToVanity = (item: Omit<VanityItem, 'id' | 'addedAt'>) => {
    const saved = storageService.saveVanityItem(item);
    setVanityItems(storageService.getVanityItems());
    showToast(`"${saved.name}" added to My Vanity`);
  };

  const removeFromVanity = (id: string) => {
    storageService.removeVanityItem(id);
    setVanityItems(storageService.getVanityItems());
    showToast("Removed from vanity");
  };

  const toggleFavoriteVanity = (id: string) => {
    storageService.toggleVanityFavorite(id);
    setVanityItems(storageService.getVanityItems());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 3200);
  };

  const t = (key: string) => getTranslation(key, language);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        preferences,
        updatePreferences,
        vanityItems,
        addToVanity,
        removeFromVanity,
        toggleFavoriteVanity,
        currentShelfProducts,
        setCurrentShelfProducts,
        lastSingleResult,
        setLastSingleResult,
        lastShelfResult,
        setLastShelfResult,
        lastBeautyResult,
        setLastBeautyResult,
        lastNaturalResult,
        setLastNaturalResult,
        toastMessage,
        showToast,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
