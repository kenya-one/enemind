/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  Building2,
  Bot,
  User,
  ArrowRight,
  ShieldCheck,
  MapPin,
  BedDouble,
} from 'lucide-react';
import { AccommodationListing } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { useCurrency } from '../../context/CurrencyContext.js';
import { api } from '../../services/api.js';

interface AccommodationAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProperty: (property: AccommodationListing) => void;
}

interface MessageItem {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  recommendedProperties?: AccommodationListing[];
}

export function AccommodationAIModal({ isOpen, onClose, onSelectProperty }: AccommodationAIModalProps) {
  const { user } = useAuth();
  const { activeRate } = useCurrency();

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'msg-welcome',
      sender: 'AI',
      text: `Hello ${user?.displayName || 'Student'}! I am your Enermind Campus Housing Advisor. Ask me anything about student hostels, bedsitters, private rooms, walking distance from your campus, or options under your monthly budget.`,
    },
  ]);

  if (!isOpen) return null;

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;

    const userText = inputQuery.trim();
    setInputQuery('');

    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      sender: 'USER',
      text: userText,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await api.askAccommodationAI(userText, activeRate.code);
      
      // Fetch property objects for IDs
      let matchedProps: AccommodationListing[] = [];
      if (res.recommendedPropertyIds && res.recommendedPropertyIds.length > 0) {
        const catalogRes = await api.searchAccommodation({ currency: activeRate.code });
        matchedProps = (catalogRes.properties || []).filter((p) =>
          res.recommendedPropertyIds.includes(p.id)
        );
      }

      const aiMsg: MessageItem = {
        id: `ai-${Date.now()}`,
        sender: 'AI',
        text: res.answer,
        recommendedProperties: matchedProps,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'AI',
          text: `Housing AI Assistant error: ${err.message || 'Could not process query.'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="accommodation-ai-modal"
        className="relative w-full max-w-2xl bg-[#12141D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[88vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#171923]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#50E3C2]/15 text-[#50E3C2] flex items-center justify-center border border-[#50E3C2]/30">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Enermind Housing AI Advisor</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#50E3C2]/10 text-[#50E3C2] border border-[#50E3C2]/20">
                  Gemini 3.7
                </span>
              </h2>
              <p className="text-xs text-white/40">Grounded in verified campus accommodation data</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'AI' && (
                <div className="w-7 h-7 rounded-lg bg-[#50E3C2]/10 text-[#50E3C2] flex items-center justify-center border border-[#50E3C2]/20 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-3 ${
                  msg.sender === 'USER'
                    ? 'bg-[#50E3C2] text-black font-medium rounded-tr-none'
                    : 'bg-white/5 border border-white/5 text-white/90 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Grounded Matching Property Cards */}
                {msg.recommendedProperties && msg.recommendedProperties.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="text-[11px] uppercase font-mono text-[#50E3C2] font-semibold">
                      Referenced Verified Listings:
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.recommendedProperties.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            onClose();
                            onSelectProperty(p);
                          }}
                          className="p-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-[#50E3C2]/40 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                        >
                          <div className="space-y-0.5 truncate">
                            <div className="font-bold text-white group-hover:text-[#50E3C2] truncate">{p.title}</div>
                            <div className="text-[11px] text-white/50 flex items-center gap-2">
                              <span>{p.city}</span>
                              <span>•</span>
                              <span className="text-[#50E3C2] font-mono">{p.currency} {p.price.toLocaleString()}/mo</span>
                              <span>•</span>
                              <span>{p.availableUnits} free</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-[#50E3C2] shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'USER' && (
                <div className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center border border-white/10 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-lg bg-[#50E3C2]/10 text-[#50E3C2] flex items-center justify-center border border-[#50E3C2]/20 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-white/50 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-[#50E3C2]" />
                <span>Searching verified accommodation database...</span>
              </div>
            </div>
          )}
        </div>

        {/* Query Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-[#171923] flex gap-2">
          <input
            type="text"
            placeholder="Ask e.g. 'Find quiet single rooms with Wi-Fi near Chiromo under $200'..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="px-5 py-3 rounded-xl text-xs font-bold bg-[#50E3C2] text-black hover:bg-[#38cbb0] transition-colors disabled:opacity-40 flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </form>
      </div>
    </div>
  );
}
