/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Sparkles, X, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { AICategory } from '../types/index.js';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAssistantDrawer({ isOpen, onClose }: AIAssistantDrawerProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello ${user?.displayName || 'Student'}! I am your Enermind Campus AI advisor powered by Gemini 3.7 Flash. How can I help with your coursework, past papers, or exam prep today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);

    try {
      setIsLoading(true);
      const res = await api.askGemini({
        category: AICategory.ACADEMIC,
        prompt: userMessage,
        userContext: {
          courseName: user?.courseName || 'Computer Science',
          institutionName: user?.institutionName || 'University of Nairobi',
          yearLevel: user?.yearLevelLabel || 'Year 3',
        },
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.response,
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `I encountered an issue querying the academic model: ${err.message}. Please try again.`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0A0B10]/85 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-[#12141D] h-full border-l border-white/10 flex flex-col justify-between shadow-2xl">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between bg-[#0A0B10]/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#50E3C2]/10 text-[#50E3C2] flex items-center justify-center border border-[#50E3C2]/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Campus AI Advisor</h3>
                <span className="text-[9px] font-mono bg-[#50E3C2]/10 text-[#50E3C2] border border-[#50E3C2]/30 px-1.5 py-0.2 rounded">
                  Gemini 3.7
                </span>
              </div>
              <p className="text-[11px] text-white/40 truncate max-w-[240px]">
                {user?.courseName || 'General Academic'} • {user?.institutionName || 'University'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/40 hover:text-white rounded-lg bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 custom-scrollbar">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-[#50E3C2]/10 text-[#50E3C2] flex items-center justify-center shrink-0 border border-[#50E3C2]/20 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-white text-black font-medium'
                    : 'bg-white/5 border border-white/5 text-white/90'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                <div
                  className={`text-[9px] mt-1 text-right font-mono ${
                    m.role === 'user' ? 'text-black/50' : 'text-white/30'
                  }`}
                >
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#50E3C2] p-3 rounded-2xl bg-[#50E3C2]/5 border border-[#50E3C2]/20 w-fit">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing academic context with Gemini...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 bg-[#0A0B10]/40 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setInput('Explain the top 5 past exam concepts for my course')}
            className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 text-white/60 hover:text-white border border-white/5 whitespace-nowrap transition-colors cursor-pointer"
          >
            💡 Top exam concepts
          </button>
          <button
            onClick={() => setInput('Generate a 7-day revision schedule for upcoming finals')}
            className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 text-white/60 hover:text-white border border-white/5 whitespace-nowrap transition-colors cursor-pointer"
          >
            📅 7-Day revision schedule
          </button>
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-[#0A0B10]/80">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Ask anything about courses, exams, or campus life..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-4 pr-12 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#50E3C2]/50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-1.5 w-7 h-7 rounded-full bg-[#50E3C2] text-black disabled:opacity-40 flex items-center justify-center transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
