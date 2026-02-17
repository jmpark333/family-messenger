'use client';

import { User } from 'lucide-react';
import { ReplyToInfo } from '../../../types/index';

interface QuotedMessageProps {
  originalMessage: ReplyToInfo;
  onClick?: () => void;
}

export function QuotedMessage({ originalMessage, onClick }: QuotedMessageProps) {
  const displayName = originalMessage.senderName || originalMessage.senderId.slice(0, 8);
  const content = originalMessage.content.trim();
  const truncatedContent =
    content.length > 50
      ? content.slice(0, 50) + '...'
      : content;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      aria-label={`Reply to message from ${displayName}${truncatedContent ? ': ' + truncatedContent : ''}`}
      className={`
        flex items-start gap-2 px-3 py-2 mb-2 rounded-lg
        bg-gray-100 dark:bg-gray-800 border-l-4 border-blue-500
        ${onClick ? 'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors' : ''}
      `}
    >
      <User className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
          {displayName}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {truncatedContent || <em className="text-gray-400">Empty message</em>}
        </p>
      </div>
    </div>
  );
}

export default QuotedMessage;
