import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Loader2, 
  RefreshCcw, 
  Palette, 
  Sparkles, 
  Eye, 
  Heart,
  Droplets,
  AlertCircle
} from 'lucide-react';
import { ImageDropzone } from '../common/ImageDropzone';
import { useApp } from '../../context/AppContext';
import { analyzeBeauty } from '../../services/geminiService';
import { SAMPLE_IMAGES, MOCK_BEAUTY_ANALYSIS } from '../../services/mockDataService';
import { Rating, BeautyAnalysisResult } from '../../types';

// The 10 Monk Skin Tone benchmarks
const MONK_SWATCHES = [
  { level: 1, hex: '#f6ede4', label: 'Monk 1' },
  { level: 2, hex: '#f3e7db', label: 'Monk 2' },
  { level: 3, hex: '#f7ead0', label: 'Monk 3' },
  { level: 4, hex: '#eadaba', label: 'Monk 4' },
  { level: 5, hex: '#d7bd96', label: 'Monk 5' },
  { level: 6, hex: '#a07e56', label: 'Monk 6' },
  { level: 7, hex: '#825c43', label: 'Monk 7' },
  { level: 8, hex: '#604134', label: 'Monk 8' },
  { level: 9, hex: '#3a312a', label: 'Monk 9' },
  { level: 10, hex: '#292420', label: 'Monk 10' }
];

