# PRODUCT REQUIREMENTS DOCUMENT (PRD)

# Search Fund & ETA Advisory Platform

**Product:** Search Fund & ETA Advisory Platform  
**Document version:** 2.0  
**Date:** 6 November 2026  
**Status:** Updated PRD — aligned with current implementation  
**Technology:** Next.js, Node.js, Express.js, MongoDB  
**Development approach:** Greenfield project, autonomous Copilot-assisted implementation

## Document control

This document is the product requirements source of truth. It describes the intended product behavior and records implementation status without removing future requirements.

Requirement status labels used below:

- **Implemented:** Present in source code and covered by automated checks or live smoke verification.
- **Implemented — verification pending:** Present in source code but missing complete integration or external-service verification.
- **Partial:** Some behavior exists, but the complete requirement is not yet available.
- **Planned:** Requirement is retained for the milestone but is not implemented.

The current implementation inventory is maintained in [docs/FEATURES.md](docs/FEATURES.md). The engineering gap analysis is maintained in [docs/REMAINING-WORK-PLAN.md](docs/REMAINING-WORK-PLAN.md).

---

# 1. Executive Summary

## 1.1 Product overview

The Search Fund & ETA Advisory Platform is a web application designed to support the discovery, evaluation, and coordination of business acquisition opportunities within the Search Fund and Entrepreneurship Through Acquisition (ETA) ecosystem.

The platform connects external investors and acquisition searchers with internally sourced business opportunities.

Its initial functionality provides:

- Business opportunity discovery.
- Investor account management.
- Business listing management.
- Internal listing approval.
- Financial and operational information presentation.
- Saved acquisition opportunities.
- Side-by-side business comparison.
- Investor enquiries.
- Internal enquiry management.
- Controlled communication and progression toward acquisition discussions.

The longer-term vision is to develop the platform into a broader acquisition sourcing and transaction coordination system, including seller relationship management, confidential information sharing, due diligence, and acquisition pipeline management.

## 1.2 Product purpose

The platform aims to reduce fragmentation in the acquisition process by providing a central environment where investors can discover opportunities and internal staff can manage business sourcing and investor engagement.

The product must prioritize:

- Usability.
- Data accuracy.
- Confidentiality.
- Clear acquisition-related workflows.
- Controlled access to business information.
- Traceable internal decisions.
- Secure investor and staff interactions.

## 1.3 Product positioning

This is an acquisition-oriented platform.

It is not:

- A stock market investment platform.
- A mutual fund or ETF marketplace.
- A general-purpose retail investment application.
- A public marketplace where every business listing is automatically visible.
- A platform that guarantees the quality, profitability, or acquisition suitability of listed businesses.

---

# 2. Product Context

## 2.1 Background

Search fund entrepreneurs and ETA investors seek existing businesses that may be suitable for acquisition.

The acquisition process involves:

1. Identifying potential businesses.
2. Collecting business and financial information.
3. Evaluating acquisition suitability.
4. Engaging with relevant stakeholders.
5. Requesting additional information.
6. Obtaining approval to progress.
7. Conducting preliminary and confirmatory due diligence.
8. Negotiating and completing an acquisition.

The platform initially focuses on the opportunity discovery and investor engagement stages.

The later roadmap expands toward sourcing CRM, acquisition coordination, and due diligence.

## 2.2 Problem statement

Potential acquisition opportunities and investor engagement may be managed through disconnected tools, documents, spreadsheets, emails, and manual communication.

This can create difficulties in:

- Organizing acquisition opportunities.
- Presenting business information consistently.
- Controlling access to confidential information.
- Tracking investor interest.
- Managing enquiries.
- Maintaining internal workflow visibility.
- Comparing acquisition opportunities.
- Preserving an audit trail.

The platform should provide a structured environment for these activities.

## 2.3 Product goals

The platform should:

1. Provide investors with access to approved acquisition opportunities.
2. Enable structured business information presentation.
3. Support internal business sourcing and listing management.
4. Allow investors to save and compare opportunities.
5. Provide a controlled investor enquiry process.
6. Enable staff to manage enquiries and follow-ups.
7. Protect confidential business and investor information.
8. Establish a foundation for future acquisition management functionality.

---

# 3. Users and Roles

## 3.1 Investor

Investors are external platform users.

They should be able to:

- Register and authenticate.
- Verify their email.
- Manage their profile.
- Browse approved businesses.
- Search and filter opportunities.
- View available business information.
- Save opportunities.
- Compare businesses.
- Submit enquiries.
- Track their enquiries.
- Manage account preferences.

Investors must not access internal staff records or confidential information without explicit authorization.

## 3.2 Staff / Searcher

Staff and searchers are internal platform users responsible for sourcing and managing business opportunities.

They should be able to:

- Create business listings.
- Edit business information.
- Save listings as drafts.
- Submit listings for review.
- View listing workflow status.
- Manage investor enquiries.
- Add internal notes.
- Assign enquiries.
- Schedule follow-ups.
- Manage investor communication.
- Maintain sourcing records.

Staff permissions must be restricted according to their assigned role.

## 3.3 Listing Approver / Manager

Approvers are internal users authorized to approve or reject business listings.

They should be able to:

- View the review queue.
- Review submitted listings.
- Inspect internal listing information.
- Preview investor-facing listings.
- Approve listings.
- Reject listings with a reason.
- Review relevant listing history.

Approval authority should be restricted to designated managers, approvers, or administrators.

## 3.4 Administrator

Administrators manage platform-level configuration and privileged operations.

Responsibilities include:

- Internal account provisioning.
- Role management.
- Access control.
- Administrative configuration.
- Controlled management of platform users.

In the production operating model, public registration must never grant administrator or privileged internal roles. A development-only `ALLOW_PUBLIC_INTERNAL_ROLES` switch exists for seeded demonstrations and must remain disabled outside controlled development.

