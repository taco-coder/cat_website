# Cat Social MVP Backlog

This backlog turns the product plan into vertical implementation slices.

## Milestone 1 - Public feed and content model

### T1 - Public Feed Page
- Build hero banner with short cat bio and chronological feed (newest first).
- Implement incremental "load more" feed behavior from API.
- **Acceptance:** hero is visible immediately; initial posts render server-side; additional posts load from API.

### T2 - Post Data Model and Storage
- Add post model (`id`, `imageUrl`, `caption`, `createdAt`, `heartCount`).
- Introduce storage abstraction to support object storage migration.
- **Acceptance:** posts can be listed in chronological order and include caption + heart count.

### T3 - Admin Auth Baseline
- Implement secret phrase + magic link flow for admin dashboard.
- **Acceptance:** non-admin access denied; valid phrase + one-time link grants dashboard session.

### T4 - Admin Post CRUD
- Upload image + caption, edit captions, delete posts.
- **Acceptance:** post changes are reflected in feed and logged in admin activity stream.

## Milestone 2 - Anonymous interaction and moderation

### T5 - Anonymous Likes
- Add count-only heart endpoint with rate limiter hooks.
- **Acceptance:** anonymous likes increment count; no user identity is exposed.

### T6 - Comment Pipeline
- Implement `pending`, `approved`, and `rejected` moderation states.
- **Acceptance:** no comment appears publicly before moderation outcome.

### T7 - Safety Filters
- Profanity/abuse checks, spam scoring, and malicious content detection.
- Block links and obfuscated links in comments.
- **Acceptance:** harmful content rejects; uncertain content queues for review.

### T8 - Moderation Queue UI
- Admin queue for review and moderation actions.
- **Acceptance:** admin can approve/reject/delete with decision reason.

## Milestone 3 - Abuse resistance and observability

### T9 - Adaptive Risk Scoring
- Combine session, IP, and behavior signals into risk tiers.
- **Acceptance:** every interaction receives risk tier used by moderation policies.

### T10 - Unified Cooldown Controls
- Unified throttle across likes/comments with soft challenge on rate violations.
- **Acceptance:** rate bursts receive retry-later response; no hard block for pure velocity events.

### T11 - Hard Reject Policy
- Reject spam/malicious/offensive submissions.
- **Acceptance:** harmful requests cannot publish and are logged.

### T12 - Notifications and Weekly Digest
- Admin-only operational notifications and weekly metrics digest.
- **Acceptance:** pending queue counts and anomaly alerts are visible to admin.

### T13 - Moderation Audit Logs
- Immutable event logs for moderation decisions and safety actions.
- **Acceptance:** each decision has timestamp, action, and supporting signal summary.

### T14 - Performance Baseline
- Image optimization + lazy loading + CDN strategy.
- **Acceptance:** page remains responsive on mobile; feed loads progressively.
