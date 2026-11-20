import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../ui/Modal';
import { IconButton } from '../ui/IconButton';
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
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as 'en' | 'id') || 'en';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: t('tutor.welcome', { title: lessonTitle }),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getGroqApiKey());
  const [apiKeySaved, setApiKeySaved] = useState(false);

  const quickPrompts = [1, 2, 3, 4].map((n) => ({
    label: t(`tutor.qp${n}Label`),
    prompt: t(`tutor.qp${n}`),
  }));

  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end', behavior: 'auto' });
  }, [messages, isLoading]);

  /** Renders **bold** markers from the tutor's replies instead of showing raw asterisks. */
  const renderInline = (text: string) =>
    text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    );

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
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: t('tutor.error'),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      label={t('tutor.label')}
      showCloseButton={false}
      className="max-w-lg p-0 overflow-hidden flex flex-col h-[600px] max-h-[85dvh]"
    >
      <div id="ai-tutor-modal" className="flex flex-col h-full min-h-0">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-sky-50 via-indigo-50 to-emerald-50 border-b border-surface-border flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div aria-hidden="true" className="w-10 h-10 rounded-2xl bg-sky-700 text-white flex items-center justify-center text-xl shadow-glow shrink-0">
              ⚡
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-ink-900 font-black text-base">Groq AI Grammar Tutor</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-green-700 text-white uppercase tracking-wide">
                  LLM
                </span>
              </div>
              <p className="text-ink-500 text-xs truncate">{lessonTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              aria-expanded={showSettings}
              aria-controls="groq-settings-panel"
              aria-label={t('tutor.settings')}
              title={t('tutor.settings')}
              className="px-3 min-h-11 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-ink-700 text-xs font-bold transition-colors cursor-pointer"
              id="groq-settings-btn"
            >
              {t('tutor.keyButton')}
            </button>
            <IconButton label={t('ui.close')} onClick={onClose} className="bg-white border border-slate-200" id="close-ai-tutor-btn">
              <X className="w-5 h-5" aria-hidden="true" />
            </IconButton>
          </div>
        </div>

        {/* API key settings */}
        {showSettings && (
          <div id="groq-settings-panel" className="p-4 bg-surface-panel border-b border-surface-border flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between">
              <label htmlFor="groq-key-input" className="text-xs font-black text-ink-900">
                {t('tutor.keyTitle')}
              </label>
              {apiKeySaved && (
                <span role="status" className="text-xs text-emerald-800 font-bold">
                  {t('tutor.saved')}
                </span>
              )}
            </div>
            <p className="text-xs text-ink-500">{t('tutor.keyHelp')}</p>
            <div className="flex gap-2">
              <input
                id="groq-key-input"
                type="password"
                autoComplete="off"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="gsk_..."
                className="flex-1 min-h-11 px-3 rounded-xl bg-white border border-slate-300 text-ink-900 text-sm focus:outline-none focus:border-duo-blue"
              />
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="px-4 min-h-11 rounded-xl bg-sky-700 text-white font-bold text-sm hover:bg-sky-800 cursor-pointer transition-colors"
              >
                {t('tutor.save')}
              </button>
            </div>
          </div>
        )}

        {/* Conversation */}
        <div
          role="log"
          aria-live="polite"
          aria-label={t('tutor.messages')}
          className="flex-1 min-h-0 p-4 overflow-y-auto space-y-3 no-scrollbar bg-surface-canvas"
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-sky-700 text-white rounded-br-none'
                    : 'bg-white text-ink-900 border border-surface-border rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{renderInline(msg.text)}</div>
              </div>
              <span className="text-xs text-ink-500 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isLoading && (
            <div role="status" className="flex items-center gap-2 text-sm text-ink-500 p-2 animate-pulse">
              <span className="text-base" aria-hidden="true">⚡</span>
              <span>{t('tutor.thinking')}</span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick prompts */}
        <div
          role="group"
          aria-label={t('tutor.quickPrompts')}
          className="p-2 border-t border-surface-border bg-white flex gap-2 overflow-x-auto no-scrollbar shrink-0"
        >
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(qp.prompt)}
              disabled={isLoading}
              className="px-3 min-h-11 rounded-xl bg-slate-50 hover:bg-slate-100 text-ink-700 border border-slate-200 text-xs font-bold shrink-0 transition-colors cursor-pointer disabled:opacity-50"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-surface-border flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={t('tutor.placeholder')}
            aria-label={t('tutor.placeholder')}
            data-autofocus
            className="flex-1 min-h-11 px-4 rounded-2xl bg-surface-panel border border-slate-200 text-ink-900 text-sm focus:outline-none focus:border-duo-blue placeholder:text-ink-500"
            id="ai-tutor-input"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            aria-label={t('tutor.send')}
            title={t('tutor.send')}
            className="w-11 h-11 rounded-2xl bg-green-700 hover:bg-green-800 disabled:opacity-40 text-white font-black flex items-center justify-center transition-colors cursor-pointer shadow-md"
            id="ai-tutor-send-btn"
          >
            <span aria-hidden="true">➔</span>
          </button>
        </form>
      </div>
    </Modal>
  );
};
