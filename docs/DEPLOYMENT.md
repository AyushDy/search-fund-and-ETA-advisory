# Deployment Guide

This deployment uses MongoDB Atlas, Railway for the Express API, and Vercel for the Next.js frontend.

## 1. MongoDB Atlas

Create a production database and copy its connection string. Configure network access for the Railway service. Prefer Railway's outbound IP controls when available; otherwise use a tightly controlled temporary rule and strong credentials.

## 2. Railway API service

Create a Railway project from the repository and add a service connected to the repository.

Use the repository root as the service root.

Build command:

```text
npm ci && npm run build:api
```

Start command:

```text
npm start
```

Set the health check path to:

```text
/health
```

Railway supplies `PORT`; the API listens on that value when present.

### Railway variables

```text
NODE_ENV=production
MONGODB_URI=<MongoDB Atlas connection string>
JWT_ACCESS_SECRET=<long random secret>
JWT_REFRESH_SECRET=<long random secret>
WEB_ORIGIN=https://<frontend-domain>
COOKIE_SECURE=true
ALLOW_PUBLIC_INTERNAL_ROLES=false
DNS_SERVERS=1.1.1.1,8.8.8.8
APP_BASE_URL=https://<frontend-domain>
RESEND_API_KEY=<Resend API key>
EMAIL_FROM=<verified Resend sender>
ENQUIRY_NOTIFICATION_EMAILS=<internal notification recipients>
```

Do not set `NEXT_PUBLIC_` variables on Railway. Do not enable `ALLOW_PUBLIC_INTERNAL_ROLES` in production.

### Provision the first administrator

After the service is deployed, use a Railway shell or one-off command with temporary variables:

```powershell
$env:BOOTSTRAP_ADMIN_EMAIL="admin@example.com"
$env:BOOTSTRAP_ADMIN_PASSWORD="use-a-strong-password"
npm run bootstrap:admin --workspace=@search-fund/api
```

Remove the bootstrap variables after the command succeeds. The command refuses to overwrite an existing account.

Do not run `seed:demo` against the production database.

## 3. Vercel frontend

Create a Vercel project from the same repository. Use the repository root so npm workspaces resolve correctly.

Build command:

```text
npm run build:web
```

Set the framework to Next.js and use the default output directory.

### Vercel variables

```text
NEXT_PUBLIC_API_URL=https://<railway-api-domain>
```

Deploy the frontend and copy its HTTPS domain back into Railway's `WEB_ORIGIN` and `APP_BASE_URL` values. Redeploy the API after changing those values.

## 4. Post-deployment checks

Verify:

- `GET https://<railway-api-domain>/health` returns a successful response.
- The frontend loads over HTTPS.
- Investor registration and login work.
- Admin provisioning works.
- Staff listing creation and approval work.
- Approved investor discovery works.
- Saved businesses and enquiries work.
- Browser cookies are present and authentication survives navigation.

For Resend, verify the sender domain/address before testing email verification and password reset.
