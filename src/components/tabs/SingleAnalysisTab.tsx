import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Loader2, 
  RefreshCcw, 
  FileText, 
  Heart, 
  Sparkles, 
  Droplets, 
  FlaskConical, 
  AlertCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { ImageDropzone } from '../common/ImageDropzone';
import { ExportReportModal } from '../common/ExportReportModal';
import { useApp } from '../../context/AppContext';
import { analyzeDermatology } from '../../services/geminiService';
import { SAMPLE_IMAGES, MOCK_SINGLE_ANALYSIS_SAFE, MOCK_SINGLE_ANALYSIS_HAZARD } from '../../services/mockDataService';
import { Rating, AnalysisResult, RoutineStep } from '../../types';

export const SingleAnalysisTab: React.FC = () => {
  const { 
    lastSingleResult, 
    setLastSingleResult, 
    addToVanity, 
    language, 
    t 
  } = useApp();

  const [skinImage, setSkinImage] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  const result = lastSingleResult;

  const handleAnalyze = async (skin = skinImage, prod = productImage) => {
    if (!skin || !prod) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeDermatology(skin, prod, language);
      setLastSingleResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Analysis could not be completed. Please ensure clear images are uploaded.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSampleSafe = () => {
    setSkinImage(SAMPLE_IMAGES.skinSensitiveDry);
    setProductImage(SAMPLE_IMAGES.productBarrierCream);
    setLastSingleResult(MOCK_SINGLE_ANALYSIS_SAFE);
  };

  const loadSampleHazard = () => {
    setSkinImage(SAMPLE_IMAGES.skinAcneProne);
    setProductImage(SAMPLE_IMAGES.productHarshAstringent);
    setLastSingleResult(MOCK_SINGLE_ANALYSIS_HAZARD);
  };

  const reset = () => {
    setSkinImage(null);
    setProductImage(null);
    setLastSingleResult(null);
    setError(null);
  };

  const handleSaveToVanity = () => {
    if (!result) return;
    addToVanity({
      name: result.productAnalysis.name,
      brand: result.productAnalysis.brand,
      category: (result.productAnalysis.category as RoutineStep) || 'Moisturizer',
      rating: result.comparison.rating,
      image: productImage || undefined,
      notes: result.comparison.recommendation,
      isFavorite: result.comparison.rating === Rating.GREEN,
      inAMRoutine: true,
      inPMRoutine: true
    });
  };

  const isGreen = result?.comparison.rating === Rating.GREEN;
  const isYellow = result?.comparison.rating === Rating.YELLOW;
  const isRed = result?.comparison.rating === Rating.RED;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Tab Subheader with Preset Samples */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-3xl">
        <div>
          <h2 className="text-xl font-bold text-zinc-950 font-serif italic">
            Single Product Safety & Compatibility
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Compare target skin needs against cosmetic formulation chemicals & pore-clogging hazards
          </p>
        </div>

        {!result && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Try Preset:
            </span>
            <button
              onClick={loadSampleSafe}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200 transition-all"
            >
              🌱 Biocompatible Match
            </button>
            <button
              onClick={loadSampleHazard}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold rounded-full border border-rose-200 transition-all"
            >
              ⚠️ Toxic / Irritant Flag
            </button>
          </div>
        )}
      </div>

      {!result ? (
        /* Upload & Analysis Form */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageDropzone
              label="1. Target Skin Photo"
              description="Clear photo of skin area (face, cheek, forehead, neck)"
              image={skinImage}
              onImageSelect={(img) => {
                setSkinImage(img);
                if (img && productImage) handleAnalyze(img, productImage);
              }}
              onLoadSample={() => setSkinImage(SAMPLE_IMAGES.skinSensitiveDry)}
              sampleLabel="Load Skin Sample"
              facingMode="user"
              guideType="face"
            />

            <ImageDropzone
              label="2. Cosmetic Product Bottle / Label"
              description="Front brand bottle or back ingredients list"
              image={productImage}
              onImageSelect={(img) => {
                setProductImage(img);
                if (img && skinImage) handleAnalyze(skinImage, img);
              }}
              onLoadSample={() => setProductImage(SAMPLE_IMAGES.productBarrierCream)}
              sampleLabel="Load Product Sample"
              facingMode="environment"
              guideType="product"
            />
          </div>

          <div className="flex flex-col items-center gap-3 pt-4">
            <button
              onClick={() => handleAnalyze()}
              disabled={!skinImage || !productImage || isAnalyzing}
              className={`w-full sm:w-auto min-w-[240px] px-8 py-3.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                !skinImage || !productImage || isAnalyzing
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none'
                  : 'bg-zinc-950 hover:bg-zinc-800 text-white shadow-zinc-950/20'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-rose-300" />
                  <span>Decoding Formulation Chemicals...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-rose-300" />
                  <span>Analyze Chemical Compatibility</span>
                </>
              )}
            </button>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-6">
          
          {/* Main Verdict Card */}
          <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm ${
            isGreen ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-950' :
            isYellow ? 'bg-amber-500/10 border-amber-500/20 text-amber-950' :
            'bg-rose-500/10 border-rose-500/20 text-rose-950'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md ${
                isGreen ? 'bg-emerald-600' :
                isYellow ? 'bg-amber-600' :
                'bg-rose-600'
              }`}>
                {isGreen ? <CheckCircle2 className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight">
                    {isGreen ? t('highlyRecommended') : isYellow ? t('safeIneffective') : t('avoidProduct')}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white shadow-xs">
                    Score {result.comparison.score}/100
                  </span>
                </div>
                <p className="text-xs sm:text-sm opacity-90 mt-1 leading-relaxed max-w-2xl font-medium">
                  {result.comparison.reasoning}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSaveToVanity}
                className="px-4 py-2 bg-white text-zinc-800 text-xs font-bold rounded-xl shadow-xs hover:bg-zinc-100 flex items-center gap-1.5 transition-all"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Save to Vanity</span>
              </button>
              <button
                onClick={() => setIsReportOpen(true)}
                className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-zinc-800 flex items-center gap-1.5 transition-all"
              >
                <FileText className="w-4 h-4 text-rose-300" />
                <span>Clinical Report</span>
              </button>
              <button
                onClick={reset}
                className="p-2.5 bg-white text-zinc-600 hover:text-zinc-900 rounded-xl shadow-xs transition-colors"
                title="New Scan"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Detailed 3-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. Skin Assessment */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-zinc-900 pb-2 border-b border-zinc-100">
                <div className="p-2 bg-rose-500/10 text-rose-600 rounded-xl">
                  <Droplets className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm">Skin Profile & Biomarkers</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Body Area</span>
                  <p className="text-sm font-semibold text-zinc-900">{result.skinAnalysis.bodyPart}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Observed Condition</span>
                  <p className="text-sm font-medium text-zinc-800 leading-snug">{result.skinAnalysis.condition}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Skin Classification</span>
                  <span className="inline-block mt-0.5 px-2.5 py-1 bg-zinc-100 text-zinc-800 text-xs font-bold rounded-lg">
                    {result.skinAnalysis.type}
                  </span>
                </div>

                {result.skinAnalysis.metrics && (
                  <div className="pt-2 border-t border-zinc-100 space-y-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Optical Barrier Scores</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-zinc-50 rounded-xl">
                        <span className="text-zinc-500 text-[10px] block">Hydration</span>
                        <span className="font-bold text-zinc-900">{result.skinAnalysis.metrics.hydrationScore}%</span>
                      </div>
                      <div className="p-2 bg-zinc-50 rounded-xl">
                        <span className="text-zinc-500 text-[10px] block">Redness Level</span>
                        <span className="font-bold text-zinc-900">{result.skinAnalysis.metrics.rednessScore}%</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Essential Needs</span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.skinAnalysis.needs.map((need, i) => (
                      <span key={i} className="px-2.5 py-1 bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-lg">
                        {need}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Product Chemical Profile */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-zinc-900 pb-2 border-b border-zinc-100">
                <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm">Chemical & Comedogenic Index</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Product & Brand</span>
                  <p className="text-sm font-bold text-zinc-900">{result.productAnalysis.name}</p>
                  <p className="text-xs text-zinc-500">{result.productAnalysis.brand}</p>
                </div>

                {/* Comedogenic Pore Clogging Meter */}
                <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-zinc-700">Comedogenic Score</span>
                    <span className={`font-black ${
                      (result.productAnalysis.overallComedogenicScore || 0) <= 1 ? 'text-emerald-600' :
                      (result.productAnalysis.overallComedogenicScore || 0) <= 2 ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {result.productAnalysis.overallComedogenicScore ?? 0} / 5
                    </span>
                  </div>
                  <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        (result.productAnalysis.overallComedogenicScore || 0) <= 1 ? 'bg-emerald-500' :
                        (result.productAnalysis.overallComedogenicScore || 0) <= 2 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, ((result.productAnalysis.overallComedogenicScore || 0) / 5) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 block">
                    {(result.productAnalysis.overallComedogenicScore || 0) <= 1 ? 'Low pore clogging risk' : 'Elevated risk of closed comedones & congestion'}
                  </span>
                </div>

                {/* Toxic / Hazard Alerts */}
                {result.productAnalysis.toxicIngredients.length > 0 ? (
                  <div>
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block mb-1">
                      Flagged Chemicals ({result.productAnalysis.toxicIngredients.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.productAnalysis.toxicIngredients.map((toxic, i) => (
                        <span key={i} className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg">
                          {toxic}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Clean formulation: No parabens, SLS, or synthetic fragrance flagged.</span>
                  </div>
                )}

                {/* Key Ingredients breakdown */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Ingredients ({result.productAnalysis.ingredients.length})
                    </span>
                    {result.productAnalysis.ingredients.length > 5 && (
                      <button
                        onClick={() => setShowAllIngredients(!showAllIngredients)}
                        className="text-[10px] text-zinc-500 hover:text-zinc-800 font-bold flex items-center gap-0.5"
                      >
                        {showAllIngredients ? 'Show Less' : 'Show All'}
                        {showAllIngredients ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(showAllIngredients 
                      ? result.productAnalysis.ingredients 
                      : result.productAnalysis.ingredients.slice(0, 6)
                    ).map((ing, i) => (
                      <span key={i} className="px-2 py-0.5 bg-zinc-100 text-zinc-700 text-[11px] font-medium rounded-md">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Actionable Clinical Advice */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-zinc-900 pb-2 border-b border-zinc-100">
                <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm">Actionable Protocol</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-xs sm:text-sm text-zinc-700 leading-relaxed font-medium">
                  {result.comparison.recommendation}
                </div>

                {result.comparison.patchTestRequired && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-amber-900 block">Patch Test Required</span>
                      <p className="text-[11px] text-amber-800 mt-0.5 leading-snug">
                        Apply a dime-sized amount to your inner forearm for 24-48 hours before facial contact to check for delayed Type IV hypersensitivity.
                      </p>
                    </div>
                  </div>
                )}

                {result.comparison.sunSensitivityAlert && (
                  <div className="p-3 bg-sky-50 border border-sky-200 rounded-2xl flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-sky-900 block">Sun Sensitivity Alert</span>
                      <p className="text-[11px] text-sky-800 mt-0.5 leading-snug">
                        This formula contains actives that accelerate cellular turnover. Always wear SPF 50+ during daytime exposure.
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={reset}
                  className="w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <RefreshCcw className="w-4 h-4 text-rose-300" />
                  <span>Analyze Another Formulation</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Export Report Modal */}
      {result && (
        <ExportReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          result={result}
        />
      )}

    </div>
  );
};
