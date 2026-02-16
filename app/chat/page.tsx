
'use client';

import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../../stores/chat-store';
import { useToast } from '../../lib/hooks/useToast';
import ChatMessage from '../../components/chat/ChatMessage';
import MessageInput from '../../components/chat/MessageInput';
import Toaster from '../../components/shared/Toaster';
import SecurityIndicator from '../../components/security/SecurityIndicator';
import PeerConnection from '../../components/p2p/PeerConnection';
import { useRouter } from 'next/navigation';
import { initP2PManager, getP2PManager } from '../../lib/webrtc/peer';
import { initMessageQueue, getMessageQueue } from '../../lib/offline/message-queue';
import { initPeerDiscovery, destroyPeerDiscovery } from '../../lib/firebase/peer-discovery';
import type { DataMessage, PeerInfo, DiscoveredPeer } from '../../types';

export default function ChatPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isP2PInitialized, setIsP2PInitialized] = useState(false);
  const [isPeerDiscoveryInitialized, setIsPeerDiscoveryInitialized] = useState(false);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [peerIdInput, setPeerIdInput] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const myPeerIdRef = useRef<string>('');
  const {
    isAuthenticated,
    familyKey,
    authCredentials,
    messages,
    typingUserList,
    loadMessages,
    myPeerId,
    addMessage,
    addPeer,
    additionalPin,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // myPeerId를 ref에 저장 (빈 문자열도 저장하여 echo 방지)
  useEffect(() => {
    myPeerIdRef.current = myPeerId;
  }, [myPeerId]);

  // additionalPin이 설정되지 않은 경우 IndexedDB에서 로드 또는 자동 생성
  useEffect(() => {
    const { additionalPin, authCredentials, myPeerId } = useChatStore.getState();
    
    if (!additionalPin) {
      // IndexedDB에서 family 정보 로드 시도
      const loadFamilyAndSetPin = async () => {
        try {
          const isAvailable = await isDatabaseAvailable();
          if (isAvailable) {
            const family = await dbHelpers.getFamily();
            if (family?.additionalPin) {
              console.log('[ChatPage] Loading additionalPin from IndexedDB:', family.additionalPin);
              useChatStore.getState().setAuthCredentials({
                id: authCredentials?.id || family.myMemberId,
                password: authCredentials?.password || '',
                additionalPin: family.additionalPin,
              });
            } else {
              // IndexedDB에 없는 경우 자동으로 생성
              const newPin = crypto.randomUUID().slice(0, 16);
              console.log('[ChatPage] Auto-generating additionalPin:', newPin);
              useChatStore.getState().setAuthCredentials({
                id: authCredentials?.id || myPeerId,
                password: authCredentials?.password || '',
                additionalPin: newPin,
              });
              
              // IndexedDB에 저장 (기존 family 정보가 있으면 업데이트)
              if (family) {
                await dbHelpers.saveFamily({
                  ...family,
                  additionalPin: newPin,
                });
              }
            }
          }
        } catch (error) {
          console.error('[ChatPage] Failed to load additionalPin from IndexedDB:', error);
          // 에러 발생 시 자동으로 생성
          const newPin = crypto.randomUUID().slice(0, 16);
          console.log('[ChatPage] Auto-generating additionalPin (fallback):', newPin);
          useChatStore.getState().setAuthCredentials({
            id: authCredentials?.id || myPeerId,
            password: authCredentials?.password || '',
            additionalPin: newPin,
          });
        }
      };
      
      loadFamilyAndSetPin();
    }
  }, []);

  // P2PManager 초기화
  useEffect(() => {
    if (!isAuthenticated || isP2PInitialized) return;

    // PIN이 로드되지 않은 경우 대기
    if (!additionalPin) {
      console.log('[ChatPage] Waiting for additionalPin to be loaded...');
      return;
    }

    console.log('[ChatPage] Initializing P2P Manager...');

    // P2P 이벤트 핸들러 설정
    const p2pEvents = {
      onPeerConnected: (peer: PeerInfo) => {
        console.log('[ChatPage] Peer connected:', peer.id);
        toast.success(`연결됨: ${peer.name || peer.id.slice(0, 8)}`);
      },
      onPeerDisconnected: (peerId: string) => {
        console.log('[ChatPage] Peer disconnected:', peerId);
        toast.info('연결 종료됨');
      },
      onMessage: (message: DataMessage) => {
        console.log('[ChatPage] Received message:', message, 'myPeerId:', myPeerId);

        // 내 자신이 보낸 메시지는 중복 추가하지 않음 (store의 myPeerId 직접 사용)
        if (message.senderId === myPeerId) {
          console.log('[ChatPage] Ignoring own message (echo)');
          return;
        }

        // 다른 사용자의 메시지를 채팅 목록에 추가
        if (message.type === 'text' || message.type === 'encrypted') {
          // 메시지 내용 추출 (파일인 경우 포맷)
          let content: string;
          if (typeof message.data === 'string') {
            content = message.data;
          } else if (message.data && typeof message.data === 'object' && 'type' in message.data && message.data.type === 'file') {
            content = `[파일] ${message.data.fileName || '알 수 없는 파일'}`;
          } else {
            content = JSON.stringify(message.data);
          }

          const chatMessage = {
            id: message.id,
            senderId: message.senderId,
            content,
            timestamp: message.timestamp,
            status: 'delivered' as const,
            encrypted: message.encrypted ?? false,
          };

          // IndexedDB에 저장 (UI에도 자동 추가됨)
          useChatStore.getState().saveMessage(chatMessage);
        }
      },
      onError: (error: Error) => {
        console.error('[ChatPage] P2P Error:', error);
        toast.error(`연결 오류: ${error.message}`);
      },
    };

    // P2PManager 초기화
    const p2pManager = initP2PManager({ debug: true }, p2pEvents);
    if (!p2pManager) {
      console.warn('[ChatPage] P2PManager initialization deferred (PIN not ready)');
      return; // Effect will re-run when additionalPin changes
    }

    // MessageQueue 초기화 (오프라인 지원)
    initMessageQueue(
      {
        maxRetries: 5,
        retryDelay: 1000,
      },
      {
        onMessageSent: (messageId) => {
          console.log('[ChatPage] Message sent:', messageId);
          useChatStore.getState().updateMessageStatus(messageId, 'sent');
        },
        onMessageFailed: (messageId, error) => {
          console.error('[ChatPage] Message failed:', messageId, error);
          useChatStore.getState().updateMessageStatus(messageId, 'sent'); // 실패해도 sent로 표시
          toast.error('메시지 전송 실패');
        },
      }
    );

    setIsP2PInitialized(true);
    console.log('[ChatPage] P2P Manager initialized');
  }, [isAuthenticated, isP2PInitialized, addMessage, toast, additionalPin]);

  // Debug logging
  useEffect(() => {
    console.log('[ChatPage] Rendered - isAuthenticated:', isAuthenticated);
    console.log('[ChatPage] Messages count:', messages.length);
    console.log('[ChatPage] myPeerId:', myPeerId);
    console.log('[ChatPage] P2P Initialized:', isP2PInitialized);
  }, [isAuthenticated, messages.length, myPeerId, isP2PInitialized]);

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
      console.log('[ChatPage] Loading messages from IndexedDB...');
      loadMessages();
    }
  }, [isAuthenticated, loadMessages]);

  // Firebase Peer Discovery 초기화
  useEffect(() => {
    if (!isAuthenticated || !isP2PInitialized || !familyKey || !authCredentials || isPeerDiscoveryInitialized) {
      return;
    }

    const initDiscovery = async () => {
      try {
        // Wait for peer ID to be available
        const waitForPeerId = () => {
          return new Promise<string>((resolve) => {
            const checkPeerId = () => {
              const peerId = useChatStore.getState().myPeerId;
              if (peerId) {
                resolve(peerId);
              } else {
                setTimeout(checkPeerId, 100);
              }
            };
            checkPeerId();
          });
        };

        const peerId = await waitForPeerId();
        console.log('[ChatPage] Initializing peer discovery with peer ID:', peerId);

        const discovery = initPeerDiscovery(
          {
            familyId: familyKey.keyId,
            userId: authCredentials.id,
            userName: authCredentials.id, // Use ID as name for now
            peerId: peerId,
            autoConnect: true,
          },
          {
            onPeerDiscovered: (peer: DiscoveredPeer) => {
              console.log('[ChatPage] Peer discovered:', peer);
              toast.info(`발견된 피어: ${peer.userName || peer.userId.slice(0, 8)}`);
            },
            onPeerOnline: (userId: string, peerId: string) => {
              console.log('[ChatPage] Peer online:', userId, peerId);
              const p2pManager = getP2PManager();
              if (p2pManager) {
                p2pManager.connectToPeer(peerId)
                  .then(() => {
                    console.log('[ChatPage] Auto-connected to peer:', peerId);
                    toast.success(`자동 연결됨: ${userId.slice(0, 8)}`);
                  })
                  .catch((error) => {
                    console.error('[ChatPage] Auto-connection failed:', error);
                    toast.error(`자동 연결 실패: ${userId.slice(0, 8)}`);
                  });
              }
            },
            onPeerOffline: (userId: string) => {
              console.log('[ChatPage] Peer offline:', userId);
              toast.info(`${userId.slice(0, 8)}님 오프라인`);
            },
            onPeerLeft: (userId: string) => {
              console.log('[ChatPage] Peer left:', userId);
              toast.info(`${userId.slice(0, 8)}님 떠남`);
            },
            onError: (error: Error) => {
              console.error('[ChatPage] Peer discovery error:', error);
              toast.error(`피어 발견 오류: ${error.message}`);
            },
          }
        );

        await discovery.start();
        setIsPeerDiscoveryInitialized(true);
        useChatStore.getState().setPeerDiscoveryEnabled(true);
        console.log('[ChatPage] Peer discovery initialized');
      } catch (error) {
        console.error('[ChatPage] Failed to initialize peer discovery:', error);
        toast.error('피어 발견 서비스 초기화 실패');
      }
    };

    initDiscovery();

    // Cleanup on unmount
    return () => {
      destroyPeerDiscovery();
      setIsPeerDiscoveryInitialized(false);
      useChatStore.getState().setPeerDiscoveryEnabled(false);
    };
  }, [isAuthenticated, isP2PInitialized, familyKey, authCredentials, isPeerDiscoveryInitialized, toast]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle direct peer connection
  const handleConnect = async () => {
    if (!peerIdInput.trim()) {
      setConnectionError('Peer ID를 입력하세요');
      return;
    }

    if (peerIdInput === myPeerId) {
      setConnectionError('자기 자신에게는 연결할 수 없습니다');
      return;
    }

    setIsConnecting(true);
    setConnectionError('');

    try {
      const p2pManager = getP2PManager();
      if (!p2pManager) {
        throw new Error('P2P 매니저가 초기화되지 않았습니다.');
      }

      await p2pManager.connectToPeer(peerIdInput.trim());
      toast.success(`연결 성공: ${peerIdInput.slice(0, 8)}...`);
      setPeerIdInput('');
    } catch (error) {
      console.error('[ChatPage] Connection failed:', error);
      setConnectionError('연결 실패. Peer ID를 확인해주세요.');
      toast.error('연결 실패');
    } finally {
      setIsConnecting(false);
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
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">가족 메신저</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">내 ID:</span>
              <code className="px-2 py-1 bg-gray-100 rounded text-sm select-all cursor-pointer hover:bg-gray-200" onClick={() => myPeerId && navigator.clipboard.writeText(myPeerId)}>
                {myPeerId || '로딩 중...'}
              </code>
              <button
                onClick={() => myPeerId && navigator.clipboard.writeText(myPeerId)}
                className="p-1 hover:bg-gray-200 rounded"
                title="클립보드에 복사"
              >
                📋
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsConnectionModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <span>🔗</span>
              <span>연결</span>
            </button>
            <SecurityIndicator />
          </div>
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

      {/* Peer ID Input - Direct Connection */}
      {myPeerId && messages.length === 0 && (
        <div className="mx-auto max-w-4xl px-4 pb-4">
          <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🔗 가족원과 연결하기</h3>
            <p className="text-gray-600 mb-4">
              가족원에게 내 Peer ID를 공유하고, 상대방의 ID를 입력하세요.
            </p>
            
            {/* My Peer ID Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <label className="text-sm font-medium text-blue-900 mb-1 block">내 Peer ID</label>
                  <code className="px-3 py-2 bg-white rounded text-sm font-mono break-all select-all cursor-pointer hover:bg-blue-100" onClick={() => myPeerId && navigator.clipboard.writeText(myPeerId)}>
                    {myPeerId}
                  </code>
                </div>
                <button
                  onClick={() => myPeerId && navigator.clipboard.writeText(myPeerId)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex-shrink-0"
                  title="클립보드에 복사"
                >
                  📋 복사
                </button>
              </div>
            </div>

            {/* Peer ID Input */}
            <div className="space-y-3">
              <label htmlFor="peerIdInput" className="text-sm font-medium text-gray-700 block">
                가족원의 Peer ID 입력
              </label>
              <div className="flex gap-2">
                <input
                  id="peerIdInput"
                  type="text"
                  value={peerIdInput}
                  onChange={(e) => {
                    setPeerIdInput(e.target.value);
                    setConnectionError('');
                  }}
                  placeholder="가족원의 Peer ID를 입력하세요"
                  className="flex-1 px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:bg-white transition-colors text-gray-900"
                  disabled={isConnecting}
                />
                <button
                  onClick={handleConnect}
                  disabled={!peerIdInput.trim() || isConnecting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>연결 중...</span>
                    </>
                  ) : (
                    <>
                      <span>🔗</span>
                      <span>연결</span>
                    </>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {connectionError && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                  ⚠️ {connectionError}
                </div>
              )}

              {/* Instructions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">연결 방법</h4>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>가족원에게 내 Peer ID를 공유하세요</li>
                  <li>가족원의 Peer ID를 위 입력창에 붙여넣으세요</li>
                  <li>"연결" 버튼을 누르세요</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Input */}
      <footer className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <MessageInput />
        </div>
      </footer>

      {/* Toaster */}
      <Toaster />

      {/* Peer Connection Modal */}
      <PeerConnection
        isOpen={isConnectionModalOpen}
        onClose={() => setIsConnectionModalOpen(false)}
        myPeerId={myPeerId}
        onConnect={async (peerId: string) => {
          const p2pManager = getP2PManager();
          if (p2pManager) {
            try {
              await p2pManager.connectToPeer(peerId);
              toast.success(`연결 성공: ${peerId.slice(0, 8)}...`);
              setIsConnectionModalOpen(false);
            } catch (error) {
              console.error('[ChatPage] Connection failed:', error);
              toast.error('연결 실패. Peer ID를 확인해주세요.');
            }
          } else {
            toast.error('P2P 매니저가 초기화되지 않았습니다.');
          }
        }}
      />
    </div>
  );
}
