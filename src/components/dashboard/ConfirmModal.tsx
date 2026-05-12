'use client';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import ModalPortal from './ModalPortal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'primary'
}: ConfirmModalProps) {
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
      >
        <div 
          className="bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] animate-scale-in"
          style={{ 
            width: '90%',
            maxWidth: '480px', 
            backgroundColor: '#ffffff', 
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div className="p-10" style={{ backgroundColor: '#ffffff' }}> {/* Increased padding */}
            <div className="flex flex-col items-center text-center gap-4">
              <div 
                className={`p-4 rounded-[16px]`} 
                style={{ 
                  background: variant === 'danger' ? '#fff1f2' : '#eff6ff', 
                  color: variant === 'danger' ? '#e11d48' : '#2563eb',
                  marginBottom: '0.5rem'
                }}
              >
                <ExclamationTriangleIcon style={{ width: '2.5rem', height: '2.5rem' }} />
              </div>
              <h3 className="text-2xl font-black text-gray-900" style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>{title}</h3>
              <p className="text-gray-600 leading-relaxed" style={{ color: '#64748b', fontSize: '1.05rem' }}>
                {message}
              </p>
            </div>
          </div>
          
          <div className="p-6 flex gap-4" style={{ backgroundColor: '#f8fafc', display: 'flex', gap: '1rem', borderTop: '1px solid #f1f5f9' }}>
            <button 
              onClick={onClose}
              className="btn"
              style={{ 
                flex: 1, 
                justifyContent: 'center', 
                background: 'white', 
                border: '1px solid #e2e8f0', 
                padding: '1rem', 
                fontWeight: 800,
                color: '#475569',
                borderRadius: '12px'
              }}
            >
              {cancelText}
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="btn"
              style={{ 
                flex: 1, 
                justifyContent: 'center', 
                background: variant === 'danger' ? '#e11d48' : '#2563eb',
                color: 'white',
                padding: '1rem', 
                fontWeight: 800,
                border: 'none',
                borderRadius: '12px',
                boxShadow: variant === 'danger' ? '0 8px 12px -3px rgba(225, 29, 72, 0.3)' : '0 8px 12px -3px rgba(37, 99, 235, 0.3)'
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
