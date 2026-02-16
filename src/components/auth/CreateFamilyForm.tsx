'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateInviteUrl } from '@/lib/auth/url-generator';
import { dbHelpers, isDatabaseAvailable } from '@/lib/db';
import { generateIdentityKeyPair } from '@/lib/signal/protocol';
import { useChatStore } from '@/stores/chat-store';

export function CreateFamilyForm() {
  const navigate = useNavigate();
  const setAuthenticated = useChatStore((state) => state.setAuthenticated);
  const setMyInfo = useChatStore((state) => state.setMyInfo);
  const setAuthCredentials = useChatStore((state) => state.setAuthCredentials);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('이름을 입력해주세요');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check IndexedDB availability
      const isAvailable = await isDatabaseAvailable();
      if (!isAvailable) {
        setError('브라우저 저장소 접근이 차단되었습니다. 개인정보 보호 설정을 확인해주세요.');
        setLoading(false);
        return;
      }
      const familyId = crypto.randomUUID();
      const baseUrl = window.location.origin;

      // Generate key pair for E2E encryption
      const keyPair = await generateIdentityKeyPair();
 
      // Generate additional PIN for P2P authentication
      const additionalPin = crypto.randomUUID().slice(0, 16);
      
      // Save to IndexedDB
      const memberId = crypto.randomUUID();
      await dbHelpers.saveFamily({
        id: familyId,
        myMemberId: memberId,
        myName: name,
        additionalPin,
        keys: keyPair,
        joinedAt: Date.now()
      });

      // Set authenticated state immediately after family creation
      setAuthenticated(true);
      setMyInfo(memberId, name);
      setAuthCredentials({
        id: memberId,
        password: '', // Not used in current implementation
        additionalPin,
      });
      console.log('[CreateFamilyForm] Family created with additionalPin:', additionalPin);

      const url = generateInviteUrl(familyId, 'creator', baseUrl);
      setInviteUrl(url);
    } catch (err) {
      console.error('가족 생성 실패:', err);
      setError('가족 생성에 실패했습니다. 브라우저 저장소를 확인해주세요.');
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

  if (inviteUrl) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-lg font-semibold">가족이 생성되었습니다!</h3>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-2">이 URL을 가족원에게 보내세요:</p>
          <input
            type="text"
            value={inviteUrl}
            readOnly
            className="w-full px-3 py-2 bg-white border rounded-lg text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopy}
            className="py-2 bg-blue-500 text-white rounded-lg font-medium"
          >
            복사하기
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="py-2 bg-gray-200 text-gray-700 rounded-lg font-medium"
          >
            채팅 시작
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이름
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
          placeholder="당신의 이름"
          autoFocus
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50"
      >
        {loading ? '생성 중...' : '가족 만들기'}
      </button>
    </form>
  );
}