## 3.5 Role hierarchy

Recommended roles:

| Role | Primary responsibility |
|---|---|
| Investor | Discover and enquire about acquisition opportunities |
| Staff/Searcher | Source and manage business opportunities |
| Approver/Manager | Approve business listings and controlled progression |
| Admin | Platform administration and privileged access |

A small internal team may combine Staff and Approver permissions, but approval actions must remain restricted.

---

# 4. Scope and Development Milestones

## 4.1 Overall project scope

The project is divided into two major development milestones.

The first 50% establishes a functioning business opportunity discovery and investor engagement platform.

The remaining 50% develops deeper acquisition sourcing, seller relationship management, confidential information handling, and transaction coordination.

## 4.2 Current implementation status

The current implementation includes:

- Monorepo foundation.
- Next.js frontend.
- Express backend.
- MongoDB integration.
- Authentication and session management.
- Role-based authorization.
- Business listing lifecycle.
- Investor discovery.
- Saved businesses.
- Comparison.
- Enquiries.
- Internal enquiry workflow.
- Investor account foundations.

The implementation progress document reports approximately 50% completion of planned product scope. This is a planning estimate, not a statement that every workflow has been fully verified. Current automated checks and live smoke coverage are recorded in [docs/PROGRESS.md](docs/PROGRESS.md).

## 4.3 First 50% — Opportunity discovery and investor engagement

The first milestone includes:

| Workstream | Project allocation |
|---|---:|
| Technical foundation | 8% |
| Authentication and account management | 7% |
| Business sourcing and listing management | 11% |
| Investor discovery and evaluation | 8% |
| Saved businesses and comparison | 5% |
| Enquiries and internal enquiry management | 7% |
| Email and essential notifications | 4% |
| **Total** | **50%** |

These percentages represent planned effort. Existing implementation must be reconciled against actual functionality rather than counted twice.

### First-half completion requirements

The first milestone is considered complete when:

- Investors can register, authenticate, and manage accounts.
- Staff can create and manage business listings.
- Authorized approvers can approve listings.
- Investors can discover approved opportunities.
- Investors can save businesses.
- Investors can compare opportunities.
- Investors can submit enquiries.
- Staff can manage enquiries.
- Essential notifications work when configured.
- Security and integration tests cover critical workflows.

## 4.4 Remaining 50% — Acquisition management and transaction coordination

The second milestone includes:

- Seller CRM.
- Seller communication history.
- Advanced sourcing workflows.
- Confidential information reveal.
- Document management.
- Secure document sharing.
- Due-diligence coordination.
- Acquisition pipeline.
- Deal progression.
- Advanced analytics.
- Production deployment.
- Monitoring and backup infrastructure.

This milestone is intentionally reserved and must not be implemented during the first-half completion work.

---

# 5. Functional Requirements — First 50%

# 5.1 Authentication and account management

## FR-AUTH-01: Investor registration

**Status: Implemented — development role switch documented below.**

The platform shall allow external investors to register using the supported authentication mechanism.

Requirements:

- Validate required registration fields.
- Prevent duplicate accounts.
- Hash passwords using Argon2id.
- Create investor accounts by default.
- Prevent public creation of privileged internal roles by default.
- Permit internal roles through public registration only when the explicit development-only `ALLOW_PUBLIC_INTERNAL_ROLES=true` switch is enabled.
- Keep the switch disabled in production; the normal production path is administrator provisioning.
- Provide clear registration errors.
- Apply rate limiting to sensitive authentication endpoints.

## FR-AUTH-02: Login and logout

**Status: Implemented.**

Users shall be able to authenticate and terminate their sessions.

Requirements:

- Validate credentials.
- Create authenticated sessions.
- Use secure cookie-based authentication.
- Support logout.
- Revoke sessions appropriately.
- Handle expired sessions.

## FR-AUTH-03: Session security

**Status: Implemented.**

The platform shall implement:

- Short-lived access tokens.
- HttpOnly authentication cookies.
- Refresh token rotation.
- Hashed refresh token storage.
- Session revocation.
- Password-change invalidation.
- Password-reset invalidation.

## FR-AUTH-04: Email verification

**Status: Implemented — Resend delivery verification pending.**

The platform shall support email verification.

Requirements:

- Generate secure verification tokens.
- Store token hashes.
- Set token expiration.
- Send a verification email when Resend credentials and a verified sender are configured.
- Persist the account and token safely when email delivery is unavailable; do not claim delivery.
- Verify the token.
- Mark email as verified.
- Prevent token reuse.
- Support resending verification emails.
- Rate-limit resend requests.

## FR-AUTH-05: Password reset

**Status: Implemented — Resend delivery verification pending.**

The platform shall support password recovery.

Requirements:

- Forgot-password form.
- Password reset request.
- Secure reset token.
- Token expiration.
- One-time token usage.
- Password update.
- Session invalidation.
- Generic responses that do not reveal whether an account exists.

## FR-AUTH-06: Profile management

**Status: Implemented.**

Investors shall be able to:

- View their profile.
- Update permitted profile fields.
- View account verification status.
- View account creation information.

Users must not be able to change their role or privileged permissions through profile updates.

## FR-AUTH-07: Password change

**Status: Implemented.**

Authenticated users shall be able to change their password.

Requirements:

- Validate the current password.
- Validate the new password.
- Hash the new password.
- Invalidate existing sessions according to the security policy.

## FR-AUTH-08: Account preferences

**Status: Implemented — delivery behavior pending.**

Users shall be able to manage basic notification preferences.

The initial implementation should support essential account and enquiry notification preferences without building a complex preference engine.

---

# 5.2 Business listing management

## FR-BIZ-01: Business listing creation

**Status: Implemented — browser workflow verification pending.**

