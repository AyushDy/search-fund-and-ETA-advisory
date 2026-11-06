# Security Review

Reviewed: 2026-11-06. This review covers the implemented milestone scope.

## Controls in place

- Public registration creates investors by default. Internal-role registration is controlled by `ALLOW_PUBLIC_INTERNAL_ROLES` and must remain disabled outside controlled development.
- Passwords use Argon2id and password hashes are excluded from normal queries and API responses.
- Access JWTs are short-lived and authentication uses HttpOnly cookies.
- Refresh tokens are opaque, rotated, stored only as SHA-256 hashes, and revoked on logout, password change, or password reset.
- Verification and reset tokens are cryptographically random, expiring, one-time values stored only as hashes.
- Login and authentication routes are rate-limited.
- CORS is restricted to `WEB_ORIGIN`; Helmet security headers are enabled.
- Zod validates request bodies and query parameters.
- Backend middleware enforces authentication and roles; frontend guards are not treated as authorization.
- Investor endpoints only query approved listings and use dedicated public serializers.
- Anonymized listings omit legal names, websites, internal notes, ownership, approval metadata, and audit history.
- Saved businesses and enquiries are scoped to the authenticated investor; internal enquiry fields are restricted to internal roles.
- Approval actions enforce status transitions and separation of duties.
- Listing workflow actions create audit records.
- Forgot-password and resend-verification responses are generic and do not reveal account existence.
- Resend credentials remain server-side and are never exposed to Next.js browser code.

## Verification evidence

- Root and workspace typechecks pass.
- Backend tests pass: 32 tests.
- Frontend production build passes.
- Live MongoDB smoke testing passed for seeded login, approved discovery, saved-business save/retrieve/remove, and enquiry creation.

## Remaining risk and gaps

- Full database-backed integration coverage still needs an isolated test database and complete listing lifecycle assertions.
- Resend delivery is not verified until `RESEND_API_KEY` and a verified `EMAIL_FROM` are configured.
- In-app notification persistence and delivery are not complete.
- The development-only public internal-role switch is intentionally unsafe for production and must remain disabled there.
- Seller CRM, confidential documents, due diligence, deal pipeline, analytics, deployment, monitoring, and backup controls are outside this review.
