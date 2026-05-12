'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/login.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Đã xảy ra lỗi');
      }

      setMessage(data.message);
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Quên mật khẩu</h1>
        <p className={styles.subtitle}>Nhập email để nhận mã xác nhận</p>

        {error && <div className={styles.error}>{error}</div>}
        {message && <div style={{ background: '#ecfdf5', color: '#065f46', padding: '1rem', borderRadius: '14px', marginBottom: '1.5rem', textAlign: 'center' }}>{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email của bạn</label>
            <input
              type="email"
              id="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ten@example.com"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
          </button>
        </form>

        <div className={styles.footer}>
          <Link href="/login" className={styles.link}>Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
