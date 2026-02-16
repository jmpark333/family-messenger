// JoinFamilyForm.tsx - 간소화된 버전
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from '@/lib/hooks/useSearchParams';
import { useChatStore } from '@/stores/chat-store';
import { apiClient } from '@/lib/api/client';
import { generateKeyPair } from '@/lib/crypto';

interface Props {
  familyId?: string;
}

export function JoinFamilyForm({ familyId: propFamilyId }: Props) {
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const familyIdFromUrl = searchParams.get('family');

  const setAuthenticated = useChatStore((state) => state.setAuthenticated);
  const setFamilyId = useChatStore((state) => state.setFamilyId);
  const setMyInfo = useChatStore((state) => state.setMyInfo);
  const setKeys = useChatStore((state) => state.setKeys);
  const setAuthCode = useChatStore((state) => state.setAuthCode);
  const addMemberPublicKey = useChatStore((state) => state.addMemberPublicKey);

  const [familyId, setFamilyIdInput] = useState(familyIdFromUrl || propFamilyId || '');
  const [name, setName] = useState('');
  const [authCodeInput, setAuthCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!familyId.trim()) {
      setError('가족 ID가 필요합니다');
      return;
    }
    if (!name.trim()) {
      setError('이름을 입력해주세요');
      return;
    }
    if (!authCodeInput.trim() || authCodeInput.length !== 4) {
      setError('4자리 인증코드를 입력해주세요');
      return;
    }

    setLoading(true);

    try {
      // 키 쌍 생성
      const keyPair = await generateKeyPair();

      // API 호출
      const response = await apiClient.joinFamily({
        familyId: familyId.trim(),
        name: name.trim(),
        authCode: authCodeInput.toUpperCase(),
        publicKey: keyPair.publicKey,
      });

      // 스토어 업데이트
      setAuthenticated(true);
      setFamilyId(response.familyId);
      setMyInfo(response.memberId, name.trim());
      setKeys(keyPair.publicKey, keyPair.privateKey);
      setAuthCode(authCodeInput.toUpperCase());

      // 멤버 공개키 저장 (암호화용)
      response.members.forEach((member) => {
        if (member.id !== response.memberId) {
          addMemberPublicKey(member.id, member.publicKey);
        }
      });

      // 채팅 페이지로 이동
      navigate('/chat');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '참여에 실패했습니다'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleJoin} className="space-y-4">
      {!familyIdFromUrl && !propFamilyId && (
        <div>
          <label
            htmlFor="familyId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            가족 ID (URL에서 ?family= 뒤에 있는 값)
          </label>
          <input
            id="familyId"
            type="text"
            value={familyId}
            onChange={(e) => setFamilyIdInput(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors font-mono text-sm"
            placeholder="가족 ID를 붙여넣으세요"
          />
        </div>
      )}

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
          placeholder="가족원들에게 보일 이름"
          autoFocus={!!familyIdFromUrl || !!propFamilyId}
          maxLength={20}
        />
      </div>

      <div>
        <label
          htmlFor="authCode"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          인증코드
        </label>
        <input
          id="authCode"
          type="text"
          value={authCodeInput}
          onChange={(e) => {
            const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            setAuthCodeInput(value.slice(0, 4));
          }}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-center text-2xl tracking-widest font-mono"
          placeholder="A123"
          maxLength={4}
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={
          loading ||
          !familyId.trim() ||
          !name.trim() ||
          authCodeInput.length !== 4
        }
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? '참여 중...' : '가족에 참여'}
      </button>
    </form>
  );
}
