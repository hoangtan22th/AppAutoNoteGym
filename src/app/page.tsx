import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import WorkoutGrid from '@/components/dashboard/WorkoutGrid';
import InstallPWA from '@/components/dashboard/InstallPWA';
import styles from './dashboard.module.css';
import { BoltIcon, FireIcon } from '@heroicons/react/24/solid';
import SignOutButton from '@/components/auth/SignOutButton';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <main className={`${styles.dashboard} container`}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BoltIcon className="w-8 h-8 text-blue-600" style={{ width: '2rem', height: '2rem', color: 'var(--primary)' }} />
            TanGYM
          </h1>
          <p>Chào {session.user?.name}, hôm nay bạn tập gì thế?</p>
        </div>
        <SignOutButton />
      </header>

      <div className="glass animate-slide-up" style={{ 
        padding: '1.5rem', 
        borderRadius: '24px', 
        marginBottom: '2rem',
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.1rem' }}>Lịch tập tuần này</h2>
          <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>Theo dõi khối lượng tạ mỗi ngày.</p>
        </div>
      </div>

      <InstallPWA />

      <WorkoutGrid />

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
