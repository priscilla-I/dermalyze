import React, { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { ApiKeyModal } from './components/common/ApiKeyModal';
import { ShelfScanTab } from './components/tabs/ShelfScanTab';
import { BeautyScanTab } from './components/tabs/BeautyScanTab';
import { SingleAnalysisTab } from './components/tabs/SingleAnalysisTab';
import { RoutineBuilderTab } from './components/tabs/RoutineBuilderTab';
import { NaturalRemedyTab } from './components/tabs/NaturalRemedyTab';
import { VanityShelfTab } from './components/tabs/VanityShelfTab';
import { ChatBotTab } from './components/tabs/ChatBotTab';
import { useApp } from './context/AppContext';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const { activeTab, toastMessage, t } = useApp();
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 flex flex-col selection:bg-rose-100 selection:text-rose-900">
      
      {/* Top Navbar */}
      <Navbar onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)} />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'shelf' && <ShelfScanTab />}
        {activeTab === 'beauty' && <BeautyScanTab />}
        {activeTab === 'single' && <SingleAnalysisTab />}
        {activeTab === 'routine' && <RoutineBuilderTab />}
        {activeTab === 'natural' && <NaturalRemedyTab />}
        {activeTab === 'vanity' && <VanityShelfTab />}
        {activeTab === 'chat' && <ChatBotTab />}
      </main>

      {/* Footer Disclaimer */}
      <footer className="mt-auto border-t border-zinc-200/60 bg-white/70 backdrop-blur-md py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-zinc-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>Dermalyze 2.0 Clinical Intelligence Studio</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            {t('disclaimer')}
          </p>
          <div className="text-[10px] text-zinc-400 font-mono">
            &copy; {new Date().getFullYear()} Dermalyze Labs. Open-source precision dermatology.
          </div>
        </div>
      </footer>

      {/* Floating Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-950 text-white px-4 py-3 rounded-2xl shadow-xl border border-white/10 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* API Key & Model Settings Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

    </div>
  );
}
