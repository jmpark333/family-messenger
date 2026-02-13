'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { useChatStore } from '@/stores/chat-store';
import { getP2PManager } from '@/lib/webrtc/peer';

interface PeerConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  myPeerId: string;
  onConnect: (peerId: string) => Promise<void>;
}

export default function PeerConnectionModal({ isOpen, onClose, myPeerId, onConnect }: PeerConnectionModalProps) {
  const [peerIdInput, setPeerIdInput] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setPeerIdInput('');
    setError('');
    setIsConnecting(false);
  };

  const handleTestConnection = async () => {
    const testPeerId = peerIdInput.trim();
    if (!testPeerId) {
      setError('Peer ID를 입력하세요');
      return;
    }

    if (testPeerId === myPeerId) {
      setError('자기 자신에게는 테스트할 수 없습니다');
      return;
    }

    setIsTesting(true);
    setError('');

    try {
      const p2pManager = getP2PManager();
      if (!p2pManager) {
        throw new Error('P2P 관리자가 초기화되지 않았습니다');
      }

      // 연결 가능성 테스트 - peer.connect()로 직접 시도
      // 성공하면 연결 가능, 실패하면 peer-unavailable 에러
      await p2pManager.connectToPeer(testPeerId);
      setError('테스트 성공! 연결이 가능합니다. 연결을 누르세요.');
      setTimeout(() => setIsTesting(false), 2000);
    } catch (err) {
      setError((err as Error).message || '테스트 실패: 상대방을 확인할 수 없습니다');
      setIsTesting(false);
    }
  };

  const handleConnect = async () => {
    const connectPeerId = peerIdInput.trim();
    if (!connectPeerId) {
      setError('Peer ID를 입력하세요');
      return;
    }

    if (connectPeerId === myPeerId) {
      setError('자기 자신에게는 연결할 수 없습니다');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      await onConnect(connectPeerId);
      onClose();
      resetForm();
    } catch (err) {
      setError((err as Error).message || '연결에 실패했습니다');
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 콘텐츠 */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            가족원 연결
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              상대방 Peer ID 입력
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              다른 기기에서 로그인한 후, 여기에 상대방의 Peer ID를 입력하세요
            </p>

            {/* 입력 필드 */}
            <div>
              <label
                htmlFor="peerIdInput"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Peer ID
              </label>
              <input
                id="peerIdInput"
                type="text"
                value={peerIdInput}
                onChange={(e) => setPeerIdInput(e.target.value)}
                placeholder="상대방 Peer ID를 입력하세요"
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:outline-none focus:bg-white dark:focus:bg-gray-600 transition-colors text-gray-900 dark:text-white"
                disabled={isConnecting}
                autoFocus
              />
            </div>

            {/* 에러 표시 */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* 연결 테스트 버튼 */}
            <button
              onClick={handleTestConnection}
              disabled={!peerIdInput.trim() || isConnecting || isTesting}
              className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mb-2"
            >
              {isTesting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>테스트 중...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>연결 테스트</span>
                </>
              )}
            </button>

            {/* 연결 버튼 */}
            <button
              onClick={handleConnect}
              disabled={!peerIdInput.trim() || isConnecting}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isConnecting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>연결 중...</span>
                </>
              ) : (
                <>
                  <span>🔗</span>
                  <span>연결하기</span>
                </>
              )}
            </button>
          </div>

          {/* 안내 */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              연결 방법
            </h4>
            <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
              <li>두 기기에서 앱을 실행하세요</li>
              <li>상대방 기기의 Peer ID를 확인하세요</li>
              <li>여기에 상대방 Peer ID를 입력하고 연결을 누르세요</li>
            </ol>

            {/* 연결 문제 해결 팁 */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span>⚠️</span>
                <span>연결이 안될 때</span>
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                <li>같은 WiFi 네트워크 사용 확인 (두 기기가 같은 공유기 권장)</li>
                <li>방화벽/보안 소프트웨어에서 WebRTC(P2P) 허용</li>
                <li>브라우저 시크릿 모드 아닌 일반 모드 사용</li>
                <li>두 기기 모두 최신 버전 앱 사용 확인</li>
                <li>페이지 새로고침 (Ctrl+Shift+R)</li>
              </ul>
            </div>
          </div>

          {/* 내 코드 탭 - 하단에 표시 */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                내 Peer ID
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                상대방에게 이 코드를 보여주세요
              </p>

              {/* QR 코드 */}
              <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300 inline-block">
                <QRCode
                  value={JSON.stringify({ pid: myPeerId, v: 1 })}
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </div>

              {/* 텍스트 복사 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Peer ID (복사해서 공유)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={myPeerId}
                    readOnly
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white text-sm font-mono"
                  />
                  <button
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        navigator.clipboard.writeText(myPeerId);
                      }
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    복사
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
