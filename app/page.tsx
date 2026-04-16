import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-8 px-6 py-16">
      <div className="space-y-3">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Next.js + TypeScript lab
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Issue tracker starter
        </h1>
        <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
          This app is intentionally small but structured like production work:
          App Router layouts, Server Components that call Route Handlers,
          client &quot;islands&quot; for interactivity, Zod + server actions for
          forms, URL-driven filters, and middleware that mimics an auth gate.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <a
          className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          href="/api/auth/demo?next=/issues"
        >
          Enter demo session
        </a>
        <Link
          className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          href="https://nextjs.org/docs"
          rel="noreferrer"
          target="_blank"
        >
          Next.js docs
        </Link>
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Use a full navigation (anchor) for the demo session so the Set-Cookie
        response from the Route Handler applies before you land on{" "}
        <code className="rounded bg-zinc-200 px-1 py-0.5 text-xs dark:bg-zinc-800">
          /issues
        </code>
        .
      </p>
    </main>
  );
}
