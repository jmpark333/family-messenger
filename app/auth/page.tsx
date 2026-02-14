'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CreateFamilyForm } from '@/components/auth/CreateFamilyForm';
import { JoinFamilyForm } from '@/components/auth/JoinFamilyForm';

function AuthPageContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const invite = searchParams.get('invite');

  // If invite URL is present, show join form
  if (invite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <JoinFamilyForm inviteToken={invite} />
        </div>
      </div>
    );
  }

  // Otherwise show mode selection
  if (mode === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h2 className="text-xl font-bold mb-6 text-center">새 가족 만들기</h2>
          <CreateFamilyForm />
        </div>
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h2 className="text-xl font-bold mb-6 text-center">URL 입력</h2>
          <JoinFamilyForm />
        </div>
      </div>
    );
  }

  // Invalid - redirect home
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>유효하지 않은 접근입니다. <a href="/">홈으로</a></p>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
