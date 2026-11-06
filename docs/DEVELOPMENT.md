# Development Guide

This guide is for contributors setting up the platform, running checks, and understanding environment-dependent features.

## Prerequisites

- Node.js 20 or newer.
- npm with workspace support.
- MongoDB local or MongoDB Atlas development database.

## Install

Run from the repository root:

```powershell
npm install
```

Create `apps/api/.env` from `apps/api/.env.example` and `apps/web/.env.local` from `apps/web/.env.example`.

### Backend configuration

```text
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/search-fund-platform
JWT_ACCESS_SECRET=replace-with-at-least-32-random-characters
JWT_REFRESH_SECRET=replace-with-at-least-32-random-characters
WEB_ORIGIN=http://localhost:3000
DNS_SERVERS=1.1.1.1,8.8.8.8
ALLOW_PUBLIC_INTERNAL_ROLES=false
RESEND_API_KEY=
EMAIL_FROM=
APP_BASE_URL=http://localhost:3000
ENQUIRY_NOTIFICATION_EMAILS=
COOKIE_SECURE=false
```

`MONGODB_URI`, JWT secrets, Resend credentials, and internal notification recipients are server-only. Never prefix them with `NEXT_PUBLIC_`. Production requires MongoDB and JWT secrets; development fallback values are not accepted as production configuration.

`ALLOW_PUBLIC_INTERNAL_ROLES` must remain `false` outside a controlled development environment. When enabled, the public registration form can create internal roles for demonstration purposes. The normal production path is administrator provisioning.

Resend verification and password-reset delivery requires both `RESEND_API_KEY` and a verified `EMAIL_FROM` address. Without them, token records are persisted but no email is sent. No credentials or raw tokens are returned to the browser or written to logs.

### Frontend configuration

```text
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Only the API base URL belongs in frontend-exposed configuration.

## Run the applications

Use separate terminals from the repository root:

```powershell
npm run dev:api
npm run dev:web
```

The API health endpoint is `http://localhost:4000/health`; the web application is `http://localhost:3000`.

## Provision accounts

The first administrator is created through a controlled server-side command:

```powershell
$env:BOOTSTRAP_ADMIN_EMAIL="admin@example.com"
$env:BOOTSTRAP_ADMIN_PASSWORD="use-a-long-random-password"
npm run bootstrap:admin --workspace=@search-fund/api
```

The command refuses to overwrite an existing account. After signing in, an administrator can use `/admin/accounts` to provision staff, approver, or additional administrator accounts.

## Seed repeatable demonstration data

The seed command is for non-production environments only:

```powershell
$env:DEMO_PASSWORD="DemoPassword123!"
npm run seed:demo --workspace=@search-fund/api
```

It creates or preserves demo staff, approver, and investor accounts plus three approved business listings. It refuses to run when `NODE_ENV=production`.

## Verification commands

```powershell
npm run typecheck
npm test
npm run build:web
npm run build:api
```

Backend tests do not require production credentials. Live MongoDB smoke checks should use a dedicated development database and must never target production data.

## Troubleshooting

- API startup errors: verify `MONGODB_URI`, Atlas availability, IP allowlists, and DNS settings.
- Browser CORS errors: ensure `WEB_ORIGIN` exactly matches the frontend origin.
- Email delivery disabled: configure `RESEND_API_KEY` and `EMAIL_FROM`, then restart the API.
- Stale authentication: sign out and clear cookies for the local frontend/API origins.
