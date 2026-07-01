'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function Forum() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select(`
        *,
        post_comments (
          id,
          content,
          username,
          created_at
        )
      `)
      .order('created_at', { ascending: false });
    setPosts(data || []);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    // Get real username from profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user?.id)
      .single();

    await supabase.from('posts').insert({
      user_id: user?.id,
      username: profile?.username || user?.email?.split('@')[0],
      content: newPost,
    });

    setNewPost('');
    fetchPosts();
    setLoading(false);
  };

  const handleLike = async (postId: string) => {
    // Get current likes from state
    const currentPost = posts.find(p => p.id === postId);
    const currentLikes = currentPost?.likes || 0;

    const { error } = await supabase
      .from('posts')
      .update({ likes: currentLikes + 1 })
      .eq('id', postId);

    if (error) console.error("Like error:", error);
    
    fetchPosts(); // Refresh the list
  };
    

  const handleAddComment = async (postId: string) => {
    if (!newComment[postId]?.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('post_comments').insert({
      post_id: postId,
      user_id: user?.id,
      username: user?.email?.split('@')[0],
      content: newComment[postId],
    });

    setNewComment(prev => ({ ...prev, [postId]: '' }));
    fetchPosts();
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          🗣️ Aviation Forum
        </h1>

        {/* Create Post */}
        <form onSubmit={handleCreatePost} className="bg-zinc-900 p-6 rounded-2xl mb-10">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your question or experience with the community..."
            className="w-full p-4 bg-black border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none"
            rows={4}
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold"
          >
            {loading ? 'Posting...' : 'Post to Community'}
          </button>
        </form>

        {/* Posts List */}
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700">
              <div className="flex justify-between mb-4">
                <p className="text-sm text-gray-400">
                  Posted by{' '}
                  <a 
                    href={`/profile?user=${post.user_id}`} 
                    className="text-blue-400 hover:underline cursor-pointer"
                  >
                    {post.username}
                  </a>
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>

              <p className="text-lg text-white leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-6 border-t border-zinc-700 pt-4">
                <button 
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition"
                >
                  ❤️ <span>{post.likes || 0}</span>
                </button>

                <button 
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition"
                >
                  💬 {post.post_comments?.length || 0} Comments
                </button>
              </div>

              {/* Comments Section */}
              {expandedComments[post.id] && (
                <div className="mt-6 pt-6 border-t border-zinc-700">
                  {post.post_comments?.map((comment: any) => (
                    <div key={comment.id} className="bg-black/50 p-4 rounded-xl mb-3">
                      <p className="text-sm text-blue-400 mb-1">{comment.username}</p>
                      <p className="text-gray-300">{comment.content}</p>
                    </div>
                  ))}

                  {/* Add New Comment */}
                  <div className="flex gap-3 mt-4">
                    <input
                      type="text"
                      value={newComment[post.id] || ''}
                      onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                      placeholder="Write a comment..."
                      className="flex-1 bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="bg-blue-600 hover:bg-blue-700 px-6 rounded-xl font-medium"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}