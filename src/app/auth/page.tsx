import { LoginForm } from '@/components/auth/LoginForm';
import { Toaster } from 'react-hot-toast';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Enter your phone number to continue</p>
        </div>
        <LoginForm />
      </div>
      <Toaster position="top-center" />
    </div>
  );
} 