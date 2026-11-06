# Search Fund & ETA Advisory Platform

A TypeScript monorepo for sourcing, reviewing, and evaluating business acquisition opportunities.

## Architecture

- `apps/web`: Next.js App Router frontend.
- `apps/api`: Express API, validation, authorization, business rules, and Mongoose persistence.
- MongoDB: server-side application database.
- `docs`: contributor, API, architecture, security, and milestone documentation.

The browser communicates with the API over HTTP. It never connects directly to MongoDB and never receives server-only secrets.

## Implemented product areas

- Authentication with Argon2id passwords and HttpOnly JWT sessions.
- Role-based access for investors, staff, approvers, and administrators.
- Business listing workflow and audit history.
- Approved-only investor discovery with search, filters, sorting, and pagination.
- Saved businesses and side-by-side comparison.
- Investor enquiries and internal enquiry management.
- Profile, password-change, preferences, verification, and password-reset flows.
- Development seed data for repeatable demonstrations.

Resend delivery, in-app notification delivery, and isolated database integration coverage require final configuration or follow-up work. Seller CRM, confidential documents, due diligence, deal pipeline, advanced analytics, and production operations are intentionally outside this milestone.

## Prerequisites

- Node.js 20 or newer.
- npm with workspace support.
- A development MongoDB instance or Atlas cluster.

## Install and run

```powershell
npm install
npm run dev:api
npm run dev:web
```

The frontend runs at `http://localhost:3000`; the API runs at `http://localhost:4000`.

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for environment configuration, seed data, administrator provisioning, verification, and troubleshooting.

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Railway API and Vercel frontend deployment instructions.

## Quality checks

See [docs/FEATURES.md](docs/FEATURES.md) for the canonical inventory of current routes, workflows, API groups, and intentionally unfinished areas.

```powershell
npm run typecheck
npm test
npm run build:web
npm run build:api
```

## Contributor guidance

Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/API.md](docs/API.md), [docs/SECURITY_REVIEW.md](docs/SECURITY_REVIEW.md), and [docs/REMAINING-WORK-PLAN.md](docs/REMAINING-WORK-PLAN.md) before changing cross-cutting behavior. Keep authorization and confidentiality rules enforced in the API, not only in the frontend.
