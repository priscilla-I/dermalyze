import React, { useState } from 'react';
import { X, Key, ShieldCheck, Sparkles, AlertCircle, ExternalLink, Check, Cpu } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GoogleGenAI } from '@google/genai';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { preferences, updatePreferences, showToast } = useApp();
  
  const [apiKeyInput, setApiKeyInput] = useState(preferences.apiKey || '');
  const [modelSelect, setModelSelect] = useState(preferences.selectedModel || 'gemini-2.5-flash');
  const [demoToggle, setDemoToggle] = useState(preferences.demoMode);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    updatePreferences({
      apiKey: apiKeyInput.trim(),
      selectedModel: modelSelect as any,
      demoMode: demoToggle
    });
    showToast("Settings updated successfully");
    onClose();
  };

  const handleTestConnection = async () => {
    const key = apiKeyInput.trim() || process.env.GEMINI_API_KEY;
    if (!key) {
      setTestResult({ success: false, msg: "Please enter an API key first, or enable Demo Mode." });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const res = await ai.models.generateContent({
        model: modelSelect,
        contents: "Respond with the single word: OK"
      });

      if (res.text) {
        setTestResult({ success: true, msg: "Connection successful! Gemini API is live and operational." });
        setDemoToggle(false);
      } else {
        setTestResult({ success: false, msg: "Received empty response from API." });
      }
    } catch (err: any) {
      const msg = err?.message || String(err);
      setTestResult({ 
        success: false, 
        msg: `Connection failed: ${msg.includes('403') ? '403 Permission Denied. Check key validity in AI Studio.' : msg}` 
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
              <Key className="w-4 h-4 text-rose-300" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-base">API Key & Vision Settings</h3>
              <p className="text-xs text-zinc-500">Configure your Gemini credentials & AI model</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* Demo Mode Switch */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-amber-950">Smart Demo Mode</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-800">
                  Zero Cost
                </span>
              </div>
              <p className="text-xs text-amber-800/80 mt-1 leading-relaxed">
                Allows testing with comprehensive clinical samples, Monk scale shade matching, and natural remedies without requiring a personal API key.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input 
                type="checkbox" 
                checked={demoToggle} 
                onChange={(e) => setDemoToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          {/* Gemini API Key Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Google Gemini API Key
              </label>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
              >
                Get Free Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder={process.env.GEMINI_API_KEY ? "Using environment GEMINI_API_KEY" : "Paste your AI Studio API key (AIzaSy...)"}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 font-mono transition-all"
            />
            <p className="text-[11px] text-zinc-400 mt-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Your key stays safely stored locally in your browser. Never transmitted to third-party servers.
            </p>
          </div>

          {/* Model Selection */}
          <div>
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1.5">
              Multimodal Vision Model
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', tag: 'Fastest / Recommended' },
                { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', tag: 'Deep Clinical' },
                { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', tag: 'Legacy' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModelSelect(m.id as any)}
                  className={`p-3 text-left rounded-xl border transition-all ${
                    modelSelect === m.id
                      ? 'border-zinc-950 bg-zinc-950 text-white shadow-sm'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white text-zinc-800'
                  }`}
                >
                  <div className="text-xs font-bold">{m.name}</div>
                  <div className={`text-[10px] mt-0.5 ${modelSelect === m.id ? 'text-zinc-300' : 'text-zinc-400'}`}>
                    {m.tag}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Test Status Feedback */}
          {testResult && (
            <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
              testResult.success 
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}>
              {testResult.success ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{testResult.msg}</span>
            </div>
          )}

          {/* Connection Test Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="text-xs font-bold text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Cpu className="w-3.5 h-3.5" />
              {testing ? "Testing connection..." : "Test Connection"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
          >
            Save Settings
          </button>
        </div>

      </div>
    </div>
  );
};
