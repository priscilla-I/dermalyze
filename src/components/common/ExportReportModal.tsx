import React from 'react';
import { X, Printer, ShieldCheck, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { AnalysisResult, Rating } from '../../types';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({ isOpen, onClose, result }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const isGreen = result.comparison.rating === Rating.GREEN;
  const isYellow = result.comparison.rating === Rating.YELLOW;
  const isRed = result.comparison.rating === Rating.RED;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm print:p-0 print:bg-white animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls (Hidden in Print) */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70 print:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <h3 className="font-bold text-zinc-900 text-sm">Clinical Compatibility Report</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate / Document */}
        <div className="p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-zinc-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-tight text-zinc-950">DERMALYZE</span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-zinc-950 text-white rounded">CLINICAL</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">AI Dermatological Compatibility & Toxicology Record</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-zinc-400">
                DATE: {new Date(result.timestamp || Date.now()).toLocaleDateString()}
              </span>
              <div className="text-[10px] text-zinc-400">REF: DMZ-{Date.now().toString(36).toUpperCase()}</div>
            </div>
          </div>

          {/* Verdict Banner */}
          <div className={`p-5 rounded-2xl border flex items-center gap-4 ${
            isGreen ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' :
            isYellow ? 'bg-amber-50/70 border-amber-200 text-amber-950' :
            'bg-rose-50/70 border-rose-200 text-rose-950'
          }`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
              isGreen ? 'bg-emerald-600 text-white' :
              isYellow ? 'bg-amber-600 text-white' :
              'bg-rose-600 text-white'
            }`}>
              {isGreen ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-black text-lg">
                  {isGreen ? 'BIOCOMPATIBLE & SAFE' : isYellow ? 'LOW RISK / MODERATE SYNERGY' : 'CONTRAINDICATED / HIGH RISK'}
                </h4>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80 shadow-xs">
                  Score: {result.comparison.score}/100
                </span>
              </div>
              <p className="text-xs opacity-90 mt-1 leading-relaxed">
                {result.comparison.reasoning}
              </p>
            </div>
          </div>

          {/* Two-Column Clinical Breakdown */}
          <div className="grid grid-cols-2 gap-6">
            {/* Skin Profile */}
            <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/40 space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 block">
                Target Skin Assessment
              </span>
              <div>
                <div className="text-xs text-zinc-400">Location</div>
                <div className="text-sm font-bold text-zinc-800">{result.skinAnalysis.bodyPart}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">Condition</div>
                <div className="text-sm font-semibold text-zinc-800">{result.skinAnalysis.condition}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">Skin Type</div>
                <div className="text-sm font-medium text-zinc-700">{result.skinAnalysis.type}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400 mb-1">Key Biological Needs</div>
                <div className="flex flex-wrap gap-1">
                  {result.skinAnalysis.needs.map((n, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white border border-zinc-200 text-zinc-600 text-[10px] rounded-md font-medium">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/40 space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 block">
                Product Formulation Data
              </span>
              <div>
                <div className="text-xs text-zinc-400">Product Name</div>
                <div className="text-sm font-bold text-zinc-800">{result.productAnalysis.name}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">Brand / Laboratory</div>
                <div className="text-sm font-semibold text-zinc-700">{result.productAnalysis.brand}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">Pore-Clogging Index</div>
                <div className="text-sm font-bold text-zinc-800">
                  {result.productAnalysis.overallComedogenicScore ?? 0} / 5
                </div>
              </div>
              {result.productAnalysis.toxicIngredients.length > 0 ? (
                <div>
                  <div className="text-xs text-rose-500 font-bold mb-1">Toxic / Sensitizing Flags</div>
                  <div className="flex flex-wrap gap-1">
                    {result.productAnalysis.toxicIngredients.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] rounded-md font-bold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Zero toxic parabens, sulfates, or hazardous phthalates flagged.
                </div>
              )}
            </div>
          </div>

          {/* Clinical Action Plan */}
          <div className="p-4 rounded-2xl border border-zinc-200 bg-white">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 block mb-1">
              Physician & Chemistry Recommendation
            </span>
            <p className="text-xs text-zinc-700 leading-relaxed font-medium">
              {result.comparison.recommendation}
            </p>
          </div>

          {/* Footer Disclaimer */}
          <div className="text-[10px] text-zinc-400 leading-normal border-t border-zinc-200 pt-4 text-center">
            Dermalyze 2.0 AI System. This analysis is generated via multimodal optical and chemical knowledge bases. It does not replace clinical in-person biopsy or prescription by a licensed dermatologist.
          </div>
        </div>

      </div>
    </div>
  );
};