Authorized internal staff shall be able to create business listings.

Listings may contain:

### General information

- Business name, when available.
- Business description.
- Industry.
- Sub-industry.
- Location.
- Years operating.
- Employee count or range.

### Products and services

- Products.
- Services.
- Business model.
- Operational overview.

### Financial information

- Revenue.
- EBITDA.
- Seller's Discretionary Earnings (SDE).
- Asking price, where available.
- Currency.
- Financial reporting period.
- Relevant notes about financial information.

### Transaction information

- Seller-related information where appropriate.
- Transaction context.
- Additional acquisition information.

Fields should be optional where the information may not be available.

The platform must not invent missing financial values.

## FR-BIZ-02: Listing drafts

**Status: Implemented.**

Staff shall be able to save incomplete listings as drafts.

Drafts must remain unavailable to investors.

## FR-BIZ-03: Listing editing

**Status: Implemented — complete browser action verification pending.**

Authorized staff shall be able to edit listings according to permissions and listing status.

Editing an approved listing must trigger the appropriate review workflow.

## FR-BIZ-04: Listing submission

**Status: Implemented — complete browser action verification pending.**

Staff shall be able to submit a listing for review.

Submission must:

- Validate required information.
- Change the listing status.
- Record the action.
- Create an audit record.

## FR-BIZ-05: Listing approval

**Status: Implemented — complete browser action verification pending.**

Authorized approvers shall be able to approve submitted listings.

Approval must:

- Enforce valid status transitions.
- Record the approver.
- Record the timestamp.
- Create an audit record.
- Make the listing available to investors only after approval.

## FR-BIZ-06: Listing rejection

**Status: Implemented — complete browser action verification pending.**

Approvers shall be able to reject submitted listings.

Requirements:

- A rejection reason is required.
- The reason is recorded internally.
- The listing returns to an appropriate internal state.
- The action is recorded in audit history.

## FR-BIZ-07: Listing archival

**Status: Implemented — complete browser action verification pending.**

Authorized staff shall be able to archive eligible listings.

Archived listings shall not appear in normal investor discovery.

## FR-BIZ-08: Listing status

**Status: Implemented.**

Recommended listing statuses:

- `DRAFT`
- `UNDER_REVIEW`
- `APPROVED`
- `REJECTED`
- `ARCHIVED`

Valid status transitions must be enforced by the backend.

## FR-BIZ-09: Listing audit history

**Status: Implemented — full lifecycle integration coverage pending.**

The platform shall record significant listing workflow actions.

Audit records should include:

- Actor.
- Action.
- Timestamp.
- Relevant listing.
- Status transition.
- Appropriate metadata.

Audit history must not be exposed to ordinary investors.

## FR-BIZ-10: Listing identity visibility

**Status: Implemented.**

Staff shall determine whether each listing is anonymized or identified.

### Anonymized listing

Investor-facing information must not reveal:

- Legal business name.
- Website.
- Confidential seller identity.
- Internal notes.
- Ownership information.
- Approval metadata.
- Audit history.

### Identified listing

The actual business name and website may be displayed when the listing is approved for identified presentation.

Identity visibility must be enforced by backend serialization, not frontend hiding alone.

## FR-BIZ-11: Internal listing management

**Status: Partial.** API actions exist; staff edit/submit/archive and approver review action controls require completion and browser verification.

Staff shall have access to:

- Listing overview.
- Listing creation.
- Listing editing.
- Draft management.
- Submission.
- Listing status.
- Archival actions.

Approvers shall have access to:

- Review queue.
- Listing preview.
- Approval.
- Rejection.
- Review history.

---

# 5.3 Investor business discovery

## FR-DISC-01: Approved-only directory

**Status: Implemented.**

Investors shall be able to browse approved business opportunities.

The backend must exclude:

- Draft listings.
- Listings under review.
- Rejected listings.
- Archived listings.

## FR-DISC-02: Search

**Status: Implemented.**

Investors shall be able to search available business listings.

Searchable fields may include:

- Business title where permitted.
- Industry.
- Sub-industry.
- Location.
- Description.
- Products and services.

Search must respect anonymization rules.

## FR-DISC-03: Filters

**Status: Implemented for industry, location, revenue, and asking price; EBITDA/SDE range filters remain planned.**

The directory shall support relevant filters:

- Industry.
- Sub-industry.
- Location.
- Revenue range.
- EBITDA range.
- SDE range.
- Asking-price range.
- Other available business attributes.

Filters must not imply that missing financial data is zero.

## FR-DISC-04: Sorting

**Status: Implemented for newest, revenue, and asking price.**

Investors shall be able to sort listings by relevant attributes, such as:

- Recently added.
- Revenue.
- EBITDA.
- Asking price.

Sorting must handle missing financial values correctly.

## FR-DISC-05: Pagination

**Status: Implemented.**

The directory shall support pagination.

The backend must enforce reasonable page-size limits.

## FR-DISC-06: Business detail page

**Status: Implemented.**

Investors shall be able to open an individual business detail page.

The page shall display available:

- General information.
- Industry.
- Location.
- Business overview.
- Products and services.
- Financial information.
- Operational information.
- Identity information permitted by the listing.

Missing data must be clearly represented as unavailable.

## FR-DISC-07: Investor-safe data serialization

**Status: Implemented.**

Investor-facing API responses must use dedicated serializers.

Internal fields must not be returned accidentally.

---

# 5.4 Investor dashboards

## FR-DASH-01: Investor dashboard

**Status: Partial.** Recent approved opportunities and discovery links are implemented; saved/enquiry summary presentation is not yet complete.

The investor dashboard shall provide:

### Discovery

- Featured or recently added approved businesses.
- Search and discovery entry points.
- Links to the business directory.

### Personal overview

