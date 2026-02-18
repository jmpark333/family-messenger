'use client';

import { useState, useRef, useEffect } from 'react';
import { File } from 'lucide-react';
import type { ChatMessage as ChatMessageType, MessageAttachment, MessageStatus } from '@/types';
import { QuotedMessage } from './QuotedMessage';

interface ChatMessageProps {
  message: ChatMessageType;
  isMine: boolean;
  onReplyClick?: (message: ChatMessageType) => void;
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

          {/* Attachment (image or PDF) */}
          {message.attachment && (
            <div className="mt-2 mb-2">
              {message.attachment.type === 'image' ? (
                <img
                  src={`data:image/${message.attachment.name.split('.').pop()};base64,${message.attachment.data}`}
                  alt={message.attachment.name}
                  className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Open image in new tab
                    const win = window.open();
                    if (win) {
                      win.document.write(`<img src="data:image/${message.attachment.name.split('.').pop()};base64,${message.attachment.data}" style="max-width:100%"/>`);
                    }
                  }}
                />
              ) : (
                <a
                  href={`data:application/pdf;base64,${message.attachment.data}`}
                  download={message.attachment.name}
                  className="flex items-center gap-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <File className="w-8 h-8 text-red-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{message.attachment.name}</p>
                    <p className="text-xs text-gray-500">
                      {(message.attachment.size / 1024).toFixed(1)} KB • PDF 파일
                    </p>
                  </div>
                  <span className="text-xs text-red-600">다운로드</span>
                </a>
              )}
            </div>
          )}

          {/* Text content */}
          {message.content && (
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
          )}

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
  status: MessageStatus;
}

function MessageStatus({ status }: MessageStatusProps) {
  const statusConfig: Record<MessageStatus, { icon: string; label: string }> = {
    pending: { icon: '⏳', label: '전송 중' },
    sent: { icon: '✓', label: '전송됨' },
    delivered: { icon: '✓✓', label: '도착' },
  };

  const config = statusConfig[status];

  return (
    <span className="text-xs opacity-70" title={config.label}>
      {config.icon}
    </span>
  );
}
