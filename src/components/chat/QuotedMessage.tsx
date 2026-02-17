'use client';

import { User } from 'lucide-react';

interface QuotedMessageProps {
  originalMessage: {
    id: string;
    senderId: string;
    senderName?: string;
    content: string;
  };
  onClick?: () => void;
}

export function QuotedMessage({ originalMessage, onClick }: QuotedMessageProps) {
  const displayName = originalMessage.senderName || originalMessage.senderId.slice(0, 8);
  const truncatedContent =
    originalMessage.content.length > 50
      ? originalMessage.content.slice(0, 50) + '...'
      : originalMessage.content;

  return (
    <div
      onClick={onClick}
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
          {truncatedContent}
        </p>
      </div>
    </div>
  );
}

export default QuotedMessage;
