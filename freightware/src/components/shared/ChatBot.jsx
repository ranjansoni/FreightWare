'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatResponses, pageSuggestions, fallbackResponse } from '@/data/chatResponses';

function matchResponse(input) {
  const lower = input.toLowerCase();
  const tokens = lower.split(/\s+/);

  let bestMatch = null;
  let bestScore = 0;

  for (const entry of chatResponses) {
    let score = 0;
    for (const trigger of entry.triggers) {
      if (trigger.includes(' ')) {
        if (lower.includes(trigger)) score += 3;
      } else {
        if (tokens.includes(trigger)) score += 2;
        else if (lower.includes(trigger)) score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  return bestScore >= 2 ? bestMatch.answer : null;
}

const GREETING = "Hi! I'm the FreightWare Assistant. Ask me about optimization, load planning, shipment data, or our business value. Pick a suggestion below or type your own question.";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: GREETING },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const pathname = usePathname();
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const suggestions = pageSuggestions[pathname] || pageSuggestions['/'];

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const sendMessage = useCallback(
    (text) => {
      if (!text.trim()) return;
      const userMsg = { role: 'user', text: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setTyping(true);

      const answer = matchResponse(text);
      setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: answer || fallbackResponse },
        ]);
      }, 600 + Math.random() * 400);
    },
    []
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const lastBotIdx = [...messages].reverse().findIndex((m) => m.role === 'bot');
  const showSuggestionsAfter = lastBotIdx !== -1 ? messages.length - 1 - lastBotIdx : 0;

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-fw-cyan flex items-center justify-center shadow-lg shadow-fw-cyan/25 hover:shadow-fw-cyan/40 transition-shadow"
          >
            <MessageCircle size={22} className="text-white" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-fw-purple flex items-center justify-center">
              <span className="text-[8px] font-bold text-white">AI</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[500px] bg-fw-surface border border-fw-border rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-fw-border bg-fw-surface-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-fw-cyan/20 flex items-center justify-center">
                  <Sparkles size={14} className="text-fw-cyan" />
                </div>
                <div>
                  <h3 className="text-sm font-display font-semibold text-fw-text">
                    FreightWare Assistant
                  </h3>
                  <p className="text-[10px] text-fw-text-muted">
                    Ask about optimization, planning & more
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-md hover:bg-fw-bg text-fw-text-muted hover:text-fw-text transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {messages.map((msg, i) => (
                <div key={i}>
                  <div
                    className={`flex gap-2 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'bot' && (
                      <div className="w-6 h-6 rounded-full bg-fw-cyan/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot size={12} className="text-fw-cyan" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-fw-cyan/10 text-fw-text'
                          : 'bg-fw-surface-2 text-fw-text-dim'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-6 h-6 rounded-full bg-fw-purple/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User size={12} className="text-fw-purple" />
                      </div>
                    )}
                  </div>

                  {/* Suggestions after the last bot message */}
                  {msg.role === 'bot' && i === showSuggestionsAfter && !typing && (
                    <div className="flex flex-wrap gap-1.5 mt-2 ml-8">
                      {suggestions.map((s, j) => (
                        <button
                          key={j}
                          onClick={() => sendMessage(s)}
                          className="text-[11px] px-2.5 py-1 rounded-full border border-fw-border text-fw-text-muted hover:border-fw-cyan/50 hover:text-fw-cyan transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {typing && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-fw-cyan/10 flex items-center justify-center flex-shrink-0">
                    <Bot size={12} className="text-fw-cyan" />
                  </div>
                  <div className="bg-fw-surface-2 rounded-lg px-3 py-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-fw-text-muted rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-fw-text-muted rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-fw-text-muted rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-fw-border bg-fw-surface-2">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  className="flex-1 bg-fw-bg border border-fw-border rounded-lg px-3 py-2 text-sm text-fw-text placeholder:text-fw-text-muted focus:outline-none focus:border-fw-cyan/50"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim()}
                  className="p-2 rounded-lg bg-fw-cyan text-white disabled:opacity-30 hover:bg-fw-cyan/80 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