- Saved businesses.
- Comparison entry point.
- Enquiries.
- Recently viewed opportunities, where supported.

The dashboard must not display invented activity or fake metrics.

## FR-DASH-02: Staff dashboard

**Status: Partial.** Basic staff navigation exists; complete record-backed operational summaries and pending-action views remain.

The staff dashboard shall provide:

### Listing management

- Listing overview.
- Draft listings.
- Listings under review.
- Approved listings.
- Rejected listings.
- Archived listings.

### Sourcing and investor engagement

- Investor enquiries.
- Pending actions.
- Assigned enquiries.
- Follow-up tasks.

Dashboard data must be based on actual records.

---

# 5.5 Saved businesses

## FR-SAVED-01: Save business

**Status: Implemented.**

Investors shall be able to save an approved business listing.

Each saved record shall be associated with:

- Investor ID.
- Business listing ID.
- Creation timestamp.

## FR-SAVED-02: Duplicate prevention

**Status: Implemented.**

The same investor shall not save the same listing multiple times.

The backend and database must enforce uniqueness.

## FR-SAVED-03: Saved-business directory

**Status: Implemented.**

Investors shall be able to view their saved businesses.

## FR-SAVED-04: Remove saved business

**Status: Implemented.**

Investors shall be able to remove a listing from their saved businesses.

## FR-SAVED-05: Ownership protection

**Status: Implemented.**

Investors must only access their own saved-business records.

## FR-SAVED-06: Listing availability

**Status: Implemented.** Non-approved records are excluded from investor-safe saved responses.

Saved listings that are no longer approved must not continue to expose investor-restricted information.

---

# 5.6 Business comparison

## FR-COMP-01: Compare saved businesses

**Status: Partial.** The comparison page exists for saved businesses; the full server-side four-item selection and validation contract remains to be completed.

Investors shall be able to compare saved acquisition opportunities.

The initial comparison interface shall support up to four businesses.

## FR-COMP-02: Comparison attributes

**Status: Implemented for the current comparison fields.**

Comparison shall include available:

- Business overview.
- Industry.
- Location.
- Years operating.
- Employee count.
- Revenue.
- EBITDA.
- SDE.
- Asking price.
- Currency.
- Products and services.

## FR-COMP-03: Missing information

**Status: Implemented.**

Missing values must be displayed as unavailable.

The platform must not:

- Substitute zero for missing data.
- Invent financial ratios.
- Infer valuation multiples.
- Present unverified figures as confirmed facts.

## FR-COMP-04: Comparison controls

**Status: Partial.** Detail links and saved-business navigation exist; complete add/remove selection controls remain.

Investors shall be able to:

- Add a saved business.
- Remove a business.
- Return to saved businesses.
- Open individual business details.

## FR-COMP-05: Comparison authorization

**Status: Implemented through investor-scoped saved-business retrieval; dedicated comparison API validation remains planned.**

Comparison must respect the investor's saved-business ownership and listing visibility permissions.

## FR-COMP-06: Responsive comparison

**Status: Implemented at the page layout level; dedicated interaction testing remains pending.**

The comparison interface shall remain usable on mobile devices.

Horizontal scrolling or another suitable responsive approach may be used.

---

# 5.7 Investor enquiries

## FR-ENQ-01: Enquire action

**Status: Implemented.**

Approved business detail pages shall include an Enquire action.

## FR-ENQ-02: Enquiry form

**Status: Implemented.**

The enquiry form shall include:

### Prefilled information

- Investor name.
- Investor email.
- Associated business.

### Optional fields

- Message.
- Investment budget.
- Acquisition experience.
- Reason for interest.

Optional fields must remain optional.

## FR-ENQ-03: Enquiry submission

**Status: Implemented — notification processing and full integration coverage pending.**

The backend shall:

1. Require authentication.
2. Require investor permissions.
3. Validate the business listing.
4. Verify that the listing is approved.
5. Associate the enquiry with the authenticated investor.
6. Validate enquiry content.
7. Create the enquiry record.
8. Set the initial status.
9. Record timestamps.
10. Trigger internal notification processing.

The backend must not trust investor IDs supplied by the frontend.

## FR-ENQ-04: Enquiry status

**Status: Implemented with current canonical statuses.**

The original product statuses map to the current implementation as follows:

- `CONTACTING_INVESTOR` is represented by `CONTACTED`.
- `FURTHER_PROCESS_APPROVED` is represented by `QUALIFIED`.

Current canonical statuses:

- `NEW`
- `IN_REVIEW`
- `CONTACTED`
- `QUALIFIED`
- `CLOSED`
- `DECLINED`

Valid transitions must be enforced.

## FR-ENQ-05: Investor enquiry history

**Status: Implemented.**

Investors shall be able to:

- View their enquiries.
- View associated businesses.
- View submission dates.
- View enquiry status.
- Open enquiry details.
- View approved investor-facing instructions.

Investors must not see internal notes, assignment information, or confidential seller information.

## FR-ENQ-06: Enquiry confirmation

**Status: Implemented.**

After successful submission, the platform shall display confirmation.

The confirmation must only appear after the backend successfully creates the enquiry.

The platform must not guarantee an immediate seller response.

---

# 5.8 Internal enquiry management

## FR-STAFF-ENQ-01: Internal enquiry inbox

**Status: Implemented — search, filtering, pagination, and sorting depth remains incomplete in the browser UI.**

Authorized staff shall be able to view enquiries.

The inbox shall support:

- Search.
- Status filtering.
- Business filtering.
- Assignment filtering.
- Pagination.
- Sorting.

## FR-STAFF-ENQ-02: Enquiry details

**Status: Implemented.**

Staff shall be able to view:

- Investor information.
- Associated business.
- Available financial information.
- Enquiry message.
- Optional investor qualification details.
- Current status.
- Assignment.
- Internal notes.
- Status history.
- Follow-up information.

