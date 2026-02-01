import { Link } from 'react-router';

export default function Components() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Components</h1>
        <p className="text-slate-400 mb-8">
          Components will appear here as they are built in Phase 3.
        </p>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
          <ul className="space-y-2 text-slate-300">
            <li>• Button</li>
            <li>• Input</li>
            <li>• Textarea</li>
            <li>• Select</li>
            <li>• Checkbox</li>
            <li>• Radio</li>
            <li>• Dialog</li>
            <li>• And more...</li>
          </ul>
        </div>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
