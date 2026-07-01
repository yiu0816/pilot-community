'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <div className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:50px_50px] opacity-10"></div>
        
        <div className="max-w-4xl px-6 text-center z-10">
          <div className="mb-8">
            <span className="text-6xl">✈️</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tighter">
            Welcome to <span className="text-blue-400">PilotHub</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            The community for pilots — from students to captains.
          </p>
          
          {/**/}
          <h2 className="text-4xl font-bold text-center mb-16 text-white">About PilotHub</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-zinc-900 p-10 rounded-3xl border border-zinc-700 hover:border-blue-500 transition-all duration-300">
              <div className="text-6xl mb-8 group-hover:scale-110 transition-transform">🗣️</div>
              <h3 className="text-3xl font-semibold mb-4 text-white">Forum</h3>
              <p className="text-gray-400 text-lg">Discuss real aviation topics with pilots around the world.</p>
            </div>

            <div className="group bg-zinc-900 p-10 rounded-3xl border border-zinc-700 hover:border-blue-500 transition-all duration-300">
              <div className="text-6xl mb-8 group-hover:scale-110 transition-transform">📖</div>
              <h3 className="text-3xl font-semibold mb-4 text-white">Daily Learning</h3>
              <p className="text-gray-400 text-lg">Document your journey and learn from others' experiences.</p>
            </div>

            <div className="group bg-zinc-900 p-10 rounded-3xl border border-zinc-700 hover:border-blue-500 transition-all duration-300">
              <div className="text-6xl mb-8 group-hover:scale-110 transition-transform">📚</div>
              <h3 className="text-3xl font-semibold mb-4 text-white">Resources</h3>
              <p className="text-gray-400 text-lg">Curated links, handbooks, and study materials.</p>
            </div>
          </div>
        
          {/**/}
          <div className="max-w-6xl mx-auto px-6 py-5"></div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/forum" className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-2xl text-lg font-semibold transition">
              Join the Discussion
            </a>
            {showInstallButton && (
              <button
                onClick={handleInstallClick}
                className="border border-white/40 hover:bg-white/10 px-10 py-4 rounded-2xl text-lg font-semibold transition"
              >
                📱 Install App
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      
    </div>
  );
}