## FR-STAFF-ENQ-03: Assignment

**Status: Implemented.**

Authorized staff shall be able to assign enquiries to internal team members.

Assignment changes must be recorded.

## FR-STAFF-ENQ-04: Internal notes

**Status: Implemented.**

Staff shall be able to add internal notes.

Notes must record:

- Author.
- Content.
- Timestamp.

Internal notes must never be exposed through investor-facing APIs.

## FR-STAFF-ENQ-05: Status management

**Status: Implemented.** Status history persistence remains a follow-up requirement.

Authorized staff shall be able to update enquiry statuses.

The backend must enforce valid transitions and record status history.

## FR-STAFF-ENQ-06: Seller contact handling

**Status: Implemented with current contact-decision vocabulary; audit/status-history depth remains pending.**

The internal team shall decide how seller communication proceeds.

Supported decisions:

- `INTERNAL_TEAM_HANDLES`
- `DIRECT_CONTACT_PERMITTED`

The decision must record:

- Acting user.
- Timestamp.
- Decision.
- Optional investor-facing instructions.

Direct-contact permission does not automatically reveal confidential seller records.

## FR-STAFF-ENQ-07: Follow-up tracking

**Status: Implemented at API level; upcoming/overdue presentation remains pending.**

Staff shall be able to record:

- Follow-up date.
- Follow-up description.
- Follow-up completion state.

The staff interface shall display upcoming and overdue follow-ups.

---

# 5.9 Notifications and email

## FR-NOT-01: Transactional email

**Status: Partial.** Verification and password-reset templates/services exist; enquiry and account notification templates/delivery remain planned.

The platform shall use Resend for transactional email.

Required email types:

- Email verification.
- Password reset.
- Enquiry submission confirmation.
- New enquiry notification to staff.
- Enquiry status updates.
- Relevant account security notifications.

## FR-NOT-02: Email configuration

**Status: Implemented.** Resend variables are documented and server-only.

Required configuration includes:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `APP_BASE_URL`
- `ENQUIRY_NOTIFICATION_EMAILS`

Credentials must remain server-side.

## FR-NOT-03: Email security

**Status: Implemented for verification/reset token flows.**

Email workflows must:

- Use secure links.
- Prevent token reuse.
- Enforce expiry.
- Avoid leaking sensitive information.
- Avoid exposing internal notes.
- Rate-limit sensitive requests.

## FR-NOT-04: Email failure handling

**Status: Partial.** Account operations persist independently of optional email delivery; retry and delivery-outcome persistence remain planned.

Email failure must not silently corrupt account or enquiry records.

The platform should record delivery outcomes where practical and support safe retry behavior.

## FR-NOT-05: In-app notifications

**Status: Planned.** Preference storage exists, but notification records, read state, and delivery are not yet implemented.

The platform shall support basic in-app notifications.

Notification events may include:

- Email verification reminders.
- Enquiry submission.
- Enquiry status updates.
- Staff assignment notifications.

Users shall be able to:

- View their notifications.
- Mark notifications as read.
- Navigate to the associated resource.

Notifications must be scoped to the authenticated user.

---

# 6. Second 50% — Reserved Functional Requirements

The following features belong to the future milestone.

# 6.1 Seller CRM

Future capabilities:

- Seller contact records.
- Seller relationship history.
- Communication tracking.
- Seller follow-up workflows.
- Owner outreach management.
- Seller qualification.

# 6.2 Advanced sourcing

Future capabilities:

- Search thesis and buy-box management.
- Sourcing lead management.
- Lead import.
- Advanced acquisition sourcing.
- Source provenance.
- Contact enrichment.
- Advanced relationship management.

# 6.3 Confidential information

Future capabilities:

- Controlled business identity reveal.
- Confidentiality permissions.
- Access approval workflows.
- NDA-related workflows.
- Investor-specific confidential access.

# 6.4 Document management

Future capabilities:

- Business document upload.
- Document organization.
- Document access controls.
- Secure document sharing.
- Confidential document rooms.
- Document access history.

# 6.5 Due diligence

Future capabilities:

- Due-diligence checklists.
- Due-diligence tasks.
- Financial diligence.
- Legal diligence.
- Operational diligence.
- Advisor collaboration.
- Risk registers.
- Findings and evidence management.

# 6.6 Acquisition pipeline

Future capabilities:

- Deal stages.
- Acquisition progression.
- Transaction milestones.
- Negotiation tracking.
- Deal decision history.
- Acquisition readiness.

# 6.7 Advanced analytics

Future capabilities:

- Sourcing analytics.
- Investor engagement analytics.
- Deal pipeline reporting.
- Acquisition workflow performance.
- Advanced dashboards.

# 6.8 Production operations

Future capabilities:

- Production deployment.
- Monitoring.
- Operational alerting.
- Automated backups.
- Disaster recovery.
- Advanced infrastructure hardening.

---

# 7. User Experience Requirements

## 7.1 General UX principles

The interface shall prioritize:

- Clear navigation.
- Consistent terminology.
- Predictable workflows.
- Minimal unnecessary steps.
- Appropriate information density.
- Responsive layouts.
- Accessible interactions.
- Clear error messages.
- Consistent form behavior.

The platform should follow established usability principles such as visibility of system status, consistency, error prevention, recognition rather than recall, and user control.

## 7.2 Investor navigation

Recommended navigation:

- Dashboard.
- Discover Businesses.
- Saved Businesses.
- My Enquiries.
- Account.

## 7.3 Staff navigation

Recommended navigation:

- Overview.
- Business Listings.
- Create Listing.
- Enquiries.
- Review Queue, for approvers.

## 7.4 Business listing cards

Cards should display available:

- Business title or anonymized label.
- Industry.
- Location.
- Short description.
- Available financial highlights.
- Listing status where appropriate.
- Save action.

