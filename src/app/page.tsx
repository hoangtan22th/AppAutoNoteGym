'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import WorkoutGrid from '@/components/dashboard/WorkoutGrid';
import InstallPWA from '@/components/dashboard/InstallPWA';
import SettingsModal from '@/components/dashboard/SettingsModal';
import styles from './dashboard.module.css';
import { BoltIcon, FireIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from '@/components/dashboard/LoadingSpinner';
import UserDropdown from '@/components/dashboard/UserDropdown';
import html2canvas from 'html2canvas';
import PrintableSchedule from '@/components/dashboard/PrintableSchedule';
import { DAYS_MAP, UI_STRINGS, DAYS } from '@/components/dashboard/WorkoutGrid';
import { useRef } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentPlanData, setCurrentPlanData] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<{ language: 'vi' | 'en', dayMode: 'weekday' | 'dayNum' }>({
    language: 'vi',
    dayMode: 'weekday'
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handlePrint = async () => {
    if (!printRef.current || !currentPlanData) return;
    
    // Temporarily show the element or just rely on it being in the DOM but off-screen
    const canvas = await html2canvas(printRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 1800, // Match the component's width
      height: printRef.current.offsetHeight
    });
    
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `TanGYM-${currentPlanData.title}-${new Date().toISOString().split('T')[0]}.png`;
    link.href = dataUrl;
    link.click();
  };

  if (status === 'loading') {
    return <LoadingSpinner fullScreen />;
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
        <UserDropdown 
          language={settings.language} 
          onSettingsOpen={() => setIsSettingsOpen(true)} 
          onPrint={handlePrint} 
        />
      </header>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSettingsChange={(newSettings) => setSettings(newSettings)}
      />

      <div id="workout-grid-container" style={{ padding: '0.1rem' }}>
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

        <WorkoutGrid 
          settings={settings} 
          onPlanChange={(plan) => setCurrentPlanData(plan)}
        />
      </div>

      <PrintableSchedule 
        ref={printRef}
        plan={currentPlanData}
        settings={settings}
        daysTrans={DAYS_MAP[settings.language]}
        uiStrings={UI_STRINGS[settings.language]}
        days={DAYS}
      />

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
