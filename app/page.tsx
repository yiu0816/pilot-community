export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-bold mb-6">
          Welcome to <span className="text-blue-400">PilotHub</span>
        </h1>
        <p className="text-2xl text-gray-400 mb-12">
          The online community for aspiring, student, and professional pilots.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-700">
            <h3 className="text-2xl font-semibold mb-3">🗣️ Forum</h3>
            <p className="text-gray-400">Discuss aviation topics, ask questions, share experiences.</p>
          </div>
          <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-700">
            <h3 className="text-2xl font-semibold mb-3">📖 Daily Learning</h3>
            <p className="text-gray-400">Share what you learned today and reflect on your journey.</p>
          </div>
          <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-700">
            <h3 className="text-2xl font-semibold mb-3">📚 Resources</h3>
            <p className="text-gray-400">Useful links, documents, and study materials.</p>
          </div>
        </div>
      </div>
    </div>
  );
}