// MessageInput.tsx - 간소화된 버전
import { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSend: (content: string) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!text.trim()) return;

    console.log('[MessageInput] Sending message:', text.trim());
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // 자동 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요... (Shift+Enter로 줄바꿈)"
          className="w-full px-4 py-3 bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl resize-none focus:outline-none transition-colors text-gray-900 placeholder-gray-500"
          rows={1}
          style={{ minHeight: '48px', maxHeight: '120px' }}
        />

        {/* 암호화 표시 */}
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
  );
}

export default MessageInput;
