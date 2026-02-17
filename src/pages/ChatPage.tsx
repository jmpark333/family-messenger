// ChatPage.tsx - 간소화된 버전 (P2P 제거, 서버 폴링 방식)
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '@/stores/chat-store';
import { apiClient } from '@/lib/api/client';
import { encryptMessage, decryptMessage } from '@/lib/crypto';
import ChatMessage from '@/components/chat/ChatMessage';
import MessageInput from '@/components/chat/MessageInput';
import ReplyModal from '@/components/chat/ReplyModal';
import Toaster from '@/components/shared/Toaster';
import { useToast } from '@/lib/hooks/useToast';
import { ReplyToInfo } from '@/types/index';

/**
 * Helper function to convert a Message to ReplyToInfo type.
 * This ensures type safety when passing message data to ReplyModal.
 *
 * @param message - The message object from the chat store
 * @returns A ReplyToInfo object with only the required fields
 */
function toReplyToInfo(message: { id: string; senderId: string; senderName: string; content: string }): ReplyToInfo {
  return {
    id: message.id,
    senderId: message.senderId,
    senderName: message.senderName,
    content: message.content,
  };
}

export default function ChatPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    isAuthenticated,
    familyId,
    myMemberId,
    myName,
    myPrivateKey,
    membersPublicKeys,
    messages,
    addMessage,
    loadMessages,
    logout,
    replyToMessage,
    isReplyModalOpen,
    setReplyToMessage,
    clearReplyToMessage,
  } = useChatStore();

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTimeRef = useRef<number>(0);

  // 인증 체크
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      toast.error('인증이 필요합니다');
    } else {
      loadMessages();
    }
  }, [isAuthenticated]);

  // 메시지 폴링 (3초마다)
  useEffect(() => {
    if (!isAuthenticated || !familyId) return;

    const pollMessages = async () => {
      if (isLoading) return;
      setIsLoading(true);

      try {
        const lastTimestamp =
          messages[messages.length - 1]?.timestamp || 0;
        const data = await apiClient.pollMessages(familyId, lastTimestamp);

        for (const msg of data.messages) {
          // 내가 보낸 메시지는 무시
          if (msg.senderId === myMemberId) {
            continue;
          }

          let content = msg.content;
          // 암호화된 메시지 복호화
          if (msg.encrypted && myPrivateKey) {
            try {
              content = await decryptMessage(msg.content, myPrivateKey);
            } catch (error) {
              console.error('Decryption failed:', error);
              content = '[복호화 실패]';
            }
          }

          addMessage({
            id: msg.id,
            senderId: msg.senderId,
            senderName: msg.senderName,
            content,
            timestamp: msg.timestamp,
            encrypted: msg.encrypted,
            status: 'delivered',
            ...(msg.replyTo && { replyTo: msg.replyTo }),
          });
        }
      } catch (error) {
        console.error('Failed to poll messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const interval = setInterval(pollMessages, 3000); // 3초마다 폴링
    pollMessages(); // 초기 로딩

    return () => clearInterval(interval);
  }, [isAuthenticated, familyId, myMemberId, myPrivateKey]);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup scroll timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    };
  }, []);

  const handleSendMessage = async (content: string) => {
    console.log('[ChatPage] handleSendMessage called:', { content, familyId, myMemberId, myName });

    if (!familyId || !myMemberId || !myName) {
      console.error('[ChatPage] Missing required data:', { familyId, myMemberId, myName });
      return;
    }

    try {
      // TODO: 각 멤버의 공개키로 암호화 (현재는 평문)
      // 멀티캐스트 암호화는 추후 구현
      const encrypted = false;

      console.log('[ChatPage] Calling apiClient.sendMessage...');
      const response = await apiClient.sendMessage({
        familyId,
        senderId: myMemberId,
        senderName: myName,
        content,
        encrypted,
      });

      console.log('[ChatPage] Message sent successfully:', response);

      // 로컬 메시지 추가
      addMessage({
        id: response.messageId,
        senderId: myMemberId,
        senderName: myName,
        content,
        timestamp: Date.now(),
        encrypted,
        status: 'sent',
      });
    } catch (error) {
      console.error('[ChatPage] Failed to send message:', error);
      toast.error('메시지 전송 실패');
    }
  };

  const handleReplyClick = (message: typeof messages[0]) => {
    console.log('[ChatPage] handleReplyClick called:', message);
    setReplyToMessage(message);
  };

  const handleSendReply = async (content: string, replyToId: string) => {
    console.log('[ChatPage] handleSendReply called:', { content, replyToId });

    if (!familyId || !myMemberId || !myName) {
      console.error('[ChatPage] Missing required data:', { familyId, myMemberId, myName });
      throw new Error('Missing required information');
    }

    // Find the original message from the messages array
    const originalMessage = messages.find((msg) => msg.id === replyToId);
    if (!originalMessage) {
      console.error('[ChatPage] Original message not found:', replyToId);
      // Clear the reply state since the message is no longer available
      clearReplyToMessage();
      toast.error('원본 메시지를 찾을 수 없습니다');
      throw new Error('Original message not found');
    }

    try {
      const encrypted = false;

      // Create the reply message with replyTo information
      const replyToInfo = toReplyToInfo(originalMessage);

      console.log('[ChatPage] Sending reply with replyTo:', replyToInfo);

      // Send reply with proper replyTo mapping
      // Note: API expects messageId, but internal type uses id
      const response = await apiClient.sendMessage({
        familyId,
        senderId: myMemberId,
        senderName: myName,
        content,
        encrypted,
        replyTo: {
          messageId: replyToInfo.id,
          senderId: replyToInfo.senderId,
          senderName: replyToInfo.senderName,
          content: replyToInfo.content,
        },
      });

      console.log('[ChatPage] Reply sent successfully:', response);

      // 로컬 메시지 추가 with replyTo
      addMessage({
        id: response.messageId,
        senderId: myMemberId,
        senderName: myName,
        content,
        timestamp: Date.now(),
        encrypted,
        status: 'sent',
        replyTo: toReplyToInfo(originalMessage),
      });

      // Clear the reply state
      clearReplyToMessage();
    } catch (error) {
      console.error('[ChatPage] Failed to send reply:', error);
      toast.error('답장 전송 실패');
      throw error;
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const scrollToMessage = (messageId: string) => {
    // Debouncing: Prevent rapid clicks (300ms debounce)
    const now = Date.now();
    if (now - lastScrollTimeRef.current < 300) {
      return;
    }
    lastScrollTimeRef.current = now;

    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Scroll with appropriate behavior based on user preferences
      messageElement.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'center',
      });

      // Add highlight effect (respect reduced motion preference)
      if (!prefersReducedMotion) {
        messageElement.classList.add('highlight-pulse');
      } else {
        // For reduced motion, just add a temporary highlight class
        messageElement.classList.add('highlight-static');
      }

      // Find focusable element within the message for accessibility
      const focusableElement = messageElement.querySelector('[tabindex="0"]') as HTMLElement;
      if (focusableElement) {
        focusableElement.focus({ preventScroll: true });
      }

      // Clean up existing timeout if any
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Remove highlight class after animation completes
      scrollTimeoutRef.current = setTimeout(() => {
        messageElement.classList.remove('highlight-pulse', 'highlight-static');
        scrollTimeoutRef.current = null;
      }, prefersReducedMotion ? 1000 : 1500);
    } else {
      toast.error('원본 메시지를 찾을 수 없습니다');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">가족 메신저</h1>
            <p className="text-sm text-gray-500">E2E 암호화됨</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            나가기
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-gray-600">첫 메시지를 보내보세요!</p>
              <p className="text-sm text-gray-500 mt-2">
                모든 메시지는 End-to-End 암호화됩니다
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isMine={message.senderId === myMemberId}
                onReplyClick={handleReplyClick}
                onScrollToOriginal={scrollToMessage}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto p-4">
          <MessageInput onSend={handleSendMessage} />
        </div>
      </footer>

      {/* Reply Modal */}
      {replyToMessage && (
        <ReplyModal
          isOpen={isReplyModalOpen}
          onClose={clearReplyToMessage}
          originalMessage={toReplyToInfo(replyToMessage)}
          onSendReply={handleSendReply}
        />
      )}

      <Toaster />
    </div>
  );
}
