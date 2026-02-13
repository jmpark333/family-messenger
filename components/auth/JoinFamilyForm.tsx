'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateInviteToken } from '@/lib/auth/token-validator';
import { dbHelpers } from '@/lib/db';
import { generateIdentityKeyPair } from '@/lib/signal/protocol';
import type { FamilySchema } from '@/lib/db';

interface Props {
  inviteToken?: string;
}

export function JoinFamilyForm({ inviteToken: propToken }: Props) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [token, setToken] = useState(propToken || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    setError('');
    setLoading(true);

    try {
      // Validate token
      const validated = validateInviteToken(token);
      if (!validated) {
        setError('유효하지 않은 초대장입니다');
        return;
      }

      // Check expiry
      if (Date.now() > validated.expiresAt) {
        setError('만료된 초대장입니다. 가족원에게 새 URL을 요청하세요');
        return;
      }

      // Generate key pair for E2E encryption
      const keyPair = await generateIdentityKeyPair();

      // Save to IndexedDB
      await dbHelpers.saveFamily({
        id: validated.familyId,
        myMemberId: crypto.randomUUID(),
        myName: name,
        keys: keyPair,
        joinedAt: Date.now()
      });

      router.push('/chat');
    } catch (err) {
      setError('가족 참여에 실패했습니다');
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
