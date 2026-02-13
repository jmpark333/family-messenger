'use client';

import { useToast } from '@/lib/hooks/useToast';
import { useEffect, useState } from 'react';

export default function Toaster() {
  const { toasts, removeToast } = useToast();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const typeStyles = {
    success: 'bg-secure-green text-white',
    error: 'bg-secure-red text-white',
    info: 'bg-primary-500 text-white',
    warning: 'bg-secure-yellow text-gray-900',
  };

  const typeIcons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${typeStyles[toast.type]} pointer-events-auto shadow-lg rounded-lg px-4 py-3 flex items-center gap-3 animate-fade-in transition-all duration-300 hover:scale-105`}
          role="alert"
          aria-live="polite"
        >
          <span className="text-lg font-bold">{typeIcons[toast.type]}</span>
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="opacity-70 hover:opacity-100 transition-opacity ml-2"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
