'use client';

import { useState, useRef, useEffect } from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { useChatStore } from '@/stores/chat-store';

interface PeerConnectionProps {
  isOpen: boolean;
  onClose: () => void;
  myPeerId: string;
  onConnect: (peerId: string) => Promise<void>;
}

export default function PeerConnection({ isOpen, onClose, myPeerId, onConnect }: PeerConnectionProps) {
  const [tab, setTab] = useState<'my-code' | 'scan-code'>('my-code');
  const [peerIdInput, setPeerIdInput] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setPeerIdInput('');
    setError('');
    setIsConnecting(false);
  };

  const handleConnect = async () => {
    if (!peerIdInput.trim()) {
      setError('Peer ID를 입력하세요');
      return;
    }

    if (peerIdInput === myPeerId) {
      setError('자기 자신에게는 연결할 수 없습니다');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      await onConnect(peerIdInput.trim());
      onClose();
      resetForm();
    } catch (err) {
      setError((err as Error).message || '연결에 실패했습니다');
    } finally {
      setIsConnecting(false);
    }
  };

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
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

        {/* 탭 */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              setTab('my-code');
              resetForm();
            }}
            className={`flex-1 py-4 font-medium transition-colors ${
              tab === 'my-code'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            내 코드
          </button>
          <button
            onClick={() => {
              setTab('scan-code');
              resetForm();
            }}
            className={`flex-1 py-4 font-medium transition-colors ${
              tab === 'scan-code'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            코드 입력
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6">
          {/* 내 코드 탭 */}
          {tab === 'my-code' && (
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  내 Peer ID
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  이 QR 코드를 가족원에게 보여주세요
                </p>
              </div>

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
                    onClick={() => navigator.clipboard.writeText(myPeerId)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    복사
                  </button>
                </div>
              </div>

              {/* 안내 */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-left">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  💡 <strong>팁:</strong> 가족원이 이 QR 코드를 스캔하거나 Peer ID를 입력하면 연결됩니다.
                </p>
              </div>
            </div>
          )}

          {/* 코드 입력 탭 */}
          {tab === 'scan-code' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  가족원 Peer ID 입력
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  가족원에게 받은 Peer ID를 입력하세요
                </p>
              </div>

              {/* 입력 필드 */}
              <div className="space-y-4">
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
                    placeholder="가족원의 Peer ID를 입력하세요"
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
                  <li>가족원에게 Peer ID를 받으세요</li>
                  <li>위 입력창에 Peer ID를 붙여넣으세요</li>
                  <li>"연결하기" 버튼을 누르세요</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
