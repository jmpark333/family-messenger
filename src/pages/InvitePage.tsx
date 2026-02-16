import { JoinFamilyForm } from '@/components/auth/JoinFamilyForm';

export default function InvitePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-xl font-bold mb-6 text-center">가족에 참여</h2>
        <JoinFamilyForm />
      </div>
    </div>
  );
}
