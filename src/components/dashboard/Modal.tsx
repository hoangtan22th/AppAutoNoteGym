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
          {/* Header Section */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100" style={{ borderBottom: '1px solid #f1f5f9', padding: '1.5rem 2rem' }}>
            {/* Left Spacer to keep title centered */}
            <div style={{ width: '40px' }}></div>
            
            <h3 className="text-xl font-black text-gray-900" style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', textAlign: 'center', flex: 1 }}>
              {title}
            </h3>
            
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: '40px', height: '40px' }}
            >
              <XMarkIcon className="w-6 h-6 text-gray-400 hover:text-gray-900" style={{ width: '1.5rem', height: '1.5rem' }} />
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
