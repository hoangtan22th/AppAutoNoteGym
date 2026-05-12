'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        <p className={styles.subtitle}>Chào mừng trở lại TanGYM!<br/>Đăng nhập để tiếp tục tập luyện.</p>

        {error && <div className={styles.error}>{error}</div>}

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
            <input
              type="password"
              id="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <Link href="/forgot-password" className={styles.forgotLink}>
            Quên mật khẩu?
          </Link>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
          </button>
        </form>

        <div className={styles.footer}>
          Chưa có tài khoản? 
          <Link href="/register" className={styles.link}>Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
}
