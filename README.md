# Issue tracker lab

Next.js 15 (App Router) + TypeScript learning project oriented toward patterns you will see in full stack interviews.

## Quick start

```bash
cd issue-tracker-lab
npm install
cp .env.example .env.local   # optional; helps server-side fetch to /api/* during dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), click **Enter demo session** (full page navigation so the auth cookie is set), then explore `/issues`.

## What to study in this repo

| Area | Where |
|------|--------|
| Middleware “auth gate” | [`middleware.ts`](middleware.ts), demo cookie in [`app/api/auth/demo/route.ts`](app/api/auth/demo/route.ts) |
| Route Handlers (REST-shaped) | [`app/api/issues/route.ts`](app/api/issues/route.ts), [`app/api/issues/[id]/route.ts`](app/api/issues/[id]/route.ts) |
| Server Component `fetch` | [`app/(dashboard)/issues/page.tsx`](app/(dashboard)/issues/page.tsx), detail in [`app/(dashboard)/issues/[id]/page.tsx`](app/(dashboard)/issues/[id]/page.tsx) |
| Client island + TanStack Query | [`components/issues/IssueStatsClient.tsx`](components/issues/IssueStatsClient.tsx) |
| URL-driven filters | [`components/issues/IssueFilters.tsx`](components/issues/IssueFilters.tsx) |
| Zod + server actions + `useActionState` | [`app/(dashboard)/issues/actions.ts`](app/(dashboard)/issues/actions.ts), [`components/issues/IssueForm.tsx`](components/issues/IssueForm.tsx) |
| Loading / error UI | `loading.tsx` and `error.tsx` next to routes under `app/(dashboard)/issues/` |
| React Context (theme toggle) | [`components/dashboard/theme-context.tsx`](components/dashboard/theme-context.tsx) |

## Data model

Issues live in an in-memory store ([`lib/issues-store.ts`](lib/issues-store.ts)) so you can focus on React/Next patterns without a database. Data resets when the dev server restarts (and can diverge per serverless instance in production—this is intentional for a lab).

## Environment

If server-side `fetch` to your API fails during development, set `NEXT_PUBLIC_APP_URL` in `.env.local` to match your dev server origin (see [`.env.example`](.env.example)).
