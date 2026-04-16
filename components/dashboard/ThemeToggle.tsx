"use client";

import { useThemeToggle } from "@/components/dashboard/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeToggle();

  return (
    <button
      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
      onClick={toggleTheme}
      type="button"
    >
      Theme: {theme}
    </button>
  );
}
