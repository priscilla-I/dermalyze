import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  User, 
  Bot, 
  Loader2, 
  RefreshCcw, 
  MessageSquare, 
  Maximize2, 
  Minimize2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { createChatSession } from '../../services/geminiService';
import { ChatMessage } from '../../types';

export const ChatBotTab: React.FC = () => {
  const { language, t } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello! I am your Dermalyze AI Clinical Consultant. I can analyze complex ingredient chemistry, decode pore-clogging comedogenicity, review AM/PM routine order, and recommend botanical recipes. How can I help you today?`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Can I use Retinol with Vitamin C?",
    "What is Salicylic Acid good for?",
    "How does Niacinamide help pores?",
    "Is alcohol denat harmful for dry skin?",
    "Best kitchen mask for hyperpigmentation?"
  ];

  useEffect(() => {
    chatSessionRef.current = createChatSession(language);
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = createChatSession(language);
      }
      const response = await chatSessionRef.current.sendMessage({ message: text });
      const replyText = response.text || "I was unable to process that clinical query. Please try rephrasing.";

      setMessages(prev => [
        ...prev,
        {
          id: 'model_' + Date.now(),
          role: 'model',
          text: replyText,
          timestamp: Date.now()
        }
      ]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errMsg = err?.message || String(err);
      let fallback = "Sorry, I encountered an error communicating with the model.";
      if (errMsg.includes('403') || errMsg.includes('PERMISSION_DENIED')) {
        fallback = "API Error (403 Permission Denied): Your Gemini API key is inactive or rejected. You can enable Demo Mode in settings to test without an active key.";
      } else if (errMsg.includes('RESOURCE_EXHAUSTED')) {
        fallback = "Quota Limit Reached: The Gemini API rate limit has been reached. Please switch to Demo Mode or wait a minute.";
      }
      setMessages(prev => [
        ...prev,
        {
          id: 'model_err_' + Date.now(),
          role: 'model',
          text: fallback,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    chatSessionRef.current = createChatSession(language);
    setMessages([
      {
        id: 'welcome_reset',
        role: 'model',
        text: `Consultation session refreshed. Ask me anything regarding skincare formulation, ingredient safety, or routine balance!`,
        timestamp: Date.now()
      }
    ]);
  };

  return (
    <div className={`flex flex-col transition-all duration-300 ${
      isFullScreen 
        ? 'fixed inset-0 z-50 bg-white p-4 sm:p-6' 
        : 'max-w-4xl mx-auto h-[680px] glass-panel rounded-3xl overflow-hidden'
    }`}>
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-zinc-950 rounded-xl flex items-center justify-center text-white shadow-xs">
            <Bot className="w-5 h-5 text-rose-300" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-950 text-sm">Clinical AI Dermatology Consultant</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
              Evidence-Based Formulation Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 rounded-full transition-colors"
            title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={resetChat}
            className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 rounded-full transition-colors"
            title="Reset Chat"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] sm:max-w-[78%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                msg.role === 'user' ? 'bg-zinc-200 text-zinc-700' : 'bg-zinc-950 text-white'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-rose-300" />}
              </div>
              <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium ${
                msg.role === 'user' 
                  ? 'bg-zinc-950 text-white rounded-tr-none shadow-sm' 
                  : 'bg-white border border-zinc-200/80 text-zinc-800 rounded-tl-none shadow-xs'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-rose-300" />
              </div>
              <div className="bg-white border border-zinc-200 p-4 rounded-2xl rounded-tl-none shadow-xs flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                <span className="text-xs text-zinc-500 font-medium">Reviewing cosmetic chemistry databases...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 border-t border-zinc-100 bg-zinc-50/50 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0">
          Suggestions:
        </span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="px-3 py-1 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-full border border-zinc-200/80 transition-all shrink-0 whitespace-nowrap active:scale-95 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-zinc-100">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about ingredients, pH balance, acne triggers, or routine layering..."
            className="w-full pl-4 pr-12 py-3 bg-zinc-100/80 border-none rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-zinc-950 transition-all outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 disabled:opacity-30 text-white transition-all shadow-xs"
            title="Send Message"
          >
            <Send className="w-4 h-4 text-rose-200" />
          </button>
        </form>
      </div>

    </div>
  );
};
