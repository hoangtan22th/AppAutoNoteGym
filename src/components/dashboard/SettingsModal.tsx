'use client';

import { useState, useEffect } from 'react';
import { 
  Cog6ToothIcon, 
  GlobeAltIcon, 
  CalendarDaysIcon, 
  QuestionMarkCircleIcon,
  InformationCircleIcon,
  BoltIcon,
  DevicePhoneMobileIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import Modal from './Modal';

interface Settings {
  language: 'vi' | 'en';
  dayMode: 'weekday' | 'dayNum';
}

export default function SettingsModal({ 
  isOpen, 
  onClose,
  onSettingsChange 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onSettingsChange: (settings: Settings) => void;
}) {
  const [settings, setSettings] = useState<Settings>({
    language: 'vi',
    dayMode: 'weekday'
  });

  useEffect(() => {
    const saved = localStorage.getItem('tangym_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(parsed);
      onSettingsChange(parsed);
    }
  }, []);

  const updateSetting = (key: keyof Settings, value: string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('tangym_settings', JSON.stringify(newSettings));
    onSettingsChange(newSettings);
  };

  const isVi = settings.language === 'vi';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isVi ? 'Cài đặt & Hướng dẫn' : 'Settings & Guide'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Language Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
            <GlobeAltIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            <span style={{ fontSize: '1rem', fontWeight: 800 }}>
              {isVi ? 'Ngôn ngữ' : 'Language'}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button 
              className={`btn ${settings.language === 'vi' ? 'btn-primary' : ''}`}
              onClick={() => updateSetting('language', 'vi')}
              style={{ padding: '0.85rem', borderRadius: '14px' }}
            >
              Tiếng Việt
            </button>
            <button 
              className={`btn ${settings.language === 'en' ? 'btn-primary' : ''}`}
              onClick={() => updateSetting('language', 'en')}
              style={{ padding: '0.85rem', borderRadius: '14px' }}
            >
              English
            </button>
          </div>
        </div>

        {/* Day Mode Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
            <CalendarDaysIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            <span style={{ fontSize: '1rem', fontWeight: 800 }}>
              {isVi ? 'Chế độ hiển thị ngày' : 'Day Display Mode'}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button 
              className={`btn ${settings.dayMode === 'weekday' ? 'btn-primary' : ''}`}
              onClick={() => updateSetting('dayMode', 'weekday')}
              style={{ padding: '0.85rem', borderRadius: '14px', fontSize: '0.9rem' }}
            >
              {isVi ? 'Thứ 2 - CN' : 'Mon - Sun'}
            </button>
            <button 
              className={`btn ${settings.dayMode === 'dayNum' ? 'btn-primary' : ''}`}
              onClick={() => updateSetting('dayMode', 'dayNum')}
              style={{ padding: '0.85rem', borderRadius: '14px', fontSize: '0.9rem' }}
            >
              {isVi ? 'Ngày 1 - 7' : 'Day 1 - 7'}
            </button>
          </div>
        </div>

        {/* Guide Section (README) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
            <InformationCircleIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            <span style={{ fontSize: '1rem', fontWeight: 800 }}>
              {isVi ? 'TanGYM có gì mới?' : 'What\'s new in TanGYM?'}
            </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', background: '#f8fafc', padding: '1rem', borderRadius: '16px' }}>
              <BoltIcon style={{ width: '1.25rem', height: '1.25rem', color: '#f59e0b', flexShrink: 0 }} />
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
                <strong>{isVi ? 'Đa giáo án:' : 'Multi-Programs:'}</strong> {isVi ? 'Tạo không giới hạn lịch tập (Ngực, Chân, Yoga...) và chuyển đổi mượt mà.' : 'Create unlimited workout plans and switch between them seamlessly.'}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', background: '#f8fafc', padding: '1rem', borderRadius: '16px' }}>
              <DevicePhoneMobileIcon style={{ width: '1.25rem', height: '1.25rem', color: '#10b981', flexShrink: 0 }} />
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
                <strong>{isVi ? 'Cài đặt App:' : 'Install App:'}</strong> {isVi ? 'Mở ứng dụng bằng trình duyệt thật và nhấn nút "Cài đặt về máy" để sử dụng TanGYM như một ứng dụng thật thụ, không cần trình duyệt.' : 'Click "Install App" to use TanGYM as a native mobile application.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', background: '#f8fafc', padding: '1rem', borderRadius: '16px' }}>
              <SparklesIcon style={{ width: '1.25rem', height: '1.25rem', color: '#8b5cf6', flexShrink: 0 }} />
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
                <strong>{isVi ? 'Dọn dẹp nhanh:' : 'Smart Cleanup:'}</strong> {isVi ? 'Sử dụng nút "Dọn dẹp" (Tia sáng) để xóa nhanh các lịch cũ, giữ lại lịch đang tập.' : 'Use the Sparkles button to quickly delete old plans while keeping the active one.'}
              </p>
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', marginTop: '1rem' }}>
          TanGYM - Made with ❤️ by HoangTan
        </p>
      </div>
    </Modal>
  );
}
