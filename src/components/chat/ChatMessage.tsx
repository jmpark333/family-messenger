'use client';

import { useState, useRef, useEffect } from 'react';
import type { ChatMessage as MessageType } from '@/types';
import { QuotedMessage } from './QuotedMessage';

interface ChatMessageProps {
  message: MessageType;
  isMine: boolean;
  onReplyClick?: (message: MessageType) => void;
  onScrollToOriginal?: (messageId: string) => void;
}

export default function ChatMessage({ message, isMine, onReplyClick, onScrollToOriginal }: ChatMessageProps) {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const timeString = new Date(message.timestamp).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Cleanup effect for longPressTimerRef to prevent memory leaks
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    };
  }, []);

  // Click handler for received messages (short click)
  const handleClick = () => {
    if (!isMine && onReplyClick) {
      onReplyClick(message);
    }
  };

  // Keyboard navigation handler for accessibility (Enter/Space)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isMine && onReplyClick) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onReplyClick(message);
      }
    }
  };

  // Long press handlers (touch events)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMine) {
      e.preventDefault(); // Prevent text selection
      setIsLongPressing(true);

      // Vibrate on supported devices
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }

      // Start long press timer (500ms)
      longPressTimerRef.current = setTimeout(() => {
        if (onReplyClick) {
          onReplyClick(message);
        }
        setIsLongPressing(false);
      }, 500);
    }
  };

  const handleTouchEnd = () => {
    if (!isMine) {
      setIsLongPressing(false);
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }
  };

  const handleTouchMove = () => {
    // Cancel long press if user moves finger
    if (!isMine && isLongPressing) {
      setIsLongPressing(false);
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }
  };

  return (
    <div
      id={`message-${message.id}`}
      className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-fade-in`}
    >
      <div className={`max-w-[90%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* 발신자 이름 (내 메시지는 표시 안함) */}
        {!isMine && (
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-2">
            {message.senderId.slice(0, 8)}...
          </span>
        )}

        {/* 메시지 버블 */}
        <div
          className={`message-bubble ${isMine ? 'message-sent' : 'message-received'} ${
            !isMine ? 'hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer' : ''
          } ${isLongPressing ? 'scale-95' : ''}`}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          role={onReplyClick && !isMine ? 'button' : undefined}
          tabIndex={onReplyClick && !isMine ? 0 : undefined}
          aria-label={onReplyClick && !isMine ? 'Reply to message' : undefined}
        >
          {/* Quoted message (if this is a reply) */}
          {message.replyTo && onScrollToOriginal && (
            <QuotedMessage
              originalMessage={message.replyTo}
              onClick={() => onScrollToOriginal(message.replyTo!.id)}
            />
          )}

          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>

          {/* 메타데이터 */}
          <div className={`flex items-center gap-2 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs opacity-70">
              {timeString}
            </span>

            {/* 암호화 표시 */}
            {message.encrypted && (
              <span className="text-xs opacity-70" title="End-to-End 암호화됨">
                🔒
              </span>
            )}

            {/* 전송 상태 (내 메시지만) */}
            {isMine && (
              <MessageStatus status={message.status} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ 메시지 상태 컴포넌트 ============

interface MessageStatusProps {
  status: MessageType['status'];
}

function MessageStatus({ status }: MessageStatusProps) {
  const statusConfig = {
    sending: { icon: '⏳', label: '전송 중' },
    sent: { icon: '✓', label: '전송됨' },
    delivered: { icon: '✓✓', label: '도착' },
    read: { icon: '✓✓✓', label: '읽음' },
  };

  const config = statusConfig[status];

  return (
    <span className="text-xs opacity-70" title={config.label}>
      {config.icon}
    </span>
  );
}
