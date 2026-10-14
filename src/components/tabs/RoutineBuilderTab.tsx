import React, { useState, useMemo } from 'react';
import { 
  Sun, 
  Moon, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  SlidersHorizontal, 
  ArrowRight, 
  Check, 
  Plus, 
  Trash2,
  Clock,
  Layers,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { analyzeRoutine } from '../../services/conflictEngine';
import { MOCK_SHELF_SCAN } from '../../services/mockDataService';
import { ShelfProduct } from '../../types';

export const RoutineBuilderTab: React.FC = () => {
  const { 
    currentShelfProducts, 
    setCurrentShelfProducts, 
    setActiveTab, 
    showToast 
  } = useApp();

  const products = currentShelfProducts.length > 0 
    ? currentShelfProducts 
    : [];

  const [activeProducts, setActiveProducts] = useState<ShelfProduct[]>(products);

  // Sync when currentShelfProducts changes
  React.useEffect(() => {
    if (currentShelfProducts.length > 0) {
      setActiveProducts(currentShelfProducts);
    }
  }, [currentShelfProducts]);

  const loadSampleRoutine = () => {
    setActiveProducts(MOCK_SHELF_SCAN.shelf_products);
    setCurrentShelfProducts(MOCK_SHELF_SCAN.shelf_products);
    showToast("Loaded clinical routine sample");
  };

  const plan = useMemo(() => {
    return analyzeRoutine(activeProducts);
  }, [activeProducts]);

  const removeProduct = (name: string) => {
    const updated = activeProducts.filter(p => p.name !== name);
    setActiveProducts(updated);
    setCurrentShelfProducts(updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-3xl">
        <div>
          <h2 className="text-xl font-bold text-zinc-950 font-serif italic">
            AM / PM Routine Architecture & Conflict Matrix
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Cross-references active chemicals to prevent barrier breakdown, cellular conflict, and ingredient inactivation
          </p>
        </div>

        {activeProducts.length === 0 ? (
          <button
            onClick={loadSampleRoutine}
            className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold rounded-full transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-300" />
            <span>Load Sample Routine</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-500">
              {activeProducts.length} Actives in System
            </span>
          </div>
        )}
      </div>

      {activeProducts.length === 0 ? (
        /* Empty State */
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto shadow-inner">
            <SlidersHorizontal className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-zinc-900">No Products in Routine Yet</h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Scan your collection shelf in the Skincare Analysis tab or load our curated 5-product dermatological routine to see conflict detection in action.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={loadSampleRoutine}
              className="w-full sm:w-auto px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              Load Sample 5-Step Routine
            </button>
            <button
              onClick={() => setActiveTab('shelf')}
              className="w-full sm:w-auto px-6 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-xs font-bold rounded-xl hover:bg-zinc-50 transition-all"
            >
              Scan Collection Shelf First
            </button>
          </div>
        </div>
      ) : (
        /* Active Routine Dashboard */
        <div className="space-y-8">
          
          {/* Top Metric Bar: Synergy Score & Conflict Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Synergy Score */}
            <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-zinc-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={plan.synergyScore > 80 ? 'text-emerald-500' : plan.synergyScore > 50 ? 'text-amber-500' : 'text-rose-500'}
                    strokeDasharray={`${plan.synergyScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-black text-sm text-zinc-900">
                  {plan.synergyScore}%
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Routine Synergy
                </span>
                <h4 className="font-bold text-base text-zinc-950">
                  {plan.synergyScore >= 85 ? 'Exceptional Harmony' : plan.synergyScore >= 60 ? 'Moderate Synergy' : 'High Irritation Risk'}
                </h4>
                <p className="text-[11px] text-zinc-500">
                  {plan.conflicts.length === 0 ? 'No ingredient clashes found' : `${plan.conflicts.length} contraindication(s) active`}
                </p>
              </div>
            </div>

            {/* Contraindications Flag Card */}
            <div className={`glass-panel p-6 rounded-3xl flex items-center gap-4 md:col-span-2 ${
              plan.conflicts.length > 0 
                ? 'border-amber-200 bg-amber-50/40' 
                : 'border-emerald-200 bg-emerald-50/40'
            }`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                plan.conflicts.length > 0 
                  ? 'bg-amber-500 text-white shadow-md' 
                  : 'bg-emerald-600 text-white shadow-md'
              }`}>
                {plan.conflicts.length > 0 ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-950">
                  {plan.conflicts.length > 0 ? `${plan.conflicts.length} Ingredient Conflict(s) Detected` : 'All Clear! Zero Incompatibilities'}
                </h4>
                <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed font-medium">
                  {plan.conflicts.length > 0 
                    ? 'Review the clinical resolution alerts below to separate contraindicated actives.'
                    : 'Your formulation order respects pH stability and will not strip your acid mantle.'}
                </p>
              </div>
            </div>

          </div>

          {/* Conflict Alerts Detail Banners (if any) */}
          {plan.conflicts.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Active Chemical Contraindications
              </span>

              {plan.conflicts.map((conflict) => (
                <div 
                  key={conflict.id}
                  className="p-5 rounded-2xl border border-amber-300/80 bg-amber-50/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white rounded">
                        {conflict.severity} CONFLICT
                      </span>
                      <span className="text-xs font-bold text-zinc-900">
                        {conflict.productA} <span className="text-rose-600 font-extrabold">×</span> {conflict.productB}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                      {conflict.description}
                    </p>
                    <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200/60 text-xs text-amber-900 font-semibold flex items-start gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{conflict.resolution}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Missing Foundation Pillars (if any) */}
          {plan.missingSteps.length > 0 && (
            <div className="p-4 rounded-2xl border border-sky-200 bg-sky-50/50 flex items-start gap-3">
              <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-sky-950 block">Missing Core Pillars</span>
                <p className="text-xs text-sky-800 mt-0.5">
                  Your routine could be further optimized by incorporating: {plan.missingSteps.join(', ')}.
                </p>
              </div>
            </div>
          )}

          {/* AM & PM Timeline Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Morning (AM) Schedule */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-900">Morning (AM) Routine</h3>
                    <p className="text-[10px] text-zinc-500">Antioxidant Defense & Photoprotection</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-lg border border-amber-200">
                  {plan.am.length} Steps
                </span>
              </div>

              {plan.am.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-400">
                  No daytime products allocated yet
                </div>
              ) : (
                <div className="space-y-3">
                  {plan.am.map((prod, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                            {prod.category}
                          </span>
                          <h5 className="font-bold text-xs text-zinc-900">{prod.name}</h5>
                          <span className="text-[10px] text-zinc-500">{prod.brand}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeProduct(prod.name)}
                        className="p-1.5 text-zinc-300 hover:text-rose-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove from routine"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Evening (PM) Schedule */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-900">Evening (PM) Routine</h3>
                    <p className="text-[10px] text-zinc-500">Cellular Turnover & Barrier Repair</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-800 text-[10px] font-bold rounded-lg border border-indigo-200">
                  {plan.pm.length} Steps
                </span>
              </div>

              {plan.pm.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-400">
                  No nighttime products allocated yet
                </div>
              ) : (
                <div className="space-y-3">
                  {plan.pm.map((prod, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                            {prod.category}
                          </span>
                          <h5 className="font-bold text-xs text-zinc-900">{prod.name}</h5>
                          <span className="text-[10px] text-zinc-500">{prod.brand}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeProduct(prod.name)}
                        className="p-1.5 text-zinc-300 hover:text-rose-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove from routine"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
