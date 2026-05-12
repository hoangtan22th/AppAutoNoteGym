'use client';

import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function LoadingSpinner({ fullScreen = false }: { fullScreen?: boolean }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        {/* Main Spinning Icon - Smaller and more refined */}
        <ArrowPathIcon 
          className="w-10 h-10 text-blue-600 animate-spin" 
          style={{ 
            color: 'var(--primary)', 
            animationDuration: '1s',
            filter: 'drop-shadow(0 0 6px var(--primary-glow))'
          }} 
        />
        
        {/* Decorative Outer Ring - Smaller */}
        <div 
          className="absolute w-16 h-16 rounded-full border-2 border-dashed border-blue-200 opacity-40 animate-spin"
          style={{ animationDuration: '3s' }}
        ></div>
        
        {/* Decorative Inner Circle */}
        <div 
          className="absolute w-6 h-6 rounded-full bg-blue-50 opacity-20 animate-pulse"
        ></div>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <p className="text-sm font-black text-gray-900 tracking-tight" style={{ fontWeight: 900, color: '#1e293b' }}>
          TANGYM
        </p>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-1 h-1 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-1 h-1 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-white/80 backdrop-blur-md">
        {spinner}
      </div>
    );
  }

  return (
    <div className="py-12 flex justify-center w-full">
      {spinner}
    </div>
  );
}
