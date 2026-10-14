import React, { useState } from 'react';
import { 
  Heart, 
  Trash2, 
  Sun, 
  Moon, 
  Calendar, 
  Plus, 
  SlidersHorizontal, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Sparkles,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { storageService } from '../../services/storageService';
import { MOCK_SHELF_SCAN } from '../../services/mockDataService';
import { VanityItem, Rating, SkinJournalEntry } from '../../types';

export const VanityShelfTab: React.FC = () => {
  const { 
    vanityItems, 
    removeFromVanity, 
    toggleFavoriteVanity, 
    addToVanity, 
    setActiveTab, 
    setCurrentShelfProducts,
    showToast 
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [journalEntries, setJournalEntries] = useState<SkinJournalEntry[]>(() => storageService.getSkinJournal());

  // Quick journal log input state
  const [journalNote, setJournalNote] = useState('');
  const [journalRating, setJournalRating] = useState<'Radiant' | 'Calm' | 'Irritated' | 'Breakout' | 'Dry'>('Calm');

  const categories = ['All', 'Cleanser', 'Serum', 'Moisturizer', 'Sunscreen', 'Treatment'];

  const filteredItems = vanityItems.filter(item => {
    if (categoryFilter === 'All') return true;
    return item.category?.toLowerCase().includes(categoryFilter.toLowerCase()) ||
           item.name.toLowerCase().includes(categoryFilter.toLowerCase());
  });

  const loadSampleVanity = () => {
    MOCK_SHELF_SCAN.shelf_products.forEach((prod) => {
      addToVanity({
        name: prod.name,
        brand: prod.brand,
        category: prod.category,
        rating: prod.rating,
        notes: prod.reasoning,
        isFavorite: prod.rating === Rating.GREEN,
        inAMRoutine: prod.suggestedTime === 'AM' || prod.suggestedTime === 'Both',
        inPMRoutine: prod.suggestedTime === 'PM' || prod.suggestedTime === 'Both',
        paoMonths: 12
      });
    });
    showToast("Added sample products to your vanity");
  };

  const handleAddJournalEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalNote.trim()) return;

    const entry = storageService.addJournalEntry({
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      skinType: 'Combination',
      concerns: ['Hydration maintenance'],
      notes: journalNote.trim(),
      rating: journalRating
    });

    setJournalEntries(storageService.getSkinJournal());
    setJournalNote('');
    showToast("Skin journal entry recorded");
  };

  const handleSyncToRoutine = () => {
    if (vanityItems.length === 0) return;
    const mapped = vanityItems.map(item => ({
      name: item.name,
      brand: item.brand,
      category: item.category,
      rating: item.rating,
      reasoning: item.notes || "From My Vanity Shelf",
      keyIngredients: [],
      suggestedTime: (item.inAMRoutine && item.inPMRoutine ? 'Both' : item.inAMRoutine ? 'AM' : 'PM') as any
    }));
    setCurrentShelfProducts(mapped);
    setActiveTab('routine');
    showToast("Transferred vanity items into Routine Architecture");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-3xl">
        <div>
          <h2 className="text-xl font-bold text-zinc-950 font-serif italic">
            My Digital Vanity & Skin Journal
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Your personal cosmetic inventory, PAO expiration tracker, and daily skin health log
          </p>
        </div>

        {vanityItems.length > 0 ? (
          <button
            onClick={handleSyncToRoutine}
            className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold rounded-full transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-rose-300" />
            <span>Send Vanity to Routine Builder</span>
          </button>
        ) : (
          <button
            onClick={loadSampleVanity}
            className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold rounded-full transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-300" />
            <span>Populate Sample Vanity</span>
          </button>
        )}
      </div>

      {/* Main Vanity Section */}
      <div className="space-y-4">
        
        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {vanityItems.length === 0 ? (
          <div className="glass-panel p-10 rounded-3xl text-center space-y-3 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-zinc-900">Your Vanity is Empty</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Scan products in the Single Analysis or Shelf Scan tabs and click "Save to Vanity" to build your personal skincare shelf.
            </p>
            <button
              onClick={loadSampleVanity}
              className="px-5 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-zinc-800 transition-all"
            >
              Add Sample Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                className="glass-card-interactive p-5 rounded-3xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-800 text-[10px] font-extrabold uppercase rounded-md flex items-center gap-1">
                      <Tag className="w-3 h-3 text-zinc-400" />
                      {item.category}
                    </span>

                    <button
                      onClick={() => toggleFavoriteVanity(item.id)}
                      className="p-1 hover:bg-rose-50 rounded-full transition-colors"
                      title="Favorite"
                    >
                      <Heart className={`w-4 h-4 ${item.isFavorite ? 'text-rose-500 fill-rose-500' : 'text-zinc-300'}`} />
                    </button>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 leading-snug">{item.name}</h4>
                    <p className="text-xs text-zinc-500">{item.brand}</p>
                  </div>

                  {item.notes && (
                    <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed font-medium">
                      {item.notes}
                    </p>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between">
                  {/* Routine schedule pills */}
                  <div className="flex items-center gap-1.5">
                    {item.inAMRoutine && (
                      <span className="p-1 bg-amber-50 text-amber-700 rounded-md" title="Morning Routine">
                        <Sun className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {item.inPMRoutine && (
                      <span className="p-1 bg-indigo-50 text-indigo-700 rounded-md" title="Evening Routine">
                        <Moon className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-400 font-semibold ml-1">
                      PAO: 12M
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromVanity(item.id)}
                    className="p-1.5 text-zinc-300 hover:text-rose-600 rounded-lg transition-colors"
                    title="Remove from vanity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Skin Health Journal Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500/10 text-rose-600 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-950">Daily Skin Health Journal</h3>
              <p className="text-xs text-zinc-500">Track how your skin responds to products and weather changes over time</p>
            </div>
          </div>
        </div>

        {/* Quick Log Form */}
        <form onSubmit={handleAddJournalEntry} className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-zinc-500 mr-2">Today's Skin State:</span>
            {(['Radiant', 'Calm', 'Irritated', 'Breakout', 'Dry'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setJournalRating(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  journalRating === r
                    ? 'bg-zinc-950 text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                {r === 'Radiant' ? '✨ Radiant' :
                 r === 'Calm' ? '🌿 Calm' :
                 r === 'Irritated' ? '🔴 Irritated' :
                 r === 'Breakout' ? '⚡ Breakout' : '💧 Dry'}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
              placeholder="E.g., Woke up with smooth texture after using CeraRepair cream last night..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
            />
            <button
              type="submit"
              disabled={!journalNote.trim()}
              className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shrink-0 active:scale-95"
            >
              Log Entry
            </button>
          </div>
        </form>

        {/* Recent Journal History */}
        {journalEntries.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Recent Log History ({journalEntries.length})
            </span>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {journalEntries.map((entry) => (
                <div 
                  key={entry.id}
                  className="p-3 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-zinc-900">{entry.date}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white text-[10px] font-bold border border-zinc-200">
                        {entry.rating}
                      </span>
                    </div>
                    <p className="text-zinc-600 font-medium">{entry.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
