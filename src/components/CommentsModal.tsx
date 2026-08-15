import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Heart,
  Send,
  CornerDownRight,
  Sparkles,
  MessageCircle,
  CheckCircle2
} from 'lucide-react';
import { CommentItem, UserProfile } from '../types';

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments: CommentItem[];
  listingTitle: string;
  currentUser: UserProfile;
  onAddComment: (text: string, replyToId?: string) => void;
  onLikeComment: (commentId: string) => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  comments,
  listingTitle,
  currentUser,
  onAddComment,
  onLikeComment
}) => {
  const [inputText, setInputText] = useState('');
  const [replyTo, setReplyTo] = useState<CommentItem | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAddComment(inputText.trim(), replyTo?.id);
    setInputText('');
    setReplyTo(null);
  };

  const quickQuestions = [
    'Is water borehole or NCC?',
    'Is deposit negotiable in 2 installments?',
    'Can I book a physical viewing tomorrow?',
    'Are pets allowed in the compound?',
    'Is there high-speed fiber internet ready?'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-lg bg-[#111111] border border-white/15 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col h-[80vh] max-h-[680px] text-neutral-100 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0a0a0a]">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#FFD700]" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-light text-base sm:text-lg text-white">House Hunt Inquiries</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-[#FFD700] border border-white/10">
                    {comments.length}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 truncate max-w-[260px] sm:max-w-xs">{listingTitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              id="close-comments-modal-btn"
              className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Questions suggestion bar */}
          <div className="bg-[#181818] px-3 py-2 border-b border-white/10 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD700] shrink-0" />
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 shrink-0 font-semibold">Ask Caretaker:</span>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(q)}
                className="text-[11px] px-2.5 py-1 rounded bg-black/60 hover:bg-black text-neutral-300 hover:text-[#FFD700] border border-white/10 whitespace-nowrap transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#111111]">
            {comments.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <MessageCircle className="w-12 h-12 text-neutral-600 mb-2" />
                <p className="font-serif font-light text-white text-lg">No inquiries yet</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Be the first to inquire about this verified Kenya residence!
                </p>
              </div>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="space-y-2">
                  <div className="flex items-start gap-3 group">
                    <img
                      src={c.user.avatar}
                      alt={c.user.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/15"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-neutral-200">{c.user.name}</span>
                        {c.user.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-[#FFD700]" />}
                        <span className="text-[10px] text-neutral-500">{c.timestamp}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-300 mt-0.5 leading-relaxed">{c.text}</p>
                      <div className="flex items-center gap-4 mt-1.5">
                        <button
                          onClick={() => setReplyTo(c)}
                          className="text-[11px] text-neutral-400 hover:text-[#FFD700] font-medium transition-colors"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => onLikeComment(c.id)}
                      className="flex flex-col items-center gap-0.5 text-neutral-400 hover:text-[#FFD700] transition-colors p-1"
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform active:scale-125 ${
                          c.isLiked ? 'fill-[#FFD700] text-[#FFD700]' : ''
                        }`}
                      />
                      <span className="text-[10px] font-semibold">{c.likes || 0}</span>
                    </button>
                  </div>

                  {/* Nested Replies */}
                  {c.replies && c.replies.length > 0 && (
                    <div className="ml-9 pl-3 border-l-2 border-[#FFD700]/40 space-y-3 pt-1">
                      {c.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-2.5">
                          <img
                            src={reply.user.avatar}
                            alt={reply.user.name}
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-[#FFD700]/40"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-[#FFD700]">{reply.user.name}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FFD700]/20 text-[#FFD700] font-bold uppercase tracking-wider">
                                Agency/Host
                              </span>
                              <span className="text-[10px] text-neutral-500">{reply.timestamp}</span>
                            </div>
                            <p className="text-xs text-neutral-200 mt-0.5 leading-relaxed">{reply.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Reply Banner if active */}
          {replyTo && (
            <div className="bg-[#181818] px-4 py-1.5 flex items-center justify-between text-xs text-neutral-300 border-t border-white/10">
              <div className="flex items-center gap-1.5 truncate">
                <CornerDownRight className="w-3.5 h-3.5 text-[#FFD700] shrink-0" />
                <span>
                  Replying to <strong className="text-[#FFD700]">{replyTo.user.name}</strong>
                </span>
              </div>
              <button
                onClick={() => setReplyTo(null)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Comment Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-[#0a0a0a] flex items-center gap-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-[#FFD700]/50 shrink-0"
            />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                replyTo
                  ? `Reply to @${replyTo.user.name}...`
                  : 'Add a comment or ask about deposit/water...'
              }
              className="flex-1 bg-black border border-white/20 rounded-full px-4 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              id="send-comment-btn"
              className="p-2.5 rounded-full bg-white text-black hover:bg-[#FFD700] disabled:opacity-40 disabled:hover:bg-white transition-all shrink-0 font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
