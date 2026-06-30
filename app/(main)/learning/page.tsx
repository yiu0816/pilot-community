'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function DailyLearning() {
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('learning_entries')
        .select('*, username')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setEntries(data || []);
    };

    fetchEntries();
  }, []);

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-8">📖 My Learning History</h1>

        {entries.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No learning entries yet. Go to Profile to add new ones.</p>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700">
                <p className="text-sm text-gray-500 mb-3">
                  {new Date(entry.created_at).toLocaleDateString()} • 
                  Posted by{' '}
                  <a 
                    href={`/profile?user=${entry.user_id}`} 
                    className="text-blue-400 hover:underline cursor-pointer"
                  >
                    {entry.username}
                  </a>
                </p>
                <p className="text-lg text-white mb-4"><strong>What I Learned:</strong> {entry.what_learned}</p>
                {entry.reflection && (
                  <p className="text-gray-300"><strong>Reflection:</strong> {entry.reflection}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}