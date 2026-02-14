'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '../../stores/chat-store';
import { useToast } from '../../lib/hooks/useToast';
import ChatMessage from '../../components/chat/ChatMessage';
import MessageInput from '../../components/chat/MessageInput';
import Toaster from '../../components/shared/Toaster';
import SecurityIndicator from '../../components/security/SecurityIndicator';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    isAuthenticated,
    messages,
    typingUserList,
    loadMessages,
    myPeerId,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Debug logging
  useEffect(() => {
    console.log('[ChatPage] Rendered - isAuthenticated:', isAuthenticated);
    console.log('[ChatPage] Messages count:', messages.length);
  }, [isAuthenticated, messages.length]);

  // Redirect to home if not authenticated
  useEffect(() => {
    console.log('[ChatPage] Auth check - isAuthenticated:', isAuthenticated);
    if (!isAuthenticated) {
      console.log('[ChatPage] Not authenticated, redirecting to home');
      router.push('/');
      toast.error('인증이 필요합니다. 가족에 먼저 참여해주세요.');
    }
  }, [isAuthenticated, router, toast]);

  // Load messages on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadMessages();
    }
  }, [isAuthenticated, loadMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">가족 메신저</h1>
            <span className="text-sm text-gray-500">({myPeerId.slice(0, 8)}...)</span>
          </div>
          <SecurityIndicator />
        </div>
      </header>

      {/* Message List */}
      <main className="flex-1 overflow-y-auto message-list">
        <div className="message-container">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
              <p className="text-gray-600">메시지를 보내서 대화를 시작해보세요!</p>
              <p className="text-sm text-gray-500 mt-2">모든 메시지는 End-to-End 암호화됩니다</p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isMine={message.senderId === myPeerId}
              />
            ))
          )}

          {/* Typing Indicator */}
          {typingUserList.length > 0 && (
            <div className="flex items-start gap-2 text-gray-500 text-sm animate-fade-in">
              <div className="flex gap-1">
                <span className="animate-bounce">•</span>
                <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>•</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>•</span>
              </div>
              <span>
                {typingUserList.length === 1
                  ? `${typingUserList[0].slice(0, 8)}...님이 입력 중`
                  : `${typingUserList.length}명이 입력 중`}
              </span>
            </div>
          )}

          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Message Input */}
      <footer className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <MessageInput />
        </div>
      </footer>

      {/* Toaster */}
      <Toaster />
    </div>
  );
}
