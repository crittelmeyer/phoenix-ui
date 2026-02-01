import { Link } from 'react-router'

export default function Components() {
  return (
    <div className="min-h-screen bg-slate-900 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">Components</h1>
        <p className="mb-8 text-slate-400">
          Components will appear here as they are built in Phase 3.
        </p>

        <div className="rounded-lg bg-slate-800 p-6">
          <h2 className="mb-4 text-xl font-semibold">Coming Soon</h2>
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
            className="inline-block rounded-lg bg-slate-700 px-6 py-2 font-semibold text-white transition-colors hover:bg-slate-600"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
