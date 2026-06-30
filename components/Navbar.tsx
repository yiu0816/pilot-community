'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
        
        setUsername(profile?.username || user.email?.split('@')[0] || '');
      }
    };

    getUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2 text-blue-400 hover:text-blue-300 transition">
            ✈️ PilotHub
          </Link>
          
          <div className="flex gap-6 text-sm">
            <Link href="/" className="text-gray-300 hover:text-white transition">Home</Link>
            <Link href="/forum" className="text-gray-300 hover:text-white transition">Forum</Link>
            <Link href="/learning" className="text-gray-300 hover:text-white transition">Daily Learning</Link>
            <Link href="/resources" className="text-gray-300 hover:text-white transition">Resources</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <a 
                href="/profile" 
                className="text-sm text-blue-400 hover:underline cursor-pointer"
              >
                👤 {username}
              </a>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-600/80 hover:bg-red-700 px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-blue-400 hover:underline">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}