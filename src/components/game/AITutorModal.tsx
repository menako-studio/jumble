import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getGroqApiKey, setGroqApiKey, askGroqTutor } from '../../lib/groqClient';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  cefrLevel?: string;
  ruleExplanation?: string;
  examples?: string[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  lessonTitle,
  cefrLevel,
  ruleExplanation,
  examples,
}) => {
  const { i18n } = useTranslation();
  const lang = (i18n.language as 'en' | 'id') || 'en';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text:
        lang === 'id'
          ? `👋 **Halo! Saya AI Grammar Tutor.** Ada yang bingung tentang **${lessonTitle}** sebelum masuk ke latihan? Tanyakan apa saja!`
          : `👋 **Hi! I am your AI Grammar Tutor.** Have questions about **${lessonTitle}** before starting the challenge? Ask me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getGroqApiKey());
  const [apiKeySaved, setApiKeySaved] = useState(false);

  const quickPrompts = [
    {
      label: lang === 'id' ? '💡 Penjelasan Sederhana' : '💡 Simple Explanation',
      prompt: lang === 'id' ? 'Tolong jelaskan aturan ini dengan cara yang sangat sederhana.' : 'Explain this rule in simple terms.',
    },
    {
      label: lang === 'id' ? '📝 3 Contoh Tambahan' : '📝 3 More Examples',
      prompt: lang === 'id' ? 'Berikan 3 contoh kalimat lainnya dalam kehidupan sehari-hari.' : 'Give me 3 more real-life example sentences.',
    },
    {
      label: lang === 'id' ? '❓ Kapan Digunakan?' : '❓ When to Use?',
      prompt: lang === 'id' ? 'Kapan situasi paling tepat untuk menggunakan rumus ini?' : 'When is the best situation to use this structure?',
    },
    {
      label: lang === 'id' ? '🇮🇩 Bahasa Indonesia' : '🇮🇩 In Indonesian',
      prompt: 'Jelaskan materi ini dalam Bahasa Indonesia secara singkat.',
    },
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    try {
      const responseText = await askGroqTutor({
        question: textToSend,
        lessonTitle,
        cefrLevel,
        ruleExplanation,
        examples,
        lang,
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    setGroqApiKey(apiKeyInput);
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md font-nunito">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            className="w-full max-w-lg bg-surface-card border border-surface-border rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[85vh] relative"
            id="ai-tutor-modal"
          >
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-duo-blue/40 via-purple-600/40 to-emerald-600/40 border-b border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-duo-blue text-white flex items-center justify-center text-xl font-black shadow-glow animate-pulse-glow">
                  ⚡
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-black text-base">Groq AI Grammar Tutor</h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-400 text-emerald-950 uppercase tracking-wide">
                      LLM
                    </span>
                  </div>
                  <p className="text-white/60 text-xs truncate max-w-[200px]">
                    {lessonTitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-xs font-bold transition-all cursor-pointer"
                  title="Groq API Settings"
                  id="groq-settings-btn"
                >
                  ⚙️ Key
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-all cursor-pointer"
                  id="close-ai-tutor-btn"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Groq API Key Settings Overlay */}
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="p-4 bg-surface-panel border-b border-surface-border flex flex-col gap-2 shrink-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white">Groq API Key (Optional)</span>
                  {apiKeySaved && (
                    <span className="text-[10px] text-emerald-400 font-bold">Saved!</span>
                  )}
                </div>
                <p className="text-[11px] text-white/60">
                  Enter your Groq API Key (<code className="text-amber-300">gsk_...</code>) for live Llama-3.3-70b AI answers. Leave empty for instant pre-built fallbacks.
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="gsk_..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-duo-blue"
                  />
                  <button
                    onClick={handleSaveApiKey}
                    className="px-3 py-1.5 rounded-xl bg-duo-blue text-white font-bold text-xs hover:bg-duo-blue-light cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            )}

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 no-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs md:text-sm font-medium leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-duo-blue text-white rounded-br-none'
                        : 'bg-white/10 text-white border border-white/10 rounded-bl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                  <span className="text-[9px] text-white/40 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-white/60 p-2 animate-pulse">
                  <span className="text-base">⚡</span>
                  <span>Groq AI is thinking...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="p-2 border-t border-white/10 bg-black/20 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qp.prompt)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/90 border border-white/10 text-[11px] font-bold shrink-0 transition-all cursor-pointer"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-surface-card border-t border-surface-border flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={
                  lang === 'id' ? 'Tanyakan tentang materi ini...' : 'Ask anything about this lesson...'
                }
                className="flex-1 px-4 py-2.5 rounded-2xl bg-black/40 border border-white/15 text-white text-xs md:text-sm focus:outline-none focus:border-duo-blue placeholder:text-white/40"
                id="ai-tutor-input"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="w-10 h-10 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white font-black flex items-center justify-center transition-all cursor-pointer shadow-md"
                id="ai-tutor-send-btn"
              >
                ➔
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
