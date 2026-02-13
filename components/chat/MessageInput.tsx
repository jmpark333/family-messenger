'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/stores/chat-store';
import { getP2PManager } from '@/lib/webrtc/peer';
import type { DataMessage } from '@/types';

export default function MessageInput() {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { myPeerId } = useChatStore();

  // 타이핑 인디케이터 전송
  useEffect(() => {
    if (!isTyping || !myPeerId) return;

    const p2pManager = getP2PManager();
    if (!p2pManager) return;

    const typingMessage: DataMessage = {
      id: crypto.randomUUID(),
      type: 'typing',
      senderId: myPeerId,
      timestamp: Date.now(),
      data: { isTyping: true },
    };

    p2pManager.broadcast(typingMessage);

    // 3초 후 타이핑 종료
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isTyping, myPeerId]);

  const handleSend = () => {
    if (!text.trim() || !myPeerId) return;

    // 메시지 생성
    const message: DataMessage = {
      id: crypto.randomUUID(),
      type: 'text',
      senderId: myPeerId,
      timestamp: Date.now(),
      data: text,
      encrypted: true,
    };

    // P2P로 전송
    const p2pManager = getP2PManager();
    if (p2pManager) {
      p2pManager.broadcast(message);

      if (true) {
        // 로컬 메시지 목록에 추가
        useChatStore.getState().addMessage({
          id: message.id,
          senderId: myPeerId,
          content: text,
          timestamp: Date.now(),
          status: 'sent',
          encrypted: true,
        });

        setText('');
        setIsTyping(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    // 타이핑 인디케이터 활성화
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
    }
  };

  return (
    <div className="flex items-end gap-2">
      {/* 텍스트 입력 */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요... (Shift+Enter로 줄바꿈)"
          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 rounded-2xl resize-none focus:outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          rows={1}
          style={{ minHeight: '48px', maxHeight: '120px' }}
        />

        {/* 암호화 표시 */}
        <div className="absolute right-3 bottom-3 text-xs text-secure-green flex items-center gap-1">
          <span className="animate-pulse">🔒</span>
          <span className="hidden sm:inline">E2E</span>
        </div>
      </div>

      {/* 전송 버튼 */}
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
