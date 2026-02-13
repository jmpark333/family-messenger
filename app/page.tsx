'use client';

import { useEffect, useState } from 'react';
import { useChatStore, selectOnlineUsers, selectTypingUsers } from '@/stores/chat-store';
import { initFirebaseManager, destroyFirebaseManager, getFirebaseManager } from '@/lib/firebase/firebase-manager';
import type { DataMessage } from '@/types';
import ChatMessage from '@/components/chat/ChatMessage';
import MessageInput from '@/components/chat/MessageInput';
import { verifyCredentials, verifyAdditionalPin } from '@/lib/auth';
import { authSessionManager } from '@/lib/auth/session';

export default function HomePage() {
  const store = useChatStore();

  const {
    isAuthenticated,
    myUserId,
    familyId,
    isFirebaseConnected,
    messages,
    authCredentials,
  } = store;

  const onlineUsers = useChatStore(selectOnlineUsers);
  const typingUsers = useChatStore(selectTypingUsers);

  // 로컬에서 전송한 메시지 ID 추적 (중복 방지)
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  // Firebase 관리자 초기화
  useEffect(() => {
    const firebaseManager = initFirebaseManager(
      {
        onMessage: (message) => {
          console.log('[Page] Firebase message received:', message);
          if (message.type === 'text') {
            // 내가 보낸 메시지는 무시 (로컬에서 이미 표시됨)
            if (message.senderId !== myUserId) {
              // 중복 방지: sentIds에 있으면 무시
              if (!sentIds.has(message.id)) {
                useChatStore.getState().addMessage({
                  id: message.id,
                  senderId: message.senderId,
                  content: message.data,
                  timestamp: message.timestamp,
                  status: 'delivered',
                  encrypted: message.encrypted || false,
                });
              }
            }
          }
        },
        onPresenceChange: (userId, online) => {
          console.log('[Page] Presence change:', userId, online);
          const store = useChatStore.getState();
          if (online) {
            store.addUser({
              id: userId,
              name: '',
              publicKey: new Uint8Array(0),
              fingerprint: '',
              connected: true,
              lastSeen: Date.now(),
            });
          } else {
            store.updateUser(userId, { connected: false });
          }
        },
        onTypingChange: (userId, isTyping) => {
          console.log('[Page] Typing change:', userId, isTyping);
          useChatStore.getState().setTyping(userId, isTyping);
        },
        onError: (error) => console.error('Firebase error:', error),
      }
    );

    return () => { destroyFirebaseManager(); };
  }, []);

  // 로그인 후 Firebase 가족 참여
  useEffect(() => {
    if (isAuthenticated && authCredentials?.id && myUserId) {
      const firebaseManager = getFirebaseManager();
      if (firebaseManager) {
        console.log('[Page] Joining Firebase family:', authCredentials.id);
        firebaseManager.joinFamily(authCredentials.id, myUserId, '나');
        useChatStore.getState().setFirebaseConnected(true);
      }
    }
  }, [isAuthenticated, authCredentials, myUserId]);

  // 초기 설정이 안 된 경우
  if (!isAuthenticated) {
    return <InitialSetup />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">👨‍👩‍👧‍👦</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">가족 메신저</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Firebase 실시간 메신저</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-3 py-2 text-sm rounded-lg ${isFirebaseConnected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
              {isFirebaseConnected ? '🟢 온라인' : '⚫ 오프라인'}
            </div>
            <button
              onClick={() => {
                const firebaseManager = getFirebaseManager();
                if (firebaseManager && confirm('모든 대화 내용을 삭제하시겠습니까?')) {
                  firebaseManager.clearMessages();
                  useChatStore.getState().clearMessages();
                  setSentIds(new Set());
                }
              }}
              className="px-3 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              🗑️ 지우기
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 pb-32">
        <ConnectionStatus isConnected={isFirebaseConnected} onlineCount={onlineUsers.length} />

        <div className="message-list overflow-y-auto space-y-4" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">아직 메시지가 없습니다</h2>
              <p className="text-gray-500 dark:text-gray-400">가족원에게 첫 메시지를 보내보세요!</p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} isMine={message.senderId === myUserId} />
            ))
          )}
          {typingUsers.length > 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
              {typingUsers.join(', ')} 님이 입력 중...
            </div>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto p-4"><MessageInput /></div>
      </footer>
    </div>
  );
}

interface InitialSetupProps {
  onSetupComplete?: () => void;
}

function InitialSetup({ onSetupComplete }: InitialSetupProps) {
  const [credentials, setCredentials] = useState({
    id: '',
    password: '',
    additionalPin: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // 1. ID/Password 검증
      const isValid = await verifyCredentials(credentials.id, credentials.password);

      if (!isValid) {
        setError('잘못된 ID 또는 비밀번호입니다');
        setLoading(false);
        return;
      }

      // 2. 추가비번 검증
      const isPinValid = await verifyAdditionalPin(credentials.additionalPin);

      if (!isPinValid) {
        setError('잘못된 추가비번입니다');
        setLoading(false);
        return;
      }

      // 3. 세션 생성
      const session = await authSessionManager.createSession(credentials);

      // 4. 상태 저장
      useChatStore.getState().setAuthCredentials(credentials);
      useChatStore.getState().setMyInfo(credentials.id, '나');
      useChatStore.getState().setAuthenticated(true, credentials.id);

      onSetupComplete?.();
    } catch {
      setError('로그인 중 오류가 발생했습니다');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center space-y-6 mb-8">
          <div className="text-6xl">🏠</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">가족 메신저</h1>
          <p className="text-gray-600 dark:text-gray-400">어디서든 가족과 대화하세요</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              가족 ID
            </label>
            <input
              type="text"
              value={credentials.id}
              onChange={(e) => setCredentials({...credentials, id: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="가족 ID 입력"
              autoFocus
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="비밀번호 입력"
              autoComplete="current-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              추가비번 (6자리)
            </label>
            <input
              type="password"
              value={credentials.additionalPin}
              onChange={(e) => setCredentials({...credentials, additionalPin: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="추가비번 입력"
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !credentials.id || !credentials.password || !credentials.additionalPin}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>🔥 Firebase 실시간 동기화</p>
          <p>🌍 어디서든 접속 가능</p>
          <p>👨‍👩‍👧‍👦 같은 가족 ID로 자동 연결</p>
        </div>
      </div>
    </div>
  );
}

interface ConnectionStatusProps {
  isConnected: boolean;
  onlineCount: number;
}

function ConnectionStatus({ isConnected, onlineCount }: ConnectionStatusProps) {
  const config = isConnected
    ? { color: 'bg-green-500', text: '연결됨' }
    : { color: 'bg-red-500', text: '연결 안됨' };

  return (
    <div className="mb-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${config.color} ${isConnected ? 'animate-pulse' : ''}`} />
          <span className="font-medium text-gray-900 dark:text-white">{config.text}</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {onlineCount > 0 ? `온라인 ${onlineCount}명` : '가족원을 기다리는 중...'}
        </div>
      </div>
    </div>
  );
}
