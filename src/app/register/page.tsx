'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/login.module.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
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
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Đã xảy ra lỗi khi đăng ký');
      }

      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>TanGYM</h1>
        <p className={styles.subtitle}>Đăng ký TanGYM<br/>Bắt đầu hành trình của bạn ngay hôm nay.</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.inputLabel}>Họ và tên</label>
            <input
              type="text"
              id="name"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nguyễn Văn A"
            />
          </div>

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
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Đang khởi tạo...' : 'Đăng Ký'}
          </button>
        </form>

        <div className={styles.footer}>
          Đã có tài khoản? 
          <Link href="/login" className={styles.link}>Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
