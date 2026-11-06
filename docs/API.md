# API Reference

All responses use `{ success, message, data }` on success and `{ success, message, error: { code } }` on failure. Browser authentication uses HttpOnly cookies and `credentials: include`.

## Health

`GET /health`

Returns `{ data: { status: "ok" } }` when the API process is running. It does not claim MongoDB readiness.

## Authentication

`POST /auth/register`

Creates an `INVESTOR` account by default. Body: `firstName`, `lastName`, `email`, `password`, and optional `role`. If `ALLOW_PUBLIC_INTERNAL_ROLES=true` is explicitly enabled in the backend environment, the role may be `INVESTOR`, `STAFF`, `APPROVER`, or `ADMIN`; otherwise any supplied role is ignored and the account is always an investor.

`POST /auth/login`

Body: `email`, `password`. Sets short-lived `accessToken` and refresh `refreshToken` cookies.

`POST /auth/refresh`

Rotates a valid refresh session and sets new cookies. Refresh token values are stored only as hashes.

`POST /auth/logout`

Revokes the refresh session and clears cookies.

`GET /auth/me`

Requires authentication. Returns the safe current-user profile.

## Account management

All account-management routes below require authentication and apply to every role. Email remains read-only; verification and password reset are handled through separate token endpoints.

`GET /users/me`

Returns the current safe profile, including optional phone, `emailVerified`, `phoneVerified`, and basic `notificationPreferences` flags.

`PATCH /users/me`

Updates only `firstName`, `lastName`, and optional `phone`. Email changes are reserved for a future verified flow.

`POST /users/me/password`

Body: `currentPassword`, `newPassword` (at least 12 characters). Verifies the current Argon2id password, stores a new Argon2id hash, and revokes all existing refresh sessions for the user.

`GET /users/me/preferences` and `PATCH /users/me/preferences`

Reads or updates the basic `{ email, inApp }` notification preference flags. These settings are stored now; an email provider and in-app notification delivery remain future work.

`POST /auth/internal-accounts`

Requires an authenticated `ADMIN`. Body: `firstName`, `lastName`, `email`, `password`, and `role` (`STAFF`, `APPROVER`, or `ADMIN`). Creates an active internal account using Argon2id hashing. It cannot create an `INVESTOR` account; public registration owns that role.

`POST /auth/verify-email`, `POST /auth/resend-verification`, `POST /auth/forgot-password`, and `POST /auth/reset-password`

These endpoints use one-time hashed expiring tokens. Resend and forgot-password responses are generic and do not reveal whether an email exists. Resetting a password revokes existing sessions. Resend delivery is performed only when server-side Resend configuration is present.

## Internal listing management

The following endpoints require an authenticated `STAFF`, `APPROVER`, or `ADMIN` unless noted:

- `POST /listings` creates a `DRAFT` listing.
- `GET /listings` returns paginated internal listings with status/industry/creator filters.
- `GET /listings/:id` returns internal listing data.
- `PATCH /listings/:id` updates allowed fields. Approved edits return to `UNDER_REVIEW`.
- `POST /listings/:id/submit-for-review` moves a draft or rejected listing to `UNDER_REVIEW`.
- `POST /listings/:id/approve` requires `APPROVER` or `ADMIN` and makes a listing investor-visible.
- `POST /listings/:id/reject` requires `APPROVER` or `ADMIN` and requires `{ reason }`.
- `POST /listings/:id/archive` retains the record while removing it from discovery.
- `GET /listings/:id/audit` returns internal audit history.

## Investor discovery

`GET /businesses`

Requires authentication. Returns approved listings only. Supported query parameters: `page`, `pageSize`, `search`, `industry`, `country`, `region`, `city`, `minRevenue`, `maxRevenue`, `minAskingPrice`, `maxAskingPrice`, and `sort` (`newest`, `revenue_desc`, `asking_asc`).

`GET /businesses/:id`

Requires authentication and returns a listing only when its status is `APPROVED`. Anonymized listings omit legal business identity and websites. Internal notes, audit data, ownership metadata, and approval data are never returned.

## Saved businesses and comparison

The following endpoints require an authenticated `INVESTOR`:

- `GET /saved-businesses` returns the investor's saved approved listings using investor-safe serialization.
- `POST /saved-businesses` accepts `{ "listingId": "..." }` and saves an approved listing.
- `DELETE /saved-businesses/:listingId` removes the investor's saved listing.

The web application exposes these saved listings at `/saved-businesses` and provides a side-by-side comparison at `/businesses/compare`.

## Investor enquiries

- `POST /enquiries` with `listingId` and optional `message`, `budget`, `experience`, and `reason` creates an investor enquiry for an approved listing.
- `GET /enquiries` returns only the authenticated investor's enquiries.
- `GET /internal/enquiries` returns the internal inbox for staff, approvers, and admins.
- `GET /internal/enquiries/:id` returns internal enquiry details.
- `PATCH /internal/enquiries/:id/status` validates workflow transitions.
- `PATCH /internal/enquiries/:id/assignment` is restricted to approvers and admins.
- `PATCH /internal/enquiries/:id/internal-note` updates internal-only notes.
- `PATCH /internal/enquiries/:id/contact-decision` records internal contact handling.
- `PATCH /internal/enquiries/:id/follow-up` records follow-up date and note.

Investor responses exclude assignments and internal notes. Enquiry statuses are `NEW`, `IN_REVIEW`, `CONTACTED`, `QUALIFIED`, `DECLINED`, and `CLOSED`.

## Common errors

- `400 VALIDATION_ERROR`: request fields or query parameters are invalid.
- `401 UNAUTHENTICATED`: authentication is missing, invalid, expired, or revoked.
- `403 FORBIDDEN`: the authenticated role is not permitted.
- `404 NOT_FOUND`: the resource is missing or not investor-visible.
- `409 INVALID_TRANSITION`: the requested workflow transition is not allowed.
- `409 ALREADY_SAVED`: the investor has already saved that listing.
