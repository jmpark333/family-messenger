import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/stores/chat-store';

interface MessageInputProps {
  onSend: (content: string, replyTo?: any) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { replyTo, setReplyTo } = useChatStore();

  const handleSend = () => {
    if (!text.trim()) return;

    console.log('[MessageInput] Sending message:', text.trim());
    onSend(text.trim(), replyTo);
    setText('');
    setReplyTo(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape' && replyTo) {
      setReplyTo(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  return (
    <div className="flex flex-col gap-2">
      {replyTo && (
        <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                ↩ {replyTo.senderName || replyTo.senderId.slice(0, 8)}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {replyTo.content}
            </p>
          </div>
          <button
            onClick={() => setReplyTo(null)}
            className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="답장 취소"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={replyTo ? "답장을 입력하세요..." : "메시지를 입력하세요... (Shift+Enter로 줄바꿈)"}
            className="w-full px-4 py-3 bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl resize-none focus:outline-none transition-colors text-gray-900 placeholder-gray-500"
            rows={1}
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />

          <div className="absolute right-3 bottom-3 text-xs text-green-600 flex items-center gap-1">
            <span className="animate-pulse">🔒</span>
            <span className="hidden sm:inline">E2E</span>
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          aria-label="메시지 전송"
        >
          <span className="hidden sm:inline">전송</span>
          <span className="text-xl">➤</span>
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
