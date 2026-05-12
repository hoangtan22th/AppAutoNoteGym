'use client';

export default function LoadingSpinner({ fullScreen = false }: { fullScreen?: boolean }) {
  const spinner = (
    <div className="spinner-container">
      <div className="circular-loader"></div>
      <style jsx>{`
        .spinner-container {
          display: flex;
          align-items: center;
          justify-center: center;
        }
        .circular-loader {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(37, 99, 235, 0.1);
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-white/50 backdrop-blur-[2px]">
        {spinner}
      </div>
    );
  }

  return (
    <div className="py-4 flex justify-center w-full">
      {spinner}
    </div>
  );
}
