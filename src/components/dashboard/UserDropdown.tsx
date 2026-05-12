'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  UserCircleIcon, 
  Cog6ToothIcon, 
  PrinterIcon, 
  ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { signOut, useSession } from 'next-auth/react';
import styles from '@/app/dashboard.module.css';

interface UserDropdownProps {
  onSettingsOpen: () => void;
  onPrint: () => void;
  language: 'vi' | 'en';
}

export default function UserDropdown({ onSettingsOpen, onPrint, language }: UserDropdownProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const t = {
    settings: language === 'vi' ? 'Cài đặt' : 'Settings',
    print: language === 'vi' ? 'In lịch tập' : 'Print Schedule',
    logout: language === 'vi' ? 'Đăng xuất' : 'Sign Out'
  };

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button 
        className={styles.userButton} 
        onClick={() => setIsOpen(!isOpen)}
        title={t.settings}
        style={{ padding: session?.user?.image ? '0' : '0.15rem', overflow: 'hidden' }}
      >
        {session?.user?.image ? (
          <img 
            src={session.user.image} 
            alt="User" 
            style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', objectFit: 'cover' }} 
          />
        ) : (
          <UserCircleIcon style={{ width: '1.75rem', height: '1.75rem' }} />
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <button onClick={() => { onSettingsOpen(); setIsOpen(false); }}>
            <Cog6ToothIcon style={{ width: '1.1rem', height: '1.1rem' }} />
            {t.settings}
          </button>
          <button onClick={() => { onPrint(); setIsOpen(false); }}>
            <PrinterIcon style={{ width: '1.1rem', height: '1.1rem' }} />
            {t.print}
          </button>
          <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '0.25rem 0' }}></div>
          <button onClick={() => signOut()} className={styles.logoutBtn}>
            <ArrowLeftOnRectangleIcon style={{ width: '1.1rem', height: '1.1rem' }} />
            {t.logout}
          </button>
        </div>
      )}
    </div>
  );
}
