import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Loader2, 
  RefreshCcw, 
  SlidersHorizontal, 
  Heart, 
  Sparkles, 
  Clock, 
  Layers, 
  Tag,
  AlertCircle
} from 'lucide-react';
import { ImageDropzone } from '../common/ImageDropzone';
import { useApp } from '../../context/AppContext';
import { scanShelf } from '../../services/geminiService';
import { SAMPLE_IMAGES, MOCK_SHELF_SCAN } from '../../services/mockDataService';
import { Rating, ShelfScanResult, ShelfProduct } from '../../types';

export const ShelfScanTab: React.FC = () => {
  const { 
    lastShelfResult, 
    setLastShelfResult, 
    setCurrentShelfProducts, 
    setActiveTab, 
    addToVanity, 
    language, 
    showToast,
    t 
  } = useApp();

  const [skinImage, setSkinImage] = useState<string | null>(null);
  const [shelfImage, setShelfImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const result = lastShelfResult;

  const handleScan = async (shImg = shelfImage, skImg = skinImage) => {
    if (!shImg || !skImg) return;
    setIsScanning(true);
    setError(null);
    try {
      const data = await scanShelf(shImg, skImg, language);
      setLastShelfResult(data);
      setCurrentShelfProducts(data.shelf_products);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Shelf analysis could not be completed. Please ensure products are well-lit.");
    } finally {
      setIsScanning(false);
    }
  };

  const loadPreset = () => {
    setSkinImage(SAMPLE_IMAGES.skinAcneProne);
    setShelfImage(SAMPLE_IMAGES.shelfCollection);
    setLastShelfResult(MOCK_SHELF_SCAN);
    setCurrentShelfProducts(MOCK_SHELF_SCAN.shelf_products);
  };

  const reset = () => {
    setSkinImage(null);
    setShelfImage(null);
    setLastShelfResult(null);
    setError(null);
  };

  const handleSendToRoutineBuilder = () => {
    if (!result) return;
    setCurrentShelfProducts(result.shelf_products);
    setActiveTab('routine');
    showToast("Loaded products into AM/PM Routine Builder");
  };

  const handleSaveAllToVanity = () => {
    if (!result) return;
    result.shelf_products.forEach((prod) => {
      addToVanity({
        name: prod.name,
        brand: prod.brand,
        category: prod.category,
        rating: prod.rating,
        notes: prod.reasoning,
        isFavorite: prod.rating === Rating.GREEN,
        inAMRoutine: prod.suggestedTime === 'AM' || prod.suggestedTime === 'Both',
        inPMRoutine: prod.suggestedTime === 'PM' || prod.suggestedTime === 'Both'
      });
    });
    showToast(`Added ${result.shelf_products.length} products to My Vanity`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-3xl">
        <div>
          <h2 className="text-xl font-bold text-zinc-950 font-serif italic">
            Full Skincare Collection Scan
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Identify all products on your shelf, categorize their routine roles, and evaluate suitability for your skin type
          </p>
        </div>

        {!result && (
          <button
            onClick={loadPreset}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-full border border-rose-200 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Curated Shelf Preset</span>
          </button>
        )}
      </div>

      {!result ? (
        /* Upload Form */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageDropzone
              label="1. Your Skin Profile"
              description="Photo of face or skin area to detect your biological skin type"
              image={skinImage}
              onImageSelect={(img) => {
                setSkinImage(img);
                if (img && shelfImage) handleScan(shelfImage, img);
              }}
              onLoadSample={() => setSkinImage(SAMPLE_IMAGES.skinAcneProne)}
              sampleLabel="Load Skin Photo"
              facingMode="user"
              guideType="face"
            />

            <ImageDropzone
              label="2. Your Skincare Shelf / Collection"
              description="Photo of all skincare bottles, tubes, serums, and creams together"
              image={shelfImage}
              onImageSelect={(img) => {
                setShelfImage(img);
                if (img && skinImage) handleScan(img, skinImage);
              }}
              onLoadSample={() => setShelfImage(SAMPLE_IMAGES.shelfCollection)}
              sampleLabel="Load Shelf Photo"
              facingMode="environment"
              guideType="shelf"
            />
          </div>

          <div className="flex flex-col items-center gap-3 pt-4">
            <button
              onClick={() => handleScan()}
              disabled={!skinImage || !shelfImage || isScanning}
              className={`w-full sm:w-auto min-w-[240px] px-8 py-3.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                !skinImage || !shelfImage || isScanning
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none'
                  : 'bg-zinc-950 hover:bg-zinc-800 text-white shadow-zinc-950/20'
              }`}
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-rose-300" />
                  <span>Scanning Shelf & Classifying Actives...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-rose-300" />
                  <span>Scan Shelf & Match Skin</span>
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
          
          {/* Summary Strip */}
          <div className="p-6 rounded-3xl glass-panel flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">
                Detected Clinical Profile
              </span>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black text-zinc-950">
                  {result.detectedSkinType}
                </h3>
                <span className="px-3 py-1 bg-zinc-900 text-white text-xs font-bold rounded-full">
                  {result.shelf_products.length} Products Found
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleSendToRoutineBuilder}
                className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <SlidersHorizontal className="w-4 h-4 text-rose-300" />
                <span>Build Routine & Check Conflicts</span>
              </button>

              <button
                onClick={handleSaveAllToVanity}
                className="px-4 py-2.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 active:scale-95"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Save All to Vanity</span>
              </button>

              <button
                onClick={reset}
                className="p-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl transition-colors"
                title="New Scan"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.shelf_products.map((product, i) => {
              const isGreen = product.rating === Rating.GREEN;
              const isYellow = product.rating === Rating.YELLOW;
              const isRed = product.rating === Rating.RED;

              return (
                <div 
                  key={product.id || i}
                  className="glass-card-interactive p-6 rounded-3xl flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    
                    {/* Category & Rating Badges */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-zinc-100 text-zinc-800 text-[10px] font-extrabold uppercase tracking-wider rounded-lg flex items-center gap-1">
                        <Tag className="w-3 h-3 text-zinc-500" />
                        {product.category}
                      </span>

                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        isGreen ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        isYellow ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {isGreen ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    {/* Product Name & Brand */}
                    <div>
                      <h4 className="font-bold text-base text-zinc-950 leading-snug">
                        {product.name}
                      </h4>
                      <p className="text-xs text-zinc-500 font-medium mt-0.5">
                        {product.brand}
                      </p>
                    </div>

                    {/* Clinical Reasoning */}
                    <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                      {product.reasoning}
                    </p>

                    {/* Key Ingredients */}
                    <div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                        Key Actives
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {product.keyIngredients.map((ing, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-0.5 bg-zinc-100 text-zinc-700 text-[10px] font-semibold rounded-md"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Timing & Quick Vanity Save */}
                  <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{product.suggestedTime || 'Both'} Routine</span>
                    </div>

                    <button
                      onClick={() => {
                        addToVanity({
                          name: product.name,
                          brand: product.brand,
                          category: product.category,
                          rating: product.rating,
                          notes: product.reasoning,
                          isFavorite: product.rating === Rating.GREEN,
                          inAMRoutine: product.suggestedTime === 'AM' || product.suggestedTime === 'Both',
                          inPMRoutine: product.suggestedTime === 'PM' || product.suggestedTime === 'Both'
                        });
                      }}
                      className="p-1.5 hover:bg-rose-50 text-zinc-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Save this product to vanity"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
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
