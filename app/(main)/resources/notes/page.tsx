'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import ProtectedRoute from '../../../../components/ProtectedRoute';

export default function PublicNotes() {
  const [publicNotes, setPublicNotes] = useState<any[]>([]);

  useEffect(() => {
    const fetchPublicNotes = async () => {
      const { data } = await supabase
        .from('notes')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      setPublicNotes(data || []);
    };

    fetchPublicNotes();
  }, []);

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-8">🌍 Public Notes & Resources</h1>
        <p className="text-gray-400 mb-10">Shared study notes from the PilotHub community</p>

        <div className="space-y-6">
          {publicNotes.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No public notes yet. Be the first to share!</p>
          ) : (
            publicNotes.map((note) => (
              <div key={note.id} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{note.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">Shared by {note.username}</p>
                  </div>
                  <a
                    href={supabase.storage.from('notes').getPublicUrl(note.file_path).data.publicUrl}
                    target="_blank"
                    className="text-blue-400 hover:underline self-start mt-1"
                  >
                    Open PDF →
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}