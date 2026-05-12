'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError('Email hoặc mật khẩu không chính xác');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('Đã xảy ra lỗi không mong muốn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>TanGYM</h1>
        <p className={styles.subtitle}>Đăng nhập để tiếp tục tập luyện.</p>

        {error && <div className={styles.error} style={{ 
          background: '#fee2e2', 
          color: '#b91c1c', 
          padding: '0.75rem', 
          borderRadius: '12px', 
          fontSize: '0.85rem', 
          marginBottom: '1rem',
          textAlign: 'center',
          fontWeight: 600,
          border: '1px solid #fecaca'
        }}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.inputLabel}>Email</label>
            <input
              type="email"
              id="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@gmail.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.inputLabel}>Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                {showPassword ? <EyeSlashIcon style={{ width: '1.25rem' }} /> : <EyeIcon style={{ width: '1.25rem' }} />}
              </button>
            </div>
          </div>

          <Link href="/forgot-password" className={styles.forgotLink} style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
            Quên mật khẩu?
          </Link>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontWeight: 800 }}
            disabled={loading}
          >
            {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
          </button>
        </form>

        <div className={styles.footer} style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
          Chưa có tài khoản? 
          <Link href="/register" className={styles.link} style={{ marginLeft: '0.5rem', color: 'var(--primary)', fontWeight: 700 }}>Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
}
