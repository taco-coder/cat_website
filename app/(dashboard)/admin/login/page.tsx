import Link from "next/link";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getValue(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = searchParams[key];
  return typeof value === "string" ? value : "";
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const error = getValue(sp, "error");
  const magic = getValue(sp, "magic");
  const next = getValue(sp, "next") || "/admin";

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Admin login
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Enter your secret phrase to generate a one-time magic link.
        </p>
      </div>

      {error === "phrase" ? (
        <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-300">
          Secret phrase is invalid.
        </p>
      ) : null}

      {error === "magic" ? (
        <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-300">
          Magic link is expired or invalid. Generate a new one.
        </p>
      ) : null}

      <form
        action="/api/admin/auth/start"
        method="post"
        className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <label className="block space-y-1 text-sm">
          <span className="text-zinc-700 dark:text-zinc-300">Secret phrase</span>
          <input
            required
            name="phrase"
            type="password"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </label>
        <input type="hidden" name="next" value={next} />
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Generate magic link
        </button>
      </form>

      {magic ? (
        <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            Magic link generated. Use it to complete login:
          </p>
          <Link
            href={`/api/admin/auth/magic?token=${encodeURIComponent(magic)}&next=${encodeURIComponent(next)}`}
            className="text-sm font-medium text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
          >
            Complete admin sign in
          </Link>
        </div>
      ) : null}
    </main>
  );
}
