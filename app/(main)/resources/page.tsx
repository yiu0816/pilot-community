export default function Resources() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">📚 Useful Resources</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-700">
          <h2 className="text-2xl font-semibold mb-4">✈️ Aviation Knowledge</h2>
          <ul className="space-y-3 text-gray-300">
            <li>• FAA Handbooks</li>
            <li>• EASA Regulations</li>
            <li>• ICAO Documents</li>
            <li>• ATPL Question Banks</li>
          </ul>
        </div>

        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-700">
          <h2 className="text-2xl font-semibold mb-4">🔗 Important Links</h2>
          <ul className="space-y-3 text-blue-400">
            <li><a href="#" className="hover:underline">Skybrary</a></li>
            <li><a href="#" className="hover:underline">Aviation Weather</a></li>
            <li><a href="#" className="hover:underline">Flight Training Resources</a></li>
          </ul>
        </div>
      </div>

      <p className="text-center text-gray-500 mt-16">
        More useful links and documents coming soon...
      </p>
    </div>
  );
}