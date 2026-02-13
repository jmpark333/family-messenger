'use client';

import { useState } from 'react';

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
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setError('');
    setLoading(false);
    setSuccess(false);
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess(false);

    // 입력 검증
    if (!currentPin || !newPin || !confirmPin) {
      setError('모든 필드를 입력해주세요');
      return;
    }

    if (newPin.length !== 6 || !/^\d{6}$/.test(newPin)) {
      setError('새 PIN은 6자리 숫자여야 합니다');
      return;
    }

    if (newPin !== confirmPin) {
      setError('새 PIN이 일치하지 않습니다');
      return;
    }

    if (currentPin === newPin) {
      setError('현재 PIN과 다른 PIN을 입력해주세요');
      return;
    }

    setLoading(true);

    try {
      await onChangePin(newPin);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1500);
    } catch (err) {
      setError((err as Error).message || 'PIN 변경에 실패했습니다');
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
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            PIN 변경
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
          {success ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <p className="text-lg font-medium text-green-600 dark:text-green-400">
                PIN이 변경되었습니다
              </p>
            </div>
          ) : (
            <>
              {/* 현재 PIN */}
              <div>
                <label
                  htmlFor="currentPin"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  현재 PIN
                </label>
                <input
                  id="currentPin"
                  type="password"
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:outline-none focus:bg-white dark:focus:bg-gray-600 transition-colors text-gray-900 dark:text-white text-center text-2xl tracking-widest"
                  placeholder="••••••"
                  maxLength={6}
                  disabled={loading}
                />
              </div>

              {/* 새 PIN */}
              <div>
                <label
                  htmlFor="newPin"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  새 PIN (6자리 숫자)
                </label>
                <input
                  id="newPin"
                  type="password"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:outline-none focus:bg-white dark:focus:bg-gray-600 transition-colors text-gray-900 dark:text-white text-center text-2xl tracking-widest"
                  placeholder="••••••"
                  maxLength={6}
                  disabled={loading}
                />
              </div>

              {/* 새 PIN 확인 */}
              <div>
                <label
                  htmlFor="confirmPin"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  새 PIN 확인
                </label>
                <input
                  id="confirmPin"
                  type="password"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:outline-none focus:bg-white dark:focus:bg-gray-600 transition-colors text-gray-900 dark:text-white text-center text-2xl tracking-widest"
                  placeholder="••••••"
                  maxLength={6}
                  disabled={loading}
                />
              </div>

              {/* 에러 표시 */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                  ⚠️ {error}
                </div>
              )}

              {/* 버튼 */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !currentPin || !newPin || !confirmPin}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
