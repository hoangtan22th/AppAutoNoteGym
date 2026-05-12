'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import WorkoutGrid from '@/components/dashboard/WorkoutGrid';
import InstallPWA from '@/components/dashboard/InstallPWA';
import SettingsModal from '@/components/dashboard/SettingsModal';
import styles from './dashboard.module.css';
import { BoltIcon, FireIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import SignOutButton from '@/components/auth/SignOutButton';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<{ language: 'vi' | 'en', dayMode: 'weekday' | 'dayNum' }>({
    language: 'vi',
    dayMode: 'weekday'
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="container" style={{ textAlign: 'center', padding: '5rem' }}>Đang tải...</div>;
  }

  if (!session) return null;

  return (
    <main className={`${styles.dashboard} container`}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BoltIcon className="w-8 h-8 text-blue-600" style={{ width: '2rem', height: '2rem', color: 'var(--primary)' }} />
            TanGYM
          </h1>
          <p>
            {settings.language === 'vi' ? `Chào ${session.user?.name}, hôm nay bạn tập gì thế?` : `Hello ${session.user?.name}, what's your workout today?`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            className="btn" 
            onClick={() => setIsSettingsOpen(true)}
            style={{ padding: '0.6rem', background: 'rgba(0,0,0,0.05)' }}
            title={settings.language === 'vi' ? 'Cài đặt' : 'Settings'}
          >
            <Cog6ToothIcon style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
          <SignOutButton />
        </div>
      </header>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSettingsChange={(newSettings) => setSettings(newSettings)}
      />

      <div className="glass animate-slide-up" style={{ 
        padding: '1.25rem', 
        borderRadius: '24px', 
        marginBottom: '1.5rem',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        color: 'white',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.2)', 
          padding: '0.75rem', 
          borderRadius: '16px',
          backdropFilter: 'blur(10px)'
        }}>
          <FireIcon className="w-6 h-6" style={{ width: '1.5rem', height: '1.5rem' }} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.1rem' }}>
            {settings.language === 'vi' ? 'Lịch tập tuần này' : 'Weekly Workout Plan'}
          </h2>
          <p style={{ opacity: 0.9, fontSize: '0.85rem' }}>
            {settings.language === 'vi' ? 'Theo dõi khối lượng tạ mỗi ngày.' : 'Track your weights daily.'}
          </p>
        </div>
      </div>

      <InstallPWA />

      <WorkoutGrid settings={settings} />

      <footer style={{ 
        marginTop: '4rem', 
        paddingBottom: '2rem', 
        textAlign: 'center', 
        color: 'var(--text-muted)',
        fontSize: '0.875rem'
      }}>
        <p>© {new Date().getFullYear()} Copyright HoangTan</p>
      </footer>
    </main>
  );
}
