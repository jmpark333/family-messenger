'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  encrypted: boolean;
  status: 'pending' | 'sent' | 'delivered';
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
}

interface ReplyModalProps {
  isOpen: boolean;
  message: Message | null;
  onSend: (content: string) => void;
  onClose: () => void;
}

export default function ReplyModal({ isOpen, message, onSend, onClose }: ReplyModalProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
    if (!isOpen) {
      setText('');
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const timeString = message ? new Date(message.timestamp).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  }) : '';

  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl animate-slide-up">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">답장</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>

          <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {message.senderName || message.senderId.slice(0, 8)}
              </span>
              <span className="text-xs text-gray-500">{timeString}</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>

          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="답장을 입력하세요..."
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 rounded-2xl resize-none focus:outline-none transition-colors text-gray-900 dark:text-gray-100 placeholder-gray-500"
              rows={3}
              style={{ minHeight: '80px', maxHeight: '150px' }}
            />
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="전송"
            >
              <span className="text-xl">➤</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