Cards must not expose internal information.

## 7.5 Business detail page

The detail page should organize information into clear sections:

- Overview.
- Industry and location.
- Products and services.
- Financial information.
- Operational information.
- Enquiry action.
- Save action.

Financial information must be easy to scan.

## 7.6 Dashboard design

Dashboards should prioritize actions and information relevant to the user role.

Avoid meaningless metrics or fabricated activity.

## 7.7 Loading, empty, and error states

All major workflows must provide:

- Loading indicators.
- Empty states.
- Error messages.
- Retry actions where appropriate.
- Confirmation messages.

## 7.8 Responsive design

The application shall support desktop, tablet, and mobile browser layouts.

Comparison tables may use horizontal scrolling where necessary.

---

# 8. Data Model Requirements

The following models represent the conceptual data structure. Existing implementations should be preserved where they already satisfy the requirements.

## 8.1 User

Fields:

- `_id`
- `firstName`
- `lastName`
- `email`
- `passwordHash`
- `role`
- `emailVerified`
- `notificationPreferences`
- `createdAt`
- `updatedAt`

## 8.2 Session

Fields:

- `_id`
- `userId`
- `refreshTokenHash`
- `expiresAt`
- `revokedAt`
- `createdAt`

## 8.3 Business

Fields:

- `_id`
- `title`
- `legalName`
- `description`
- `industry`
- `subIndustry`
- `location`
- `website`
- `identityMode`
- `financials`
- `operationalInformation`
- `productsAndServices`
- `status`
- `createdBy`
- `updatedBy`
- `approvedBy`
- `approvedAt`
- `createdAt`
- `updatedAt`

## 8.4 Business audit record

Fields:

- `_id`
- `businessId`
- `actorId`
- `action`
- `previousStatus`
- `newStatus`
- `metadata`
- `createdAt`

## 8.5 Saved business

Fields:

- `_id`
- `investorId`
- `businessId`
- `createdAt`

A unique index must prevent duplicate saved records for the same investor and business.

## 8.6 Enquiry

Fields:

- `_id`
- `investorId`
- `businessId`
- `assignedTo`
- `status`
- `message`
- `investmentBudget`
- `acquisitionExperience`
- `reasonForInterest`
- `contactHandlingDecision`
- `followUpDate`
- `followUpDescription`
- `followUpCompleted`
- `createdAt`
- `updatedAt`

## 8.7 Enquiry note

**Status: Planned as a separate append-only model.** Current implementation stores one internal note field on the enquiry.

Fields:

- `_id`
- `enquiryId`
- `authorId`
- `content`
- `createdAt`

## 8.8 Enquiry status history

**Status: Planned.** Current status transitions are validated, but a separate status-history model is not yet present.

Fields:

- `_id`
- `enquiryId`
- `actorId`
- `previousStatus`
- `newStatus`
- `createdAt`

## 8.9 Email token

Fields:

- `_id`
- `userId`
- `tokenHash`
- `tokenType`
- `expiresAt`
- `usedAt`
- `createdAt`

## 8.10 Notification

**Status: Planned.** Notification preference fields exist on `User`; a persisted notification model is not yet implemented.

Fields:

- `_id`
- `userId`
- `type`
- `title`
- `message`
- `resourceType`
- `resourceId`
- `readAt`
- `createdAt`

---

# 9. API Requirements

The API shall follow the existing Express architecture and validation conventions.

## 9.1 Authentication

Existing and required endpoints:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `POST /auth/verify-email`
- `POST /auth/resend-verification`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

## 9.2 Account

- `GET /users/me`
- `PATCH /users/me`
- Password change endpoint.
- Notification preferences endpoint.

## 9.3 Businesses

Existing business APIs should support:

- Listing creation.
- Listing retrieval.
- Listing updates.
- Submission for review.
- Approval.
- Rejection.
- Archival.
- Audit history.

## 9.4 Investor discovery

- `GET /businesses`
- `GET /businesses/:id`

Requirements:

- Approved-only access.
- Search.
- Filters.
- Sorting.
- Pagination.
- Investor-safe serialization.

## 9.5 Saved businesses

- `GET /saved-businesses`
- `POST /saved-businesses/:businessId`
- `DELETE /saved-businesses/:businessId`

## 9.6 Enquiries

- `POST /enquiries`
- `GET /enquiries`
- Investor enquiry detail is currently included in the authenticated enquiry history response; a dedicated investor `GET /enquiries/:id` endpoint remains planned.

Internal endpoints shall support:

- Enquiry inbox.
- Assignment.
- Status updates.
- Internal notes.
- Follow-up management.
- Contact-handling decisions.

## 9.7 Notifications

**Status: Planned.**

- `GET /notifications`
- `PATCH /notifications/:id/read`

All endpoints must enforce authorization and resource ownership.

---

# 10. Technical Architecture

## 10.1 Frontend

- Next.js.
- TypeScript.
- Tailwind CSS.
- Responsive component architecture.
- Server-side and client-side rendering as appropriate.
- Frontend route protection.
- API integration with the Express backend.

Frontend guards improve UX but do not replace backend authorization.

## 10.2 Backend

- Node.js.
- Express.
- TypeScript.
- Zod request validation.
- Centralized error handling.
- Authentication middleware.
- Role-based authorization.
- Dedicated response serializers.

## 10.3 Database

- MongoDB.
- Mongoose.
- Indexed queries.
- Database-backed business workflows.
- Isolated test database for integration tests.

## 10.4 Authentication architecture

The existing authentication implementation should be retained:

- Argon2id password hashing.
- Short-lived access tokens.
- HttpOnly cookies.
- Rotating refresh tokens.
- Hashed refresh token storage.
- Session revocation.

## 10.5 Email architecture

Resend shall provide transactional email delivery.

