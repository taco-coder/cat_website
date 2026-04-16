# Performance Baseline

## Current baseline

- Feed loads first page server-side with a small payload (`limit=3`).
- Additional content loads incrementally through cursor pagination.
- Feed images use lazy loading in the client feed list.

## MVP targets

- Home page first meaningful paint under ~2s on modern mobile network.
- "Load more" response under ~600ms in local development.
- Admin moderation view stays responsive with 100 in-memory comments.

## Manual check list

1. Load `/` in mobile viewport and verify hero + first posts render immediately.
2. Click "Load more" repeatedly and confirm no layout shift spikes.
3. Open `/admin` and verify moderation queue actions return quickly.
4. Verify weekly digest endpoint responds without timeouts.
