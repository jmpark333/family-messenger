// CreateFamilyForm.tsx - 간소화된 버전
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '@/stores/chat-store';
import { apiClient } from '@/lib/api/client';
import { generateKeyPair } from '@/lib/crypto';

export function CreateFamilyForm() {
  const navigate = useNavigate();
  const setAuthenticated = useChatStore((state) => state.setAuthenticated);
  const setFamilyId = useChatStore((state) => state.setFamilyId);
  const setMyInfo = useChatStore((state) => state.setMyInfo);
  const setKeys = useChatStore((state) => state.setKeys);
  const setAuthCode = useChatStore((state) => state.setAuthCode);

  const [name, setName] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('이름을 입력해주세요');
      return;
    }
    if (!authCode.trim() || authCode.length !== 4) {
      setError('4자리 인증코드를 입력해주세요');
      return;
    }

    setLoading(true);

    try {
      // 키 쌍 생성
      const keyPair = await generateKeyPair();

      // API 호출
      const response = await apiClient.createFamily({
        name: name.trim(),
        authCode: authCode.toUpperCase(),
        publicKey: keyPair.publicKey,
      });

      // 스토어 업데이트
      setAuthenticated(true);
      setFamilyId(response.familyId);
      setMyInfo(response.memberId, name.trim());
      setKeys(keyPair.publicKey, keyPair.privateKey);
      setAuthCode(authCode.toUpperCase());

      setInviteUrl(response.inviteUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '가족 생성에 실패했습니다'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl);
      alert('URL이 복사되었습니다!');
    }
  };

  const handleStartChat = () => {
    navigate('/chat');
  };

  if (inviteUrl) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-lg font-semibold">가족이 생성되었습니다!</h3>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-900 mb-2">
            인증코드: <strong>{authCode.toUpperCase()}</strong>
          </p>
          <p className="text-sm text-blue-700 mb-3">
            가족원에게 이 정보를 공유하세요:
          </p>
          <input
            type="text"
            value={inviteUrl}
            readOnly
            className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopy}
            className="py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            📋 URL 복사
          </button>
          <button
            onClick={handleStartChat}
            className="py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            채팅 시작
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleCreate} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          이름
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
          placeholder="당신의 이름"
          autoFocus
          maxLength={20}
        />
      </div>

      <div>
        <label
          htmlFor="authCode"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          인증코드 (4자리)
        </label>
        <input
          id="authCode"
          type="text"
          value={authCode}
          onChange={(e) => {
            const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            setAuthCode(value.slice(0, 4));
          }}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-center text-2xl tracking-widest font-mono"
          placeholder="A123"
          maxLength={4}
        />
        <p className="text-xs text-gray-500 mt-1">
          가족원에게 공유할 4자리 코드를 입력하세요
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !name.trim() || authCode.length !== 4}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? '생성 중...' : '가족 만들기'}
      </button>
    </form>
  );
}
