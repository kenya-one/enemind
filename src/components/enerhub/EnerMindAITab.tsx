import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  BookOpen,
  FileCheck,
  Lightbulb,
  Briefcase,
  Film,
  Music,
  RefreshCw,
  Zap
} from 'lucide-react';
import { EnerMindChatMessage, EnerHubTab } from '../../types';
import { ENERMIND_LOGO_URL } from '../../data/enerHubData';

interface EnerMindAITabProps {
  onNavigateTab: (tab: EnerHubTab, query?: string) => void;
}

const INITIAL_MESSAGES: EnerMindChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: `Jambo! I am **EnerMind AI**, your Antigravity University Copilot.

I have direct real-time access to the entire **EnerHub Kenya knowledge network**:
• 📚 **Study Notes** — CS, Business, Law, Engineering, Medicine & KCSE
• 📝 **Past Examination Papers** — UoN, KU, JKUAT & KASNEB with worked solutions
• 💡 **Final Year Projects** — M-Pesa & AI capstones, blueprints & viva tips
• 💼 **Industrial Attachments** — Safaricom, KCB, KenGen, KEMRI & AI cover letters
• 🎬 **Cinema & Beats** — Tech documentaries & focus study lo-fi

What unit, exam question, or career goal are you working on today?`,
    timestamp: 'Just now',
    suggestedActions: [
      { label: 'Past Papers with Solutions', targetTab: 'past_papers' },
      { label: 'Safaricom & KCB Attachments', targetTab: 'attachments' },
      { label: 'M-Pesa Capstone Blueprints', targetTab: 'projects' },
      { label: 'Study Notes & Modules', targetTab: 'notes' }
    ]
  }
];

export const EnerMindAITab: React.FC<EnerMindAITabProps> = ({ onNavigateTab }) => {
  const [messages, setMessages] = useState<EnerMindChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const quickPromptChips = [
    'Past papers for UoN Computer Science',
    'Open Industrial Attachments in Nairobi',
    'Final Year Project with M-Pesa API',
    'Study Notes for Kenyan Land Law',
    'Recommend focus study beats'
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: EnerMindChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ener-mind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Server response was not ok');
      }

      const data = await response.json();
      const reply = data.reply || 'Jambo! I am here to help with notes, past papers, project blueprints, and attachments.';

      // Determine smart suggested action based on text
      const suggestedActions: EnerMindChatMessage['suggestedActions'] = [];
      const lower = text.toLowerCase();
      if (lower.includes('past paper') || lower.includes('exam')) {
        suggestedActions.push({ label: 'Browse Past Papers Repository', targetTab: 'past_papers' });
      }
      if (lower.includes('attachment') || lower.includes('intern') || lower.includes('safaricom')) {
        suggestedActions.push({ label: 'View Industrial Attachments', targetTab: 'attachments' });
      }
      if (lower.includes('project') || lower.includes('capstone') || lower.includes('idea')) {
        suggestedActions.push({ label: 'Explore Project Blueprints', targetTab: 'projects' });
      }
      if (lower.includes('note') || lower.includes('study') || lower.includes('unit')) {
        suggestedActions.push({ label: 'Open Study Notes Library', targetTab: 'notes' });
      }
      if (lower.includes('movie') || lower.includes('film') || lower.includes('video')) {
        suggestedActions.push({ label: 'Watch Documentaries & Cinema', targetTab: 'movies' });
      }
      if (lower.includes('music') || lower.includes('beat') || lower.includes('audio') || lower.includes('lofi')) {
        suggestedActions.push({ label: 'Play Study Focus Beats', targetTab: 'music' });
      }

      const botMessage: EnerMindChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: suggestedActions.length > 0 ? suggestedActions : undefined
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching EnerMind AI reply:', error);
      const fallbackMsg: EnerMindChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: 'Jambo! I encountered a transient network connection error. You can explore verified curriculum notes, past exams, and attachments using the tabs above.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: 'Browse Past Papers', targetTab: 'past_papers' },
          { label: 'View Study Notes', targetTab: 'notes' }
        ]
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between space-y-3">
      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0">
        <span className="text-[11px] font-mono text-[#FFD700] shrink-0 font-semibold">
          Suggestions:
        </span>
        {quickPromptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-[#FFD700]/50 text-[11px] text-neutral-300 rounded-full whitespace-nowrap transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-neutral-900 border border-[#FFD700]/50 p-1 flex items-center justify-center shrink-0">
                  <img
                    src={ENERMIND_LOGO_URL}
                    alt="AI"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-[#FFD700] text-black font-medium rounded-tr-sm shadow-md'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-sm shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1 border-b pb-1 border-current/10 font-mono text-[10px]">
                  <span className="font-bold">
                    {isUser ? 'You' : 'EnerMind Neural AI'}
                  </span>
                  <span className="opacity-60">{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-line space-y-1">
                  {msg.text}
                </div>

                {/* Suggested Action Shortcuts */}
                {msg.suggestedActions && (
                  <div className="mt-3 pt-2 border-t border-neutral-800 space-y-1.5">
                    <span className="text-[10px] font-mono text-[#FFD700] block">
                      Quick Shortcuts:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => onNavigateTab(action.targetTab, action.query)}
                          className="px-2.5 py-1 bg-neutral-800 hover:bg-[#FFD700] hover:text-black text-neutral-200 text-[11px] font-semibold rounded-xl flex items-center gap-1 transition-colors border border-neutral-700 hover:border-transparent"
                        >
                          <span>{action.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0 text-neutral-300">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-8 h-8 rounded-full bg-neutral-900 p-1 flex items-center justify-center shrink-0">
              <img
                src={ENERMIND_LOGO_URL}
                alt="AI"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl rounded-tl-sm text-xs text-neutral-400 flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
              <span>Synthesizing campus academic neural network...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 shrink-0 pt-1"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask EnerMind AI about past papers, revision notes, attachments..."
          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFD700]"
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="p-2.5 rounded-full bg-[#FFD700] hover:bg-yellow-300 text-black disabled:opacity-40 transition-colors shadow-lg shadow-[#FFD700]/20 flex items-center justify-center cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