Email functionality must be isolated behind reusable backend services.

The platform must support local development and automated testing without requiring real email delivery.

## 10.6 Workspace architecture

The project shall maintain the existing npm workspace structure:

- `apps/web`
- `apps/api`
- `docs`

Do not introduce unnecessary applications or services.

---

# 11. Security Requirements

## 11.1 Authentication security

- Argon2id password hashing.
- Secure session handling.
- HttpOnly cookies.
- Short-lived access tokens.
- Refresh token rotation.
- Session revocation.
- Secure password-reset and verification tokens.

## 11.2 Authorization

- Backend-enforced role checks.
- Resource ownership validation.
- Investor data isolation.
- Internal record restrictions.
- Privileged account controls.

## 11.3 Business confidentiality

- Approved-only investor visibility.
- Dedicated investor-safe serializers.
- Anonymized identity protection.
- No accidental exposure of internal notes.
- No exposure of approval history.
- No exposure of audit records.

## 11.4 Enquiry confidentiality

- Investors can only access their own enquiries.
- Internal notes are restricted to authorized staff.
- Staff assignments are restricted.
- Contact-handling decisions are restricted.
- Seller information remains confidential unless separately authorized.

## 11.5 API security

- Zod validation.
- Rate limiting.
- CORS restrictions.
- Helmet security headers.
- Centralized error handling.
- Secure logging.
- No sensitive information in error responses.

## 11.6 Email security

- Server-side Resend credentials.
- Hashed tokens.
- Expiration.
- One-time use.
- Generic password-reset responses.
- Secure link generation.
- No confidential data in inappropriate email notifications.

## 11.7 Auditability

Important actions must be traceable.

This includes:

- Listing approval.
- Listing rejection.
- Listing archival.
- Enquiry status changes.
- Enquiry assignment.
- Seller-contact permission decisions.

---

# 12. Non-Functional Requirements

## 12.1 Performance

- Efficient database queries.
- Pagination for large lists.
- Appropriate indexes.
- Avoid unnecessary repeated requests.
- Maintain responsive user interactions.

## 12.2 Reliability

- Graceful handling of database failures.
- Graceful handling of email failures.
- Centralized error handling.
- Predictable application behavior.

## 12.3 Maintainability

- Modular frontend and backend code.
- Consistent naming.
- Type safety.
- Shared validation conventions.
- Reusable components.
- Documented configuration.

## 12.4 Accessibility

- Semantic HTML.
- Keyboard-accessible controls.
- Visible focus states.
- Form labels.
- Accessible error messages.
- Sufficient contrast.

## 12.5 Scalability

The initial platform should support a small team and a growing investor base without requiring premature microservices or complex infrastructure.

---

# 13. Testing and Acceptance Criteria

## 13.1 Authentication

- Registration works.
- Login works.
- Logout works.
- Session refresh works.
- Email verification works.
- Password reset works.
- Invalid and expired tokens are rejected.
- Privileged role escalation is prevented.

## 13.2 Business listings

- Staff can create listings.
- Draft listings remain private.
- Staff can edit listings.
- Listings can be submitted for review.
- Approvers can approve and reject listings.
- Valid transitions are enforced.
- Audit records are created.
- Archived listings are hidden from investors.

## 13.3 Investor discovery

- Investors can browse approved listings.
- Search works.
- Filters work.
- Sorting works.
- Pagination works.
- Investor-safe serialization prevents confidential data leakage.

## 13.4 Saved businesses

- Investors can save listings.
- Duplicate saves are prevented.
- Investors can remove saved listings.
- Investors can retrieve their saved listings.
- Cross-user access is denied.

## 13.5 Comparison

- Investors can compare up to four listings.
- Duplicate selections are rejected.
- Unapproved listings are rejected.
- Missing financial values are displayed correctly.
- Comparison remains responsive.

## 13.6 Enquiries

- Investors can submit enquiries.
- Optional fields remain optional.
- Enquiries are linked to the authenticated investor.
- Investors can view their own enquiries.
- Investors cannot view other users' enquiries.
- Staff can view and manage enquiries.
- Status transitions are validated.
- Internal notes remain private.

## 13.7 Notifications

- Email templates render correctly.
- Resend configuration is validated.
- Email failures are handled.
- In-app notifications are scoped to the correct user.
- Read-state updates work.

## 13.8 Integration verification

The project must distinguish:

- Unit tests.
- API integration tests.
- Database-backed integration tests.
- Manual browser verification.
- External email delivery verification.

A successful build alone is not sufficient to prove a feature works.

---

# 14. Current Implementation and Outstanding Work

This section reflects the current development documents.

## 14.1 Implemented functionality

According to the current progress report, the following are present:

### Technical foundation

- Next.js.
- Express.
- TypeScript.
- npm workspaces.
- Tailwind/PostCSS.
- Mongoose.
- Zod.
- Vitest.
- Supertest.
- Environment validation.
- CORS.
- Helmet.
- Rate limiting.
- Request logging.
- Centralized errors.
- Health endpoint.
- Graceful MongoDB shutdown.

### Authentication

- User and session models.
- Argon2id hashing.
- JWT access sessions.
- Hashed rotating refresh tokens.
- Role authorization.
- Admin bootstrap.
- Development role-registration switch.
- Email verification and reset API/UI foundations.
- Profile editing.
- Password change.
- Basic notification preference storage.

### Business management

- Business listing creation.
- Listing retrieval.
- Listing updates.
- Review submission.
- Approval.
- Rejection.
- Archival.
- Audit history.
- Approved-only investor discovery.
- Search, filters, sorting, and pagination.
- Anonymized identity handling.

### Investor functionality

- Saved business model.
- Save/list/remove APIs.
- Comparison page.
- Enquiry creation.
- Investor enquiry history.

