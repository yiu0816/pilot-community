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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero-bg h-screen flex items-center justify-center text-center">
        <div className="max-w-4xl px-6">
          <h1 className="text-7xl font-bold mb-6 tracking-tight">
            Welcome to <span className="text-blue-400">PilotHub</span>
          </h1>
          <p className="text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Connecting pilots, student pilots, and aviation enthusiasts worldwide.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/forum" className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-xl text-lg font-semibold transition">
              Join the Discussion
            </a>
            {showInstallButton && (
              <button
                onClick={handleInstallClick}
                className="border border-white/50 hover:bg-white/10 px-10 py-4 rounded-xl text-lg font-semibold transition"
              >
                📱 Install App
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Built for Pilots</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-900 p-8 rounded-3xl card-hover border border-zinc-700">
            <div className="text-5xl mb-6">🗣️</div>
            <h3 className="text-2xl font-semibold mb-3 text-white">Forum</h3>
            <p className="text-gray-400">Discuss aviation topics, ask questions, share experiences.</p>
          </div>
          <div className="bg-zinc-900 p-8 rounded-3xl card-hover border border-zinc-700">
            <div className="text-5xl mb-6">📖</div>
            <h3 className="text-2xl font-semibold mb-3 text-white">Daily Learning</h3>
            <p className="text-gray-400">Share what you learned today and reflect on your journey.</p>
          </div>
          <div className="bg-zinc-900 p-8 rounded-3xl card-hover border border-zinc-700">
            <div className="text-5xl mb-6">📚</div>
            <h3 className="text-2xl font-semibold mb-3 text-white">Resources</h3>
            <p className="text-gray-400">Useful links, documents, and study materials.</p>
          </div>
        </div>
      </div>
    </div>
  );
}