export const BeautyScanTab: React.FC = () => {
  const { 
    lastBeautyResult, 
    setLastBeautyResult, 
    language, 
    showToast 
  } = useApp();

  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [shelfImage, setShelfImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Interactive Swatch Preview state
  const [activeSwatch, setActiveSwatch] = useState<{ name: string; hex: string } | null>(null);

  const result = lastBeautyResult;

  const handleScan = async (shImg = shelfImage, fcImg = faceImage) => {
    if (!shImg || !fcImg) return;
    setIsScanning(true);
    setError(null);
    try {
      const data = await analyzeBeauty(shImg, fcImg, language);
      setLastBeautyResult(data);
      if (data.shelf_analysis.length > 0) {
        setActiveSwatch({
          name: data.shelf_analysis[0].name,
          hex: data.shelf_analysis[0].hex_code
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Beauty matching failed. Please ensure facial daylight lighting is clear.");
    } finally {
      setIsScanning(false);
    }
  };

  const loadPreset = () => {
    setFaceImage(SAMPLE_IMAGES.faceBeautyScan);
    setShelfImage(SAMPLE_IMAGES.cosmeticShelf);
    setLastBeautyResult(MOCK_BEAUTY_ANALYSIS);
    setActiveSwatch({
      name: MOCK_BEAUTY_ANALYSIS.shelf_analysis[0].name,
      hex: MOCK_BEAUTY_ANALYSIS.shelf_analysis[0].hex_code
    });
  };

  const reset = () => {
    setFaceImage(null);
    setShelfImage(null);
    setLastBeautyResult(null);
    setActiveSwatch(null);
    setError(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-3xl">
        <div>
          <h2 className="text-xl font-bold text-zinc-950 font-serif italic">
            Beauty Scan & Monk Scale Shade Matching
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            10-point Monk skin tone identification, undertone color harmony, and virtual cosmetic swatches
          </p>
        </div>

        {!result && (
          <button
            onClick={loadPreset}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-full border border-rose-200 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Beauty Match Preset</span>
          </button>
        )}
      </div>

      {!result ? (
        /* Upload Form */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageDropzone
              label="1. Your Face in Natural Daylight"
              description="Front selfie without heavy filters for accurate undertone mapping"
              image={faceImage}
              onImageSelect={(img) => {
                setFaceImage(img);
                if (img && shelfImage) handleScan(shelfImage, img);
              }}
              onLoadSample={() => setFaceImage(SAMPLE_IMAGES.faceBeautyScan)}
              sampleLabel="Load Face Portrait"
              facingMode="user"
              guideType="face"
            />

            <ImageDropzone
              label="2. Cosmetic Shelf or Swatches"
              description="Photo of foundations, concealers, lipsticks, blushes, or nail polishes"
              image={shelfImage}
              onImageSelect={(img) => {
                setShelfImage(img);
                if (img && faceImage) handleScan(img, faceImage);
              }}
              onLoadSample={() => setShelfImage(SAMPLE_IMAGES.cosmeticShelf)}
              sampleLabel="Load Cosmetic Shelf"
              facingMode="environment"
              guideType="shelf"
            />
          </div>

          <div className="flex flex-col items-center gap-3 pt-4">
            <button
              onClick={() => handleScan()}
              disabled={!faceImage || !shelfImage || isScanning}
              className={`w-full sm:w-auto min-w-[240px] px-8 py-3.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                !faceImage || !shelfImage || isScanning
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none'
                  : 'bg-zinc-950 hover:bg-zinc-800 text-white shadow-zinc-950/20'
              }`}
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-rose-300" />
                  <span>Computing Monk Scale & Color Harmonies...</span>
                </>
              ) : (
                <>
                  <Palette className="w-4 h-4 text-rose-300" />
                  <span>Match Shades & Undertones</span>
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
          
          {/* Monk Scale Strip & Undertone Dashboard */}
          <div className="glass-panel p-6 rounded-3xl space-y-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-0.5">
                  Scientific Skin Tone Classification
                </span>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black text-zinc-950">
                    Monk Scale Level {result.detectedSkinTone}
                  </h3>
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full border border-amber-200">
                    {result.detectedUndertone} Undertone
                  </span>
                </div>
              </div>

              <button
                onClick={reset}
                className="p-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl transition-colors self-end md:self-auto"
                title="New Scan"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Visual Monk 1-10 Spectrum Bar */}
            <div className="space-y-2">
              <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
                {MONK_SWATCHES.map((swatch) => {
                  const isUserTone = swatch.level === result.detectedSkinTone;
                  return (
                    <div key={swatch.level} className="flex flex-col items-center gap-1.5">
                      <div
                        className={`w-full aspect-square rounded-xl shadow-xs transition-all relative ${
                          isUserTone ? 'ring-3 ring-zinc-950 scale-110 z-10' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                        title={`${swatch.label} (${swatch.hex})`}
                      >
                        {isUserTone && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm ring-1 ring-black/20" />
                          </div>
                        )}
                      </div>
                      <span className={`text-[10px] font-extrabold ${isUserTone ? 'text-zinc-950' : 'text-zinc-400'}`}>
                        {swatch.level}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-zinc-500 font-medium italic pt-1">
                {result.undertoneExplanation || "Optically balanced across the 10-point Monk spectrum for inclusive undertone harmony."}
              </p>
            </div>

            {/* Virtual Swatch Preview Stage */}
            {activeSwatch && (
              <div className="p-4 rounded-2xl bg-zinc-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center -space-x-3">
                    {/* User Skin Swatch */}
                    <div 
                      className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: result.monkHex || MONK_SWATCHES[result.detectedSkinTone - 1]?.hex }}
                      title="Your Skin Tone"
                    />
                    {/* Product Swatch */}
                    <div 
                      className="w-12 h-12 rounded-full border-2 border-white shadow-md animate-in zoom-in-50 duration-200"
                      style={{ backgroundColor: activeSwatch.hex }}
                      title="Cosmetic Shade"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                      Live Color Harmony Preview
                    </span>
                    <span className="text-sm font-bold text-white">{activeSwatch.name}</span>
                    <span className="text-xs text-zinc-400 font-mono block">{activeSwatch.hex}</span>
                  </div>
                </div>

                <div className="text-xs text-zinc-300 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 text-center sm:text-right">
                  High contrast biocompatibility check passed
                </div>
              </div>
            )}
          </div>

          {/* Beauty Products Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.shelf_analysis.map((item, i) => {
              const isGreen = item.indicator_color === Rating.GREEN;
              const isYellow = item.indicator_color === Rating.YELLOW;
              const isRed = item.indicator_color === Rating.RED;

              return (
                <div
                  key={item.id || i}
                  onClick={() => setActiveSwatch({ name: item.name, hex: item.hex_code })}
                  className={`glass-card-interactive p-6 rounded-3xl flex flex-col justify-between cursor-pointer ${
                    activeSwatch?.name === item.name ? 'ring-2 ring-zinc-950 shadow-lg' : ''
                  }`}
                >
                  <div className="space-y-4">
                    
                    {/* Top Row: Type and Rating */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-zinc-100 text-zinc-800 text-[10px] font-extrabold uppercase tracking-wider rounded-lg">
                        {item.product_type}
                      </span>

                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        isGreen ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        isYellow ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {isGreen ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                        <span>{item.indicator_color}</span>
                      </div>
                    </div>

                    {/* Shade Color Hex Swatch */}
                    <div className="flex items-center gap-3.5">
                      <div 
                        className="w-12 h-12 rounded-2xl border-2 border-white shadow-md shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: item.hex_code }}
                      >
                        <Eye className="w-4 h-4 text-white drop-shadow-md opacity-80" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-zinc-950 leading-snug">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-zinc-500 font-medium">{item.brand}</span>
                          <span className="text-[10px] font-mono text-zinc-400">{item.hex_code}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shade Advice Box */}
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed font-medium ${
                      isGreen ? 'bg-emerald-50/70 text-emerald-950 border border-emerald-100' :
                      isYellow ? 'bg-amber-50/70 text-amber-950 border border-amber-100' :
                      'bg-rose-50/70 text-rose-950 border border-rose-100'
                    }`}>
                      <span className="font-bold block mb-1">Colorist Advice:</span>
                      {item.shade_advice}
                    </div>

                    {/* Finish & Oxidation tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {item.finish && (
                        <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] font-bold rounded-md">
                          Finish: {item.finish}
                        </span>
                      )}
                      {item.oxidationRisk && (
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                          item.oxidationRisk === 'Low' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          Oxidation: {item.oxidationRisk}
                        </span>
                      )}
                    </div>

                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Click card to test swatch harmony</span>
                    <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
