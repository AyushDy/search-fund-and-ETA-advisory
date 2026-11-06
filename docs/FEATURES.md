# Current Feature Inventory

Reviewed: 2026-11-06.

This document lists the functionality currently represented in the codebase. API authorization remains the source of truth; frontend route guards are for navigation only.

## Platform foundation

- npm workspaces for `apps/web` and `apps/api`.
- Next.js App Router frontend with TypeScript and Tailwind/PostCSS.
- Express TypeScript API with strict checking.
- Mongoose MongoDB integration and graceful shutdown.
- Environment validation, CORS, Helmet, cookies, rate limiting, request logging, centralized errors, and health endpoint.
- Vitest/Supertest backend test setup.
- Development-only idempotent demo seed command.

## Users and authentication

- Roles: `INVESTOR`, `STAFF`, `APPROVER`, `ADMIN`.
- Public registration defaults to `INVESTOR`.
- Development-only `ALLOW_PUBLIC_INTERNAL_ROLES` switch for demonstration role registration.
- Controlled administrator bootstrap command.
- Admin-only internal account provisioning page and API.
- Argon2id password hashing.
- Short-lived JWT access sessions in HttpOnly cookies.
- Rotating refresh sessions stored as hashes in MongoDB.
- Login, logout, current-user lookup, and session revocation.
- Profile editing for permitted fields.
- Password change with current-password verification and session revocation.
- Basic email/in-app notification preferences.
- Hashed, expiring, one-time email verification tokens.
- Hashed, expiring, one-time password-reset tokens.
- Optional Resend delivery when configured.

## Business listings

- Listing statuses: `DRAFT`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `ARCHIVED`.
- Staff listing creation and internal retrieval.
- Listing updates with approved-listing return-to-review behavior.
- Submission for review.
- Approver/admin approval and rejection with reasons.
- Archival without deletion.
- Listing audit history.
- Internal listing fields separated from investor-facing fields.
- Optional revenue, EBITDA, SDE, and asking price values with currency and period.
- Anonymized versus identified business identity modes.
- Investor-safe serialization that removes internal and confidential fields.

## Investor discovery

- Approved-only business directory.
- Keyword search.
- Industry, country, region, and city filters.
- Revenue and asking-price ranges.
- Newest, revenue, and asking-price sorting.
- Pagination.
- Business detail pages.
- Loading, empty, error, and unavailable-data states.
- Missing financial values remain missing and are not converted to zero.

## Saved businesses and comparison

- Investor-scoped saved-business model.
- Save, list, and remove approved businesses.
- Duplicate-save protection.
- Saved businesses page.
- Side-by-side comparison page for saved businesses.
- Confidential identity rules remain applied through public serializers.

## Enquiries

- Investor enquiry creation for approved listings.
- Optional message, budget, experience, and reason fields.
- Duplicate active-enquiry protection.
- Investor enquiry history.
- Internal enquiry inbox.
- Internal enquiry detail view.
- Status transitions: `NEW`, `IN_REVIEW`, `CONTACTED`, `QUALIFIED`, `DECLINED`, `CLOSED`.
- Staff assignment with internal-role validation.
- Internal notes.
- Contact-handling decision.
- Follow-up date and note.
- Investor responses exclude internal assignments and notes.

## Current frontend routes

### Public and authentication

- `/`
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/verify-email`

### Investor

- `/dashboard`
- `/businesses`
- `/businesses/[id]`
- `/saved-businesses`
- `/businesses/compare`
- `/account/profile`
- `/account/preferences`
- `/account/enquiries`

### Internal

- `/staff`
- `/staff/listings`
- `/staff/listings/new`
- `/staff/listings/[id]`
- `/staff/enquiries`
- `/staff/enquiries/[id]`
- `/approver/review`
- `/admin/accounts`

## Current API groups

- Health: `GET /health`
- Authentication: `/auth/*`
- Account management: `/users/me*`
- Listing management: `/listings*`
- Investor discovery: `/businesses*`
- Saved businesses: `/saved-businesses*`
- Investor enquiries: `/enquiries*`
- Internal enquiries: `/internal/enquiries*`

See [API.md](API.md) for request and authorization details.

## Not currently implemented

- Resend delivery verification in a configured provider environment.
- In-app notification persistence and delivery.
- Complete isolated MongoDB integration test harness.
- Seller CRM and seller communication history.
- Confidential document sharing and document rooms.
- Due diligence, acquisition pipeline, and deal progression.
- Advanced analytics, production deployment, monitoring, backups, and disaster recovery automation.
