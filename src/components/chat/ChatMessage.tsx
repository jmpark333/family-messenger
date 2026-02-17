'use client';

import { useState } from 'react';
import type { ChatMessage as MessageType } from '@/types';

interface ChatMessageProps {
  message: MessageType;
  isMine: boolean;
  showDateDivider?: boolean;
  previousMessage?: MessageType;
  onReply?: (message: MessageType) => void;
}

export default function ChatMessage({ message, isMine, showDateDivider, previousMessage, onReply }: ChatMessageProps) {
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

  const timeString = new Date(message.timestamp).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const dateString = new Date(message.timestamp).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      if (onReply && !isMine) {
        onReply(message);
      }
    }, 500);
    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleMouseLeave = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleClick = () => {
    if (onReply && !isMine) {
      onReply(message);
    }
  };

  const shouldShowDateDivider = showDateDivider || (
    previousMessage && 
    new Date(message.timestamp).toDateString() !== new Date(previousMessage.timestamp).toDateString()
  );

  return (
    <>
      {shouldShowDateDivider && (
        <div className="flex justify-center my-4">
          <div className="bg-gray-200 dark:bg-gray-700 px-4 py-1 rounded-full text-xs text-gray-600 dark:text-gray-400">
            {dateString}
          </div>
        </div>
      )}

      <div
        className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-fade-in ${!isMine && onReply ? 'cursor-pointer hover:opacity-80' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className={`max-w-[90%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
          {!isMine && (
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-2">
              {message.senderId.slice(0, 8)}...
            </span>
          )}

          <div className={`message-bubble ${isMine ? 'message-sent' : 'message-received'}`}>
            {message.replyTo && (
              <div className="mb-2 p-2 bg-black/10 rounded-lg">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {message.replyTo.senderName}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {message.replyTo.content}
                </p>
              </div>
            )}

            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>

            <div className={`flex items-center gap-2 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
              <span className="text-xs opacity-70">
                {timeString}
              </span>

              {message.encrypted && (
                <span className="text-xs opacity-70" title="End-to-End 암호화됨">
                  🔒
                </span>
              )}

              {isMine && (
                <MessageStatus status={message.status} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

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
