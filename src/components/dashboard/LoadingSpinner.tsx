'use client';

import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function LoadingSpinner({ fullScreen = false }: { fullScreen?: boolean }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative flex items-center justify-center">
        <ArrowPathIcon 
          className="w-7 h-7 text-blue-600 animate-spin" 
          style={{ 
            color: 'var(--primary)', 
            animationDuration: '0.8s',
          }} 
        />
      </div>

      <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em]" style={{ fontWeight: 800, color: '#94a3b8' }}>
        LOADING
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-white/60 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center">
          {spinner}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 flex justify-center w-full">
      {spinner}
    </div>
  );
}
