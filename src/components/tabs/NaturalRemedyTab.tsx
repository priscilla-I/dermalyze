import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  RefreshCcw, 
  Play, 
  Pause, 
  RotateCcw, 
  Bookmark, 
  Heart,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { ImageDropzone } from '../common/ImageDropzone';
import { useApp } from '../../context/AppContext';
import { analyzeNaturalRemedy } from '../../services/geminiService';
import { storageService } from '../../services/storageService';
import { SAMPLE_IMAGES, MOCK_NATURAL_REMEDY } from '../../services/mockDataService';
import { NaturalRemedyResult } from '../../types';

export const NaturalRemedyTab: React.FC = () => {
  const { 
    lastNaturalResult, 
    setLastNaturalResult, 
    language, 
    showToast 
  } = useApp();

  const [skinImage, setSkinImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Interactive Recipe Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(900); // 15 mins default
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const result = lastNaturalResult;

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Dermalyze Mask Timer Complete', { body: 'Time to rinse off your natural mask with lukewarm water!' });
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleAnalyze = async (img = skinImage) => {
    if (!img) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeNaturalRemedy(img, language);
      setLastNaturalResult(data);
      setIsSaved(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Could not analyze skin concern for natural remedy.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadPreset = () => {
    setSkinImage(SAMPLE_IMAGES.skinSensitiveDry);
    setLastNaturalResult(MOCK_NATURAL_REMEDY);
    setIsSaved(false);
  };

  const reset = () => {
    setSkinImage(null);
    setLastNaturalResult(null);
    setIsTimerRunning(false);
    setTimerSeconds(900);
    setError(null);
  };

  const handleSaveRemedy = () => {
    if (!result) return;
    storageService.saveRemedy(result);
    setIsSaved(true);
    showToast(`"${result.remedy_name}" saved to My Remedies`);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-3xl">
        <div>
          <h2 className="text-xl font-bold text-zinc-950 font-serif italic">
            Natural Apothecary & Botanical DIY Lab
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Evidence-backed kitchen remedies formulated strictly from non-chemical pantry superfoods
          </p>
        </div>

        {!result && (
          <button
            onClick={loadPreset}
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Ayurvedic Honey Remedy</span>
          </button>
        )}
      </div>

      {!result ? (
        /* Upload Form */
        <div className="space-y-6 max-w-xl mx-auto">
          <ImageDropzone
            label="Skin Concern Area"
            description="Upload photo of visible concerns (dullness, redness, acne blemishes, or post-sun skin)"
            image={skinImage}
            onImageSelect={(img) => {
              setSkinImage(img);
              if (img) handleAnalyze(img);
            }}
            onLoadSample={() => setSkinImage(SAMPLE_IMAGES.skinSensitiveDry)}
            sampleLabel="Load Skin Photo"
            facingMode="user"
            guideType="face"
          />

          <div className="flex flex-col items-center gap-3 pt-4">
            <button
              onClick={() => handleAnalyze()}
              disabled={!skinImage || isAnalyzing}
              className={`w-full sm:w-auto min-w-[240px] px-8 py-3.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                !skinImage || isAnalyzing
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none'
                  : 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-emerald-900/20'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                  <span>Formulating Kitchen Recipe...</span>
                </>
              ) : (
                <>
                  <Leaf className="w-4 h-4 text-emerald-200" />
                  <span>Formulate Natural DIY Remedy</span>
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
          
          {/* Main Title & Action Bar */}
          <div className="p-6 rounded-3xl glass-panel flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-emerald-200 bg-emerald-50/30">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 block mb-1">
                {result.culturalOrigin || "Holistic Botanical Formulation"}
              </span>
              <h3 className="text-2xl font-serif italic text-zinc-950 font-bold">
                {result.remedy_name}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveRemedy}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 ${
                  isSaved 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-50'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{isSaved ? 'Saved to Remedies' : 'Save Recipe'}</span>
              </button>

              <button
                onClick={reset}
                className="p-2.5 bg-white hover:bg-zinc-100 text-zinc-600 rounded-xl transition-colors shadow-xs"
                title="New Formulation"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Side: Diagnosis & Prep Timer */}
            <div className="space-y-6">
              
              {/* Visual Diagnosis */}
              <div className="glass-panel p-6 rounded-3xl space-y-3">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Observed Biological Diagnosis
                </span>
                <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed font-medium italic">
                  "{result.diagnosis}"
                </p>
                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold">
                  <span className="text-zinc-500">Prep Time</span>
                  <span className="text-zinc-900 font-bold">{result.prep_time}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-zinc-500">Complexity</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                    {result.difficulty}
                  </span>
                </div>
              </div>

              {/* Interactive Mask Timer */}
              <div className="glass-panel p-6 rounded-3xl space-y-4 text-center bg-zinc-900 text-white">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  <Clock className="w-4 h-4" />
                  <span>Facial Mask Timer</span>
                </div>

                <div className="text-4xl font-black font-mono tracking-tight my-2">
                  {formatTimer(timerSeconds)}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                  >
                    {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds(900);
                    }}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                    title="Reset to 15m"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Patch Test Advisory */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>24-Hour Allergy Protocol</span>
                </div>
                <p className="text-[11px] leading-snug text-amber-800">
                  {result.patchTestAdvice || "Perform a wrist patch test 24 hours prior to full application to rule out botanical sensitivities."}
                </p>
              </div>

            </div>

            {/* Right Side: Ingredients & Step-by-Step Guide */}
            <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
              
              {/* Measured Kitchen Ingredients */}
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-3">
                  Pantry Superfoods & Measurements
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {result.ingredients.map((ing, i) => (
                    <div 
                      key={i}
                      className="p-3 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-zinc-800"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span>{ing}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chronological Steps */}
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-3">
                  Preparation & Application Steps
                </span>
                <div className="space-y-3">
                  {result.steps.map((step, i) => (
                    <div 
                      key={i}
                      className="p-4 bg-white border border-zinc-200/80 rounded-2xl shadow-xs flex items-start gap-3.5"
                    >
                      <span className="w-6 h-6 rounded-full bg-zinc-950 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-medium">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tip */}
              {result.pro_tip && (
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">Dermatologist Pro Tip</span>
                    <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed font-medium">
                      {result.pro_tip}
                    </p>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
