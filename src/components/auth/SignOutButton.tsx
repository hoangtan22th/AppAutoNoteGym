'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  return (
    <button 
      onClick={() => signOut()} 
      className="btn btn-secondary"
      style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
    >
      <LogOut size={16} />
      Đăng xuất
    </button>
  );
}
