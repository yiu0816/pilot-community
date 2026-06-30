'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [learningEntries, setLearningEntries] = useState<any[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [reflection, setReflection] = useState('');
  const [loading, setLoading] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [editingUsername, setEditingUsername] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profileData);
        setNewUsername(profileData?.username || '');

        const { data: entries } = await supabase
          .from('learning_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        setLearningEntries(entries || []);
      }
    };

    fetchData();
  }, []);

  const handleSubmitLearning = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    let photoPath = null;

    if (photoFile && user) {
      const fileName = `${Date.now()}-${photoFile.name}`;
      photoPath = `${user.id}/${fileName}`;

      const { error } = await supabase.storage
        .from('learning-photos')
        .upload(photoPath, photoFile);

      if (error) {
        console.error("Photo upload error:", error);
        alert("Photo upload failed. Check bucket permissions.");
      }
    }
    if (user) {
      await supabase.from('learning_entries').insert({
        user_id: user.id,
        username: user.email?.split('@')[0],
        what_learned: newEntry,
        reflection: reflection,
        photo_path: photoPath,
      });
    }

    setNewEntry('');
    setReflection('');
    setPhotoFile(null);
    // Refresh entries
    const { data: entries } = await supabase
      .from('learning_entries')
      .select('*')
      .eq('user_id', user?.id || '')
      .order('created_at', { ascending: false });
    setLearningEntries(entries || []);
    setLoading(false);
  };

  const updateUsername = async () => {
    if (!newUsername.trim() || newUsername.length < 3) {
      alert("Username must be at least 3 characters");
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ username: newUsername.toLowerCase().trim() })
      .eq('id', user.id);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("✅ Username updated successfully!");
      setEditingUsername(false);

      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(updatedProfile);
      setNewUsername(updatedProfile?.username || '');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhotoFile(file);
  };

  const deleteLearningEntry = async (entryId: string) => {
    if (!confirm("Delete this learning entry?")) return;

    const { error } = await supabase
      .from('learning_entries')
      .delete()
      .eq('id', entryId);

    if (error) {
      alert("Error deleting entry");
    } else {
      // Refresh list
      const { data: entries } = await supabase
        .from('learning_entries')
        .select('*')
        .eq('user_id', user?.id || '')
        .order('created_at', { ascending: false });
      setLearningEntries(entries || []);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Profile Header */}
        <div className="bg-zinc-900 rounded-3xl p-10 mb-10">
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-6xl">
              ✈️
            </div>
            <div>
              {editingUsername ? (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="p-3 bg-black border border-zinc-700 rounded-xl text-white flex-1"
                  />
                  <button onClick={updateUsername} className="bg-green-600 px-6 rounded-xl">Save</button>
                  <button onClick={() => setEditingUsername(false)} className="bg-gray-600 px-6 rounded-xl">Cancel</button>
                </div>
              ) : (
                <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                  {profile?.username || user?.email?.split('@')[0]}
                  <button 
                    onClick={() => setEditingUsername(true)}
                    className="text-sm bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg text-gray-300"
                  >
                    ✏️ Edit
                  </button>
                </h1>
              )}
              <p className="text-gray-400 text-lg">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Daily Learning Input */}
        <div className="bg-zinc-900 p-6 rounded-2xl mb-10">
          <h2 className="text-2xl font-semibold mb-6 text-white">📖 Today's Learning</h2>
          <form onSubmit={handleSubmitLearning}>
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="What did you learn today?"
              className="w-full p-4 bg-black border border-zinc-700 rounded-xl text-white placeholder-gray-500 mb-4"
              rows={4}
            />
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Reflection & improvement (optional)"
              className="w-full p-4 bg-black border border-zinc-700 rounded-xl text-white placeholder-gray-500 mb-4"
              rows={3}
            />

            {/* Photo Upload */}
            {/*<div className="mb-6">
              <label className="text-white block mb-2">Add Photo (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="text-white bg-zinc-800 border border-zinc-600 rounded-xl p-3 w-full"
              />
            </div>*/}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold"
            >
              {loading ? 'Saving...' : 'Save Learning'}
            </button>
          </form>
        </div>
        
        {/* Learning History */}
        <h2 className="text-3xl font-semibold mb-6">📜 Learning History</h2>
        <div className="space-y-6">
          {learningEntries.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No learning entries yet.</p>
          ) : (
            learningEntries.map((entry) => (
              <div key={entry.id} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700">
                <div className="flex justify-between mb-3">
                  <p className="text-sm text-gray-500">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => deleteLearningEntry(entry.id)}
                    className="text-red-400 hover:text-red-500 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>

                <p className="text-lg text-white mb-4"><strong>What I Learned:</strong> {entry.what_learned}</p>
                {entry.reflection && (
                  <p className="text-gray-300"><strong>Reflection:</strong> {entry.reflection}</p>
                )}


              </div>
            ))
          )}
        </div>

        {/* Learning History */}
        {/*<h2 className="text-3xl font-semibold mb-6">📜 Learning History</h2>
        <div className="space-y-6">
          {learningEntries.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No learning entries yet.</p>
          ) : (
            learningEntries.map((entry) => (
              <div key={entry.id} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700">
                <p className="text-sm text-gray-500 mb-3">
                  {new Date(entry.created_at).toLocaleDateString()}
                </p>
                <p className="text-lg text-white mb-4"><strong>What I Learned:</strong> {entry.what_learned}</p>
                {entry.reflection && (
                  <p className="text-gray-300"><strong>Reflection:</strong> {entry.reflection}</p>
                )}
                {/*{entry.photo_path && (
                  <img 
                    src={supabase.storage.from('learning-photos').getPublicUrl(entry.photo_path).data.publicUrl} 
                    alt="Learning photo" 
                    className="mt-4 rounded-xl max-h-96 w-full object-cover"
                  />
                )}*/}

                {/*{entry.photo_path && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Debug: {entry.photo_path}</p>
                    <img 
                      src={supabase.storage.from('learning-photos').getPublicUrl(entry.photo_path).data.publicUrl} 
                      alt="Learning photo" 
                      className="rounded-xl max-h-96 w-full object-cover border"
                    />
                  </div>
                )}*/}{/*
              </div>
            ))
          )}
        </div> */}
      </div>
    </ProtectedRoute>
  );
}