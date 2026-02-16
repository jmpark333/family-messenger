import { CreateFamilyForm } from '@/components/auth/CreateFamilyForm';

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-xl font-bold mb-6 text-center">새 가족 만들기</h2>
        <CreateFamilyForm />
      </div>
    </div>
  );
}
