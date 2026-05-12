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
          backgroundColor: 'rgba(0, 0, 0, 0.8)', /* Darker overlay for more impact */
          backdropFilter: 'blur(16px)', /* Stronger blur */
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          className="bg-white shadow-[0_32px_80px_-20px_rgba(0,0,0,0.6)] animate-scale-in"
          style={{ 
            width: '95%',
            maxWidth: '460px', 
            backgroundColor: '#ffffff', 
            borderRadius: '24px', /* Slightly more rounded for premium feel */
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {/* Top Decorative Bar */}
          <div style={{ 
            height: '6px', 
            width: '100%', 
            background: variant === 'danger' ? 'linear-gradient(90deg, #ef4444, #f87171)' : 'linear-gradient(90deg, #2563eb, #60a5fa)' 
          }}></div>

          <div className="p-12" style={{ backgroundColor: '#ffffff' }}> {/* Super spacious padding */}
            <div className="flex flex-col items-center text-center gap-6">
              {/* Animated Icon Container */}
              <div 
                style={{ 
                  background: variant === 'danger' ? '#fff1f2' : '#eff6ff', 
                  color: variant === 'danger' ? '#e11d48' : '#2563eb',
                  padding: '1.5rem',
                  borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', /* Organic shape */
                  animation: 'morph 8s ease-in-out infinite',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: variant === 'danger' ? '0 20px 40px -10px rgba(225, 29, 72, 0.2)' : '0 20px 40px -10px rgba(37, 99, 235, 0.2)'
                }}
              >
                <ExclamationTriangleIcon style={{ width: '3rem', height: '3rem' }} />
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <h3 className="text-3xl font-black text-gray-900" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                  {title}
                </h3>
                <p className="text-gray-500" style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '320px' }}>
                  {message}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-8 flex flex-col sm:flex-row gap-4" style={{ backgroundColor: '#ffffff', display: 'flex', gap: '1rem', borderTop: '1px solid #f8fafc' }}>
            <button 
              onClick={onClose}
              className="btn"
              style={{ 
                flex: 1, 
                justifyContent: 'center', 
                background: '#f8fafc', 
                border: '1px solid #e2e8f0', 
                padding: '1.1rem', 
                fontWeight: 700,
                color: '#64748b',
                borderRadius: '16px',
                fontSize: '1rem'
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
                background: variant === 'danger' ? 'linear-gradient(135deg, #e11d48, #fb7185)' : 'linear-gradient(135deg, #2563eb, #60a5fa)',
                color: 'white',
                padding: '1.1rem', 
                fontWeight: 800,
                border: 'none',
                borderRadius: '16px',
                fontSize: '1rem',
                boxShadow: variant === 'danger' ? '0 12px 24px -6px rgba(225, 29, 72, 0.4)' : '0 12px 24px -6px rgba(37, 99, 235, 0.4)'
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes morph {
          0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
          50% { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; }
          100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
        }
      `}</style>
    </ModalPortal>
  );
}
