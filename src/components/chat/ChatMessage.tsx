'use client';

import type { ChatMessage as MessageType } from '@/types';

interface ChatMessageProps {
  message: MessageType;
  isMine: boolean;
}

export default function ChatMessage({ message, isMine }: ChatMessageProps) {
  const timeString = new Date(message.timestamp).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
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
        <div className={`message-bubble ${isMine ? 'message-sent' : 'message-received'}`}>
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
