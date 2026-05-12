'use client';

export default function LoadingSpinner({ fullScreen = false }: { fullScreen?: boolean }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div 
          className="w-12 h-12 rounded-full border-4 border-blue-100"
          style={{ borderTopColor: 'var(--primary)', animation: 'spin 1s linear infinite' }}
        ></div>
        <div 
          className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-blue-500 opacity-20"
          style={{ animation: 'spin 2s linear infinite reverse' }}
        ></div>
      </div>
      <p className="text-sm font-medium text-gray-400 animate-pulse" style={{ letterSpacing: '0.05em' }}>
        TANGYM LOADING...
      </p>
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
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
