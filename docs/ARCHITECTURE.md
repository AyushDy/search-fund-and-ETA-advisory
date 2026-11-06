# Architecture

## System boundary

The platform is a monorepo containing two independently runnable applications:

- `apps/web` contains the Next.js frontend and browser-facing user experience.
- `apps/api` contains the Node.js and Express backend, including HTTP routes, validation, authorization, business logic, email integration, and persistence.
- MongoDB will store application data and will be accessed only by the backend through Mongoose.

## Responsibility separation

The frontend is responsible for rendering pages, collecting user input, calling the backend HTTP API, and presenting loading, success, empty, and error states. It must not connect directly to MongoDB or contain server-only credentials.

The backend is responsible for validating requests, enforcing authentication and authorization, applying business rules, shaping API responses, and reading or writing MongoDB data. The backend is the source of truth for security-sensitive behavior.

MongoDB is the persistence layer. Database credentials and connection details remain server-side. The frontend receives only data exposed through approved backend API responses.

## Monorepo structure

```text
apps/
  web/  # Next.js frontend workspace
  api/  # Express backend workspace
docs/   # Project documentation
```

The frontend and backend are independently runnable npm workspaces. Authentication, authorization, validation, business rules, and persistence remain backend responsibilities. The frontend consumes HTTP responses and does not connect to MongoDB.

## Authentication and visibility

Browser sessions use short-lived access JWTs and rotated refresh sessions in HttpOnly cookies. Refresh token values are stored only as hashes in MongoDB. Public registration creates investors by default; a development-only `ALLOW_PUBLIC_INTERNAL_ROLES=true` switch can expose internal roles for demonstrations. Production keeps that switch disabled and uses controlled administrator provisioning.

Email verification and password reset use cryptographically random, expiring, one-time tokens stored only as hashes. Resend is server-side and optional until its credentials are configured.

Business listings move through `DRAFT`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, and `ARCHIVED`. Only approved records are queried by investor discovery endpoints. A dedicated public serializer removes internal fields and withheld identity data before a response leaves the backend.

## Planned communication flow

```text
Browser -> Next.js frontend -> Express HTTP API -> Mongoose -> MongoDB
```

The frontend and backend remain independently runnable so that responsibilities, configuration, and verification can be managed separately. Saved businesses and enquiries are scoped to the authenticated investor or authorized internal role at the API boundary.
