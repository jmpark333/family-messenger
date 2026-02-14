'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateInviteToken } from '@/lib/auth/token-validator';
import { dbHelpers, isDatabaseAvailable } from '@/lib/db';
import { generateIdentityKeyPair } from '@/lib/signal/protocol';
import { useChatStore } from '@/stores/chat-store';

interface Props {
  inviteToken?: string;
}

export function JoinFamilyForm({ inviteToken: propToken }: Props) {
  const router = useRouter();
  const setAuthenticated = useChatStore((state) => state.setAuthenticated);
  const setMyInfo = useChatStore((state) => state.setMyInfo);
  const [name, setName] = useState('');
  const [token, setToken] = useState(propToken || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    setError('');
    setLoading(true);

    try {
      // Check IndexedDB availability
      const isAvailable = await isDatabaseAvailable();
      if (!isAvailable) {
        setError('브라우저 저장소 접근이 차단되었습니다. 개인정보 보호 설정을 확인해주세요.');
        setLoading(false);
        return;
      }

      // Validate token
      const validated = validateInviteToken(token);
      if (!validated) {
        setError('유효하지 않은 초대장입니다');
        setLoading(false);
        return;
      }

      // Check expiry
      if (Date.now() > validated.expiresAt) {
        setError('만료된 초대장입니다. 가족원에게 새 URL을 요청하세요');
        setLoading(false);
        return;
      }

      // Generate key pair for E2E encryption
      const keyPair = await generateIdentityKeyPair();

      // Save to IndexedDB
      const memberId = crypto.randomUUID();
      await dbHelpers.saveFamily({
        id: validated.familyId,
        myMemberId: memberId,
        myName: name,
        keys: keyPair,
        joinedAt: Date.now()
      });

      // Set authenticated state
      setAuthenticated(true);
      setMyInfo(memberId, name);

      router.push('/chat');
    } catch (err) {
      console.error('가족 참여 실패:', err);
      setError('가족 참여에 실패했습니다. 브라우저 저장소를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleJoin(); }} className="space-y-4">
      {!propToken && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            초대 URL
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
            placeholder="가족원에게 받은 URL을 붙여넣으세요"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이름
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
          placeholder="가족원들에게 보일 이름"
          autoFocus={!!propToken}
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !name.trim() || !token.trim()}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50"
      >
        {loading ? '참여 중...' : '가족에 참여'}
      </button>
    </form>
  );
}