### Internal workflows

- Internal enquiry inbox.
- Enquiry status management.
- Assignment.
- Internal notes.
- Contact-handling decisions.
- Follow-up APIs.

### Frontend

Responsive routes for:

- Public pages.
- Investor pages.
- Staff pages.
- Approver pages.
- Admin pages.
- Account management.
- Saved businesses.
- Comparison.
- Enquiries.

### Development data

- Idempotent non-production demo seed command.
- Three accounts.
- Three approved listings.

## 14.2 Existing verification

The current progress report states that the following passed:

- `npm run typecheck`
- `npm test` — 32 backend tests.
- `npm run build:web`
- `npm run build:api`

A live MongoDB smoke test also passed for:

- Seeded investor login.
- Approved listing discovery.
- Save business.
- Retrieve saved business.
- Remove saved business.
- Enquiry creation.

These results should be treated as the existing documented verification baseline, not as proof that every workflow has been fully tested.

## 14.3 Remaining first-half work

The following must be completed before the first-half milestone is fully verified:

1. Complete staff listing edit, submit, and archive controls.
2. Complete approver review, approval, rejection, and investor-facing preview controls in the browser.
3. Add isolated MongoDB integration tests for account, listing, saved-business, and enquiry boundaries.
4. Complete server-side comparison selection validation and interaction controls.
5. Configure Resend in a non-production environment and verify delivery.
6. Add enquiry/account notification templates and delivery outcomes.
7. Add persisted in-app notifications and read-state endpoints.
8. Add frontend interaction tests for protected workflows.
9. Reconcile documentation and security review after verification.

The first-half milestone must not be declared completely verified until these outstanding requirements are addressed or explicitly documented as blocked by external configuration.

---

# 15. Explicit Non-Goals

The following are not part of the first-half milestone:

- Seller CRM.
- Seller contact database.
- Seller communication history.
- Advanced owner outreach.
- Confidential business identity reveal.
- Confidential document rooms.
- Secure seller document sharing.
- Due-diligence checklists.
- Due-diligence task management.
- Advanced financial analysis.
- Deal pipeline management.
- Transaction stage progression.
- Advanced acquisition analytics.
- Production deployment.
- Advanced monitoring.
- Automated backup infrastructure.
- Disaster recovery automation.

These features belong to the remaining 50%.

---

# 16. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Confidential business information exposed | Backend investor-safe serializers and role checks |
| Investors access other investors' data | Resource ownership validation |
| Unauthorized listing approval | Restricted approver permissions |
| Incomplete financial information misinterpreted | Explicit unavailable values and reporting periods |
| Email delivery failures | Persist operations separately from email delivery |
| Duplicate enquiries | Define and enforce an appropriate duplicate-enquiry policy |
| Incomplete workflow verification | Isolated MongoDB integration tests |
| Copilot scope expansion | Explicit milestone boundaries and non-goals |
| Misleading progress reporting | Separate implementation status from verified completion |
| Internal role escalation | Controlled internal account provisioning |

---

# 17. Development Execution Guidelines

## 17.1 Implementation approach

The project is a greenfield implementation that has already progressed through several development phases.

Copilot should:

- Inspect existing code before modifying it.
- Preserve working implementations.
- Implement features using the existing architecture.
- Avoid unnecessary rewrites.
- Use existing documentation as a guide.
- Update documentation whenever behavior changes.
- Test all meaningful changes.

## 17.2 Autonomous development

Copilot is authorized to complete the defined milestone without pausing after every task.

It should continue through independent tasks and phases.

It must stop only when:

- A genuine external dependency blocks progress.
- A destructive operation would require user authorization.
- A security-sensitive decision cannot be resolved from documented requirements.
- The requested scope has been completed.

## 17.3 Development reporting

Copilot must report:

- Completed features.
- Features retained from earlier implementation.
- Newly implemented features.
- Tests executed.
- Test results.
- External configuration still required.
- Known issues.
- Incomplete work.
- Updated progress estimate.

---

# 18. Definition of Done

The first 50% milestone is complete when:

- Authentication and account management work.
- Investors can discover approved businesses.
- Staff can manage business listings.
- Approvers can approve and reject listings.
- Investors can save businesses.
- Investors can compare opportunities.
- Investors can submit enquiries.
- Staff can manage investor enquiries.
- Staff can assign and track enquiries.
- Seller-contact handling decisions are recorded.
- Essential notifications are implemented.
- Security requirements are enforced.
- Critical workflows have automated tests.
- MongoDB integration tests cover important boundaries.
- Email delivery is verified when credentials are available.
- Documentation accurately reflects the application.
- The reserved second 50% remains untouched.

---

# 19. Future Product Vision

After the first-half milestone, the platform should evolve toward an integrated acquisition management environment.

The long-term platform may support:

- Search thesis management.
- Acquisition target sourcing.
- Company and seller relationship records.
- Outreach tracking.
- Acquisition pipeline management.
- Confidential information sharing.
- Document rooms.
- Due-diligence workflows.
- Advisor collaboration.
- Transaction readiness.
- Acquisition reporting.

The long-term objective is to provide continuity from acquisition sourcing through evaluation, diligence, and transaction coordination.

The product should evolve incrementally, preserving data integrity, security, and workflow usability.

---

# 20. Final Product Statement

The Search Fund & ETA Advisory Platform is a secure, role-based acquisition opportunity discovery and management platform.

Its first milestone delivers the essential investor and internal sourcing workflows: authentication, business listing management, approval, discovery, saved opportunities, comparison, enquiries, internal enquiry coordination, and essential notifications.

The remaining development focuses on advanced acquisition sourcing, seller CRM, confidential information, due diligence, transaction management, and operational maturity.

The platform must prioritize reliable workflows, accurate business information, confidentiality, and secure investor engagement over premature complexity.
