'use client';

import { useState } from 'react';
import { useChatStore } from '@/stores/chat-store';

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangePin: (newPin: string) => Promise<void>;
}

export default function ChangePinModal({ isOpen, onClose, onChangePin }: ChangePinModalProps) {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePin = async () => {
    setError('');
    setLoading(true);

    try {
      const currentAdditionalPin = useChatStore.getState().additionalPin;

      // 현재 PIN 검증
      if (currentPin !== currentAdditionalPin) {
        setError('현재 PIN이 올바르지 않습니다');
        return;
      }

      if (newPin !== confirmPin) {
        setError('새 PIN이 일치하지 않습니다');
        return;
      }

      if (newPin.length < 6) {
        setError('PIN은 최소 6자리여야 합니다');
        return;
      }

      await onChangePin(newPin);
      onClose();
    } catch {
      setError('PIN 변경 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

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
            추가비번 변경
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
        <div className="p-6 space-y-4">
          {/* 현재 PIN */}
          <div>
            <label
              htmlFor="currentPin"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              현재 추가비번
            </label>
            <input
              id="currentPin"
              type="password"
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:outline-none focus:bg-white dark:focus:bg-gray-600 transition-colors text-gray-900 dark:text-white"
              placeholder="현재 추가비번 입력"
              autoFocus
            />
          </div>

          {/* 새 PIN */}
          <div>
            <label
              htmlFor="newPin"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              새 추가비번 (6자리 이상)
            </label>
            <input
              id="newPin"
              type="password"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:outline-none focus:bg-white dark:focus:bg-gray-600 transition-colors text-gray-900 dark:text-white"
              placeholder="새 추가비번 입력"
            />
          </div>

          {/* PIN 확인 */}
          <div>
            <label
              htmlFor="confirmPin"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              새 추가비번 확인
            </label>
            <input
              id="confirmPin"
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:outline-none focus:bg-white dark:focus:bg-gray-600 transition-colors text-gray-900 dark:text-white"
              placeholder="새 추가비번 다시 입력"
            />
          </div>

          {/* 에러 표시 */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* 변경 버튼 */}
          <button
            onClick={handleChangePin}
            disabled={loading || !currentPin || !newPin || !confirmPin}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>변경 중...</span>
              </>
            ) : (
              <>
                <span>🔐</span>
                <span>변경하기</span>
              </>
            )}
          </button>

          {/* 안내 */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              💡 <strong>참고:</strong> PIN을 변경하면 모든 가족원에게 새 PIN이 알려집니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
