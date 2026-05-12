'use client';

import { useState, useEffect } from 'react';
import { Cog6ToothIcon, GlobeAltIcon, CalendarDaysIcon, XMarkIcon } from '@heroicons/react/24/outline';
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={settings.language === 'vi' ? 'Cài đặt' : 'Settings'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Language Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <GlobeAltIcon style={{ width: '1.1rem', height: '1.1rem' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              {settings.language === 'vi' ? 'Ngôn ngữ' : 'Language'}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button 
              className={`btn ${settings.language === 'vi' ? 'btn-primary' : ''}`}
              onClick={() => updateSetting('language', 'vi')}
              style={{ padding: '0.75rem' }}
            >
              Tiếng Việt
            </button>
            <button 
              className={`btn ${settings.language === 'en' ? 'btn-primary' : ''}`}
              onClick={() => updateSetting('language', 'en')}
              style={{ padding: '0.75rem' }}
            >
              English
            </button>
          </div>
        </div>

        {/* Day Mode Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <CalendarDaysIcon style={{ width: '1.1rem', height: '1.1rem' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              {settings.language === 'vi' ? 'Hiển thị ngày' : 'Day Display'}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button 
              className={`btn ${settings.dayMode === 'weekday' ? 'btn-primary' : ''}`}
              onClick={() => updateSetting('dayMode', 'weekday')}
              style={{ padding: '0.75rem', fontSize: '0.85rem' }}
            >
              {settings.language === 'vi' ? 'Thứ 2 - CN' : 'Mon - Sun'}
            </button>
            <button 
              className={`btn ${settings.dayMode === 'dayNum' ? 'btn-primary' : ''}`}
              onClick={() => updateSetting('dayMode', 'dayNum')}
              style={{ padding: '0.75rem', fontSize: '0.85rem' }}
            >
              {settings.language === 'vi' ? 'Ngày 1 - 7' : 'Day 1 - 7'}
            </button>
          </div>
        </div>

        <button className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem' }} onClick={onClose}>
          {settings.language === 'vi' ? 'Đã hiểu' : 'Got it'}
        </button>
      </div>
    </Modal>
  );
}
