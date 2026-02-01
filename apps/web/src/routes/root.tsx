import { Link } from 'react-router'

export default function Root() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="space-y-8 px-4 text-center">
        {/* Phoenix Logo */}
        <div className="flex justify-center">
          <svg
            className="h-24 w-24 text-orange-500"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C12 2 7 6 7 11C7 13.7614 9.23858 16 12 16C14.7614 16 17 13.7614 17 11C17 6 12 2 12 2Z" />
            <path d="M12 16C9.5 16 7.5 17.5 7.5 19.5C7.5 20.8807 8.61929 22 10 22H14C15.3807 22 16.5 20.8807 16.5 19.5C16.5 17.5 14.5 16 12 16Z" />
            <path d="M9 11C9 11 8 9 8 7.5C8 6.11929 9.11929 5 10.5 5C10.5 5 9 7 9 8.5C9 9.5 9.5 10.5 9.5 10.5" />
            <path d="M15 11C15 11 16 9 16 7.5C16 6.11929 14.8807 5 13.5 5C13.5 5 15 7 15 8.5C15 9.5 14.5 10.5 14.5 10.5" />
          </svg>
        </div>

        {/* Project Name */}
        <div>
          <h1 className="mb-4 text-6xl font-bold text-white">Phoenix</h1>
          <p className="text-2xl text-slate-400">Design System Starter</p>
        </div>

        {/* Description */}
        <p className="mx-auto max-w-2xl leading-relaxed text-slate-300">
          A production-ready design system monorepo built with React,
          TypeScript, Tailwind CSS 4, and Radix UI. Designed for AI agents to
          add, modify, and extend components without human hand-holding.
        </p>

        {/* Action Links */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="http://localhost:6006"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-orange-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
          >
            View Storybook
          </a>
          <Link
            to="/components"
            className="rounded-lg bg-slate-700 px-8 py-3 font-semibold text-white transition-colors hover:bg-slate-600"
          >
            Browse Components
          </Link>
        </div>

        {/* Feature List */}
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 text-left sm:grid-cols-3">
          <div className="rounded-lg bg-slate-800 p-6">
            <h3 className="mb-2 text-lg font-semibold text-white">
              Monorepo Structure
            </h3>
            <p className="text-sm text-slate-400">
              pnpm workspaces with Turborepo orchestration for optimal build
              performance.
            </p>
          </div>
          <div className="rounded-lg bg-slate-800 p-6">
            <h3 className="mb-2 text-lg font-semibold text-white">
              Design Tokens
            </h3>
            <p className="text-sm text-slate-400">
              Style Dictionary pipeline generating Tailwind CSS tokens from
              source definitions.
            </p>
          </div>
          <div className="rounded-lg bg-slate-800 p-6">
            <h3 className="mb-2 text-lg font-semibold text-white">AI-Ready</h3>
            <p className="text-sm text-slate-400">
              Explicit patterns and rules enforced via ESLint for consistent AI
              modifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
