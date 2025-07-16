import { LoginForm } from '@/components/auth/LoginForm';
import { Toaster } from 'react-hot-toast';

export default function AuthPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: 'var(--primary-bg)' }}
    >
      <div 
        className="rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md border"
        style={{ 
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-4">
            <svg 
              className="w-8 h-8 mr-2" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{ color: 'var(--accent)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h1 
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{ color: 'var(--primary-text)' }}
            >
              Kuvaka
            </h1>
          </div>
          <p 
            className="text-sm sm:text-base"
            style={{ color: 'var(--secondary-text)' }}
          >
            Enter your phone number to continue
          </p>
        </div>
        <LoginForm />
      </div>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--card-bg)',
            color: 'var(--primary-text)',
            border: `1px solid var(--border)`,
          },
        }}
      />
    </div>
  );
} 