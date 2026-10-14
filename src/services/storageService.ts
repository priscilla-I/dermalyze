import { VanityItem, SkinJournalEntry, AnalysisResult, ShelfScanResult, BeautyAnalysisResult, NaturalRemedyResult, UserPreferences } from '../types';

const STORAGE_KEYS = {
  PREFERENCES: 'dermalyze_user_prefs_v2',
  VANITY: 'dermalyze_vanity_items_v2',
  JOURNAL: 'dermalyze_skin_journal_v2',
  HISTORY_SINGLE: 'dermalyze_hist_single_v2',
  HISTORY_SHELF: 'dermalyze_hist_shelf_v2',
  HISTORY_BEAUTY: 'dermalyze_hist_beauty_v2',
  HISTORY_NATURAL: 'dermalyze_hist_natural_v2',
  SAVED_REMEDIES: 'dermalyze_saved_remedies_v2'
};

const DEFAULT_PREFS: UserPreferences = {
  apiKey: process.env.GEMINI_API_KEY || '',
  selectedModel: 'gemini-2.5-flash',
  demoMode: !Boolean(process.env.GEMINI_API_KEY),
  language: 'en'
};

export const storageService = {
  getPreferences(): UserPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? { ...DEFAULT_PREFS, ...JSON.parse(data) } : DEFAULT_PREFS;
    } catch {
      return DEFAULT_PREFS;
    }
  },

  savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...prefs };
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save preferences', e);
    }
    return updated;
  },

  getVanityItems(): VanityItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VANITY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveVanityItem(item: Omit<VanityItem, 'id' | 'addedAt'>): VanityItem {
    const items = this.getVanityItems();
    const newItem: VanityItem = {
      ...item,
      id: 'vanity_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      addedAt: Date.now()
    };
    items.unshift(newItem);
    localStorage.setItem(STORAGE_KEYS.VANITY, JSON.stringify(items));
    return newItem;
  },

  removeVanityItem(id: string): void {
    const items = this.getVanityItems().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.VANITY, JSON.stringify(items));
  },

  toggleVanityFavorite(id: string): void {
    const items = this.getVanityItems().map(i => i.id === id ? { ...i, isFavorite: !i.isFavorite } : i);
    localStorage.setItem(STORAGE_KEYS.VANITY, JSON.stringify(items));
  },

  getSkinJournal(): SkinJournalEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JOURNAL);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addJournalEntry(entry: Omit<SkinJournalEntry, 'id'>): SkinJournalEntry {
    const entries = this.getSkinJournal();
    const newEntry: SkinJournalEntry = {
      ...entry,
      id: 'journal_' + Date.now()
    };
    entries.unshift(newEntry);
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries));
    return newEntry;
  },

  getSavedRemedies(): NaturalRemedyResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_REMEDIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveRemedy(remedy: NaturalRemedyResult): void {
    const items = this.getSavedRemedies();
    if (!items.some(r => r.remedy_name === remedy.remedy_name)) {
      items.unshift({ ...remedy, timestamp: Date.now() });
      localStorage.setItem(STORAGE_KEYS.SAVED_REMEDIES, JSON.stringify(items));
    }
  },

  deleteRemedy(name: string): void {
    const items = this.getSavedRemedies().filter(r => r.remedy_name !== name);
    localStorage.setItem(STORAGE_KEYS.SAVED_REMEDIES, JSON.stringify(items));
  }
};
