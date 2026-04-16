import Link from "next/link";
import { cookies } from "next/headers";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("demo_session")?.value === "1";

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex flex-col gap-1">
            <Link
              className="text-sm font-semibold text-zinc-900 dark:text-zinc-50"
              href="/issues"
            >
              Issue tracker lab
            </Link>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {session
                ? "Signed in as demo user (cookie-based gate)."
                : "No session cookie (unexpected inside /issues)."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-300"
              href="/"
            >
              Home
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-6 py-8">{children}</div>
    </div>
  );
}
