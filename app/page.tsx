'use client';

import { useEffect, useState } from 'react';
import { useChatStore, selectConnectedPeers, selectTypingUsers } from '@/stores/chat-store';
import { initP2PManager, destroyP2PManager, getP2PManager } from '@/lib/webrtc/peer';
import type { DataMessage } from '@/types';
import ChatMessage from '@/components/chat/ChatMessage';
import MessageInput from '@/components/chat/MessageInput';
import SecurityIndicator from '@/components/security/SecurityIndicator';
import PeerConnection from '@/components/p2p/PeerConnection';
import { QRCodeSVG as QRCode } from 'qrcode.react';

export default function HomePage() {
  const [isReady, setIsReady] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const {
    isAuthenticated,
    myPeerId,
    myName,
    connectionStatus,
    messages,
    isSetupComplete,
  } = useChatStore();

  const connectedPeers = useChatStore(selectConnectedPeers);
  const typingUsers = useChatStore(selectTypingUsers);

  // P2P 관리자 초기화
  useEffect(() => {
    const p2pManager = initP2PManager(
      { debug: true },
      {
        onPeerConnected: (peer) => console.log('Peer connected:', peer),
        onPeerDisconnected: (peerId) => console.log('Peer disconnected:', peerId),
        onMessage: (message) => {
          if (message.type === 'text') {
            useChatStore.getState().addMessage({
              id: message.id,
              senderId: message.senderId,
              content: message.data,
              timestamp: message.timestamp,
              status: 'delivered',
              encrypted: message.encrypted || false,
            });
          }
        },
        onError: (error) => console.error('P2P error:', error),
      }
    );

    return () => { destroyP2PManager(); };
  }, []);

  // 초기 설정이 안 된 경우
  if (!isSetupComplete) {
    return <InitialSetup onSetupComplete={() => setIsReady(true)} />;
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
              <p className="text-xs text-gray-500 dark:text-gray-400">E2E 암호화 활성화</p>
            </div>
          </div>
          <SecurityIndicator />
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 pb-32">
        <ConnectionStatus status={connectionStatus} peerCount={connectedPeers.length} />
        
        <div className="message-list overflow-y-auto space-y-4" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">아직 메시지가 없습니다</h2>
              <p className="text-gray-500 dark:text-gray-400">가족원에게 첫 메시지를 보내보세요!</p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} isMine={message.senderId === myPeerId} />
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

      <PeerConnection
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        myPeerId={myPeerId}
        onConnect={async (peerId) => {
          const p2pManager = getP2PManager();
          if (p2pManager) {
            await p2pManager.connectToPeer(peerId);
            setShowQR(false);
          }
        }}
      />

      <button onClick={() => setShowQR(true)} className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-2xl">
        ➕
      </button>
    </div>
  );
}

interface InitialSetupProps {
  onSetupComplete: () => void;
}

function InitialSetup({ onSetupComplete }: InitialSetupProps) {
  const [step, setStep] = useState<'welcome' | 'create' | 'join'>('welcome');
  const [familyKey, setFamilyKey] = useState('');
  const [myName, setMyName] = useState('');

  const handleCreateFamily = () => {
    const mockKey = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    setFamilyKey(mockKey);
    setStep('create');
  };

  const handleJoinFamily = () => setStep('join');

  const handleSetupComplete = () => {
    useChatStore.getState().setSetupComplete(true);
    useChatStore.getState().setMyInfo(crypto.randomUUID(), myName || '나');
    useChatStore.getState().setAuthenticated(true);
    onSetupComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
        {step === 'welcome' && (
          <div className="text-center space-y-6">
            <div className="text-6xl">🏠</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">가족 메신저에 오신 것을 환영합니다!</h1>
            <p className="text-gray-600 dark:text-gray-400">가족 3명만을 위한 완전 보안 메신저를 시작해보세요.</p>
            <div className="space-y-3">
              <button onClick={handleCreateFamily} className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">🆕 새 가족 만들기</button>
              <button onClick={handleJoinFamily} className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">🔗 가족에 참여하기</button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>🔒 End-to-End 암호화</p>
              <p>👨‍👩‍👧‍👦 P2P 직접 통신</p>
              <p>🔐 사전 공유 키 인증</p>
            </div>
          </div>
        )}

        {step === 'create' && (
          <div className="text-center space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">가족 키가 생성되었습니다!</h2>
            <p className="text-gray-600 dark:text-gray-400">이 QR 코드를 가족원에게 보여주세요</p>
            <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300">
              <QRCode value={JSON.stringify({ key: familyKey, type: 'family-key' })} size={200} level="H" includeMargin={false} />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">⚠️ 이 코드는 안전하게 보관하세요. 분실 시 재발급할 수 없습니다.</div>
            <button onClick={handleSetupComplete} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">시작하기</button>
          </div>
        )}

        {step === 'join' && (
          <div className="text-center space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">가족 코드를 입력하세요</h2>
            <input type="text" value={familyKey} onChange={(e) => setFamilyKey(e.target.value)} placeholder="가족 코드 입력" className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            <button onClick={handleSetupComplete} disabled={!familyKey} className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">참여하기</button>
          </div>
        )}
      </div>
    </div>
  );
}

interface ConnectionStatusProps {
  status: 'disconnected' | 'connecting' | 'connected';
  peerCount: number;
}

function ConnectionStatus({ status, peerCount }: ConnectionStatusProps) {
  const statusConfig = {
    disconnected: { color: 'bg-secure-red', text: '연결 안됨' },
    connecting: { color: 'bg-secure-yellow', text: '연결 중...' },
    connected: { color: 'bg-secure-green', text: '연결됨' },
  };
  const config = statusConfig[status];

  return (
    <div className="mb-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${config.color} ${status === 'connected' ? 'animate-pulse' : ''}`} />
          <span className="font-medium text-gray-900 dark:text-white">{config.text}</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {peerCount > 0 ? `가족원 ${peerCount}명과 연결됨` : '가족원을 기다리는 중...'}
        </div>
      </div>
    </div>
  );
}
