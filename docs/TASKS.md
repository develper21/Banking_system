# ✅ Project Tasks

> **CashFlow Banking Platform — Task Breakdown & Development Plan**
>
> This document contains the complete list of tasks for building the CashFlow application. Tasks are divided into phases with clear deliverables, priorities and status tracking.

| 📊 Total Tasks | ✔ Completed | 🔄 In Progress |
|:---:|:---:|:---:|
| **31** | **8** (26%) | **1** (3%) |

---

## ✅ Phase 1: Project Setup

Set up the development environment, repository and core configuration.

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 1.1 | Initialize Next.js project (App Router) | High | ✅ Completed | TS + App Router |
| 1.2 | Configure Tailwind CSS + ShadCN | High | ✅ Completed | Custom tokens in `tailwind.config.ts` |
| 1.3 | Set up Git repository | High | ✅ Completed | Pushed to GitHub |
| 1.4 | Configure ESLint & Prettier | Medium | ✅ Completed | `eslint-config-next` |
| 1.5 | Configure Jest + testing library | Medium | ✅ Completed | `jest.config.js`, `__tests__/` |

## ✅ Phase 2: Authentication

Implement user authentication and protected routes.

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 2.1 | Create Appwrite project | High | ✅ Completed | Users + DB collections |
| 2.2 | Create sign-up page | High | ✅ Completed | `AuthForm type="sign-up"` |
| 2.3 | Implement sign-up logic | High | ✅ Completed | `signUp()` + Dwolla customer |
| 2.4 | Create login page | High | ✅ Completed | `AuthForm type="sign-in"` |
| 2.5 | Protect dashboard routes | High | ✅ Completed | `getLoggedInUser()` gate in `(root)/layout.tsx` |
| 2.6 | API: `POST /api/auth` + `DELETE /api/auth` | High | ✅ Completed | Session create/delete |
| 2.7 | API: `POST /api/user/register` | High | ✅ Completed | Account + profile document |

## 🔄 Phase 3: Bank Linking

Allow users to link external banks and fetch accounts via Plaid.

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 3.1 | Integrate Plaid client | High | ✅ Completed | `lib/plaid.ts` |
| 3.2 | Create PlaidLink component | High | ✅ Completed | Primary + ghost variants |
| 3.3 | Exchange public token → bank document | High | ✅ Completed | `exchangePublicToken()` |
| 3.4 | Dwolla customer + funding source | High | ✅ Completed | `dwolla.actions.ts` |
| 3.5 | API: `POST /api/plaid/create-link-token` | Medium | 🔄 In Progress | Session-cookie guard verified |
| 3.6 | Handle Plaid webhooks | Medium | ⬜ Pending | `POST /api/plaid/webhook` (logging only) |
| 3.7 | Persist transactions on webhook | Medium | ⬜ Pending | Sync into transactions collection |

## ⬜ Phase 4: Dashboard & Accounts

Surface balances and account overviews.

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 4.1 | Home dashboard layout | High | ⬜ Pending | `HeaderBox`, `TotalBalanceBox` exist |
| 4.2 | Doughnut chart for categories | Medium | ⬜ Pending | Chart.js wired, data mapping pending |
| 4.3 | Right sidebar (profile, banks) | Medium | ⬜ Pending | `RightSideBar` component exists |
| 4.4 | API: `GET /api/accounts` + `GET /api/account` | High | ✅ Completed | Mock user supported |
| 4.5 | API: `GET /api/banks` | High | ✅ Completed | Mock user supported |

## ⬜ Phase 5: Transactions

List, create and track transactions.

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 5.1 | Transaction history page | High | ⬜ Pending | Page + table exist |
| 5.2 | Pagination component | Medium | ⬜ Pending | `Pagination` exists |
| 5.3 | Per-bank filtering | Medium | ⬜ Pending | `?id=` param works |
| 5.4 | API: `GET /api/transactions` | High | ✅ Completed | Paginated + mock user |
| 5.5 | API: `POST /api/transactions` | High | ✅ Completed | Session guard verified |
| 5.6 | Category badges & styling | Low | ⬜ Pending | Styles defined in constants |

## ⬜ Phase 6: Transfers

Enable money movement between users.

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 6.1 | Payment transfer page | High | ⬜ Pending | `PaymentTransferForm` exists |
| 6.2 | Dwolla transfer + transaction record | High | ⬜ Pending | `transferFunds()` ready |
| 6.3 | Transfer validation & errors | Medium | ⬜ Pending | Zod schema pending |

## ⬜ Phase 7: Monitoring & Docs

Observability, testing and documentation.

| # | Task | Priority | Status | Notes |
|---|---|---|---|---|
| 7.1 | Sentry instrumentation (client/server/edge) | Medium | ✅ Completed | 3 config files |
| 7.2 | Structured logger + request logging | Medium | ✅ Completed | `lib/logger.ts`, `proxy.ts` |
| 7.3 | Central error handler | Medium | ✅ Completed | `lib/error-handler.ts` |
| 7.4 | Client error reporting API | Medium | ✅ Completed | `POST /api/error` |
| 7.5 | Postman collection (all routes) | High | ✅ Completed | 34 requests, auto-tests |
| 7.6 | Project docs (PRD, ARCH, RULES, DESIGN, TASKS, MEMORY) | Medium | ✅ Completed | This folder |
