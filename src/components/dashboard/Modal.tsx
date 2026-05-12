'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import ModalPortal from './ModalPortal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div 
        className="fixed inset-0 flex items-center justify-center p-4 animate-fade-in" 
        style={{ 
          position: 'fixed', 
          top: 0, left: 0, right: 0, bottom: 0, 
          zIndex: 99999, 
          backgroundColor: 'rgba(0, 0, 0, 0.75)', 
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div 
          className="bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] animate-scale-in"
          style={{ 
            width: '95%',
            maxWidth: '550px', 
            backgroundColor: '#ffffff', 
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Centered Header with more padding */}
          <div className="p-8 border-b border-gray-100 flex justify-center items-center relative" style={{ borderBottom: '1px solid #f1f5f9', padding: '1.75rem 2rem' }}>
            <h3 className="text-xl font-black text-gray-900" style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', textAlign: 'center', margin: 0 }}>
              {title}
            </h3>
            <button 
              onClick={onClose} 
              className="absolute right-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              style={{ background: '#f8fafc', border: 'none', cursor: 'pointer' }}
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" style={{ width: '1.5rem', height: '1.5rem' }} />
            </button>
          </div>
          
          <div className="p-8" style={{ backgroundColor: '#ffffff' }}>
            {children}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
