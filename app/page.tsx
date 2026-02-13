import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
        <div className="text-6xl">👨‍👩‍👧‍👦</div>
        <h1 className="text-2xl font-bold text-gray-900">가족 메신저</h1>
        <p className="text-gray-600">가족끼리만 메시지와 파일을 공유하세요</p>

        <div className="space-y-3">
          <Link
            href="/auth?mode=create"
            className="block w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            새 가족 만들기
          </Link>
          <p className="text-sm text-gray-500">또는</p>
          <Link
            href="/auth?mode=join"
            className="block w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            가족원에게 받은 URL 입력
          </Link>
        </div>
      </div>
    </div>
  );
}
