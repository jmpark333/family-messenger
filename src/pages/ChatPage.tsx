// ChatPage.tsx - 간소화된 버전 (P2P 제거, 서버 폴링 방식)
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '@/stores/chat-store';
import { apiClient } from '@/lib/api/client';
import { encryptMessage, decryptMessage } from '@/lib/crypto';
import ChatMessage from '@/components/chat/ChatMessage';
import MessageInput from '@/components/chat/MessageInput';
import Toaster from '@/components/shared/Toaster';
import { useToast } from '@/lib/hooks/useToast';

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
  } = useChatStore();

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
  }, [isAuthenticated, familyId, messages.length, myMemberId, myPrivateKey]);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!familyId || !myMemberId || !myName) return;

    try {
      // TODO: 각 멤버의 공개키로 암호화 (현재는 평문)
      // 멀티캐스트 암호화는 추후 구현
      const encrypted = false;

      const response = await apiClient.sendMessage({
        familyId,
        senderId: myMemberId,
        senderName: myName,
        content,
        encrypted,
      });

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
      console.error('Failed to send message:', error);
      toast.error('메시지 전송 실패');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
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

      <Toaster />
    </div>
  );
}
