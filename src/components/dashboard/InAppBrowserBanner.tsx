'use client';

import { useState, useEffect } from 'react';
import { ArrowTopRightOnSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function InAppBrowserBanner() {
  const [isInApp, setIsInApp] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isInAppBrowser = (
      /FBAN|FBAV/i.test(ua) || // Facebook
      /Instagram/i.test(ua) || // Instagram
      /Messenger/i.test(ua) || // Messenger
      /Zalo/i.test(ua) ||      // Zalo
      /Line/i.test(ua) ||      // Line
      /Thread/i.test(ua)       // Threads
    );
    
    setIsInApp(isInAppBrowser);
  }, []);

  if (!isInApp || !isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200000] p-4 animate-slide-down">
      <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-blue-400">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <ArrowTopRightOnSquareIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Mở bằng Trình duyệt thật</p>
            <p className="text-[10px] opacity-90 leading-tight mt-1">
              Nhấn biểu tượng (⋮) hoặc (⋯) rồi chọn "Mở bằng Chrome/Safari" để cài đặt App.
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slide-down 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
