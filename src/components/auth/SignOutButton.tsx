'use client';

import { signOut } from 'next-auth/react';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

export default function SignOutButton() {
  return (
    <button 
      onClick={() => signOut()} 
      className="btn btn-secondary"
      style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
    >
      <ArrowLeftOnRectangleIcon className="w-4 h-4" style={{ width: '1rem', height: '1rem' }} />
      Đăng xuất
    </button>
  );
}
