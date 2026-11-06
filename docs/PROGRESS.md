# Implementation Progress

Status reviewed: 2026-11-06.

## Milestone estimate

Approximately 50% of the planned product scope is implemented. Core technical foundation, authentication, business sourcing, investor discovery, saved businesses, comparison, enquiries, and account foundations are present. Email delivery and full integration coverage remain incomplete.

## Implemented

- Next.js, Express, TypeScript, npm workspaces, Tailwind/PostCSS, Mongoose, Zod, Vitest, and Supertest.
- Environment validation, CORS, Helmet, cookies, rate limiting, request logging, centralized errors, health endpoint, and graceful MongoDB shutdown.
- User/session models, Argon2id hashing, JWT access sessions, hashed rotating refresh tokens, role authorization, admin bootstrap, and development role registration switch.
- Hashed expiring email-token model and verification/reset API/UI flows.
- Profile editing, password change, and basic notification preference storage.
- Business listing creation, retrieval, update, review submission, approval, rejection, archival, and audit history.
- Investor-safe approved listing directory/detail APIs with search, filters, sorting, pagination, and anonymized identity handling.
- Saved business model and investor-scoped save/list/remove APIs.
- Comparison page for saved approved businesses.
- Investor enquiry creation/history and internal enquiry inbox/status/assignment/note/contact/follow-up APIs.
- Responsive frontend routes for public, investor, staff, approver, admin, account, saved-business, comparison, and enquiry workflows.
- Idempotent non-production demo seed command with three accounts and three approved listings.

## Verification

Passed:

- `npm run typecheck`
- `npm test` with 32 backend tests passing.
- `npm run build:web`
- `npm run build:api`
- Live MongoDB smoke test: seeded investor login, approved listing discovery, save/retrieve/remove, and enquiry creation.

## Incomplete or environment-dependent

- Full listing lifecycle integration coverage and isolated test-database harness.
- Complete staff edit/submit/archive and approver review action UI verification.
- Resend email delivery, because provider credentials and a verified sender are not configured.
- In-app notification persistence and delivery.
- Email verification/reset browser flows against a real delivered message.

## Intentional scope boundary

The following remain outside this milestone: seller CRM, seller communications, confidential document sharing, document rooms, due diligence, acquisition pipeline, deal progression, advanced analytics, production deployment, monitoring, backups, and disaster recovery automation.
