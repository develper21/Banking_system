# 🧠 Project Memory

> **CashFlow Banking Platform — Context, Progress & Important Notes**
>
> This document keeps track of the current state of the project, important decisions, and things to remember. It helps maintain continuity across development sessions and orients new contributors.

| 📅 Last Updated | 🧭 Current Phase | 📌 Next Milestone |
|---|---|---|
| **Sep 30, 2026** | **Phase 3** — Bank Linking | Webhook persistence |

## 🎯 Current Status

- ✅ Project setup completed (Next.js, TypeScript, Tailwind)
- ✅ Git repository initialized and pushed to GitHub
- ✅ Appwrite project created and configured
- ✅ Authentication (sign-up, sign-in, protected routes) completed
- 🔄 Working on Bank Linking (Plaid webhook handling in progress)

## ✔ Completed Tasks

| # | Task | Completed On |
|---|---|---|
| 1.1 | Initialize Next.js project | Sep 17, 2025 |
| 1.2 | Configure Tailwind CSS | Sep 20, 2025 |
| 1.3 | Set up Git repository | Sep 22, 2025 |
| 1.4 | Configure ESLint & Prettier | Sep 25, 2025 |
| 2.1 | Create Appwrite project | Oct 15, 2025 |
| 2.2 | Implement sign-up page | Oct 20, 2025 |
| 2.3 | Implement sign-in logic | Nov 10, 2025 |
| 2.4 | Protect dashboard routes | Dec 29, 2025 |

## 🔄 In Progress

| # | Task | Started | Notes |
|---|---|---|---|
| 3.5 | API: `POST /api/plaid/create-link-token` | Mar 18, 2026 | Session-cookie guard verified via Postman |
| 3.6 | Handle Plaid webhooks | Sep 28, 2026 | Currently logging-only; persistence next |

## 🧠 Important Decisions & Notes

### Demo / test user
- `userId = "test-user-demo"` triggers mock data everywhere (`lib/test-user.ts`).
- 3 mock banks (`mock-bank-1|2|3`), 10 mock transactions.
- Used by the app UI **and** the Postman collection so tests run without credentials.
- Test login shown in README: `rayred@cashflow.com` / `abcd1234`.

### Auth model
- Sessions are Appwrite email/password sessions; secret stored in an httpOnly cookie `appwrite-session`.
- `createSessionClient()` returns `{ account: null }` when the cookie is absent — routes must check and 401.
- Sign-in auto-creates a user document if an Appwrite account exists without one (fills required username/status fields).
- Test-user sessions use a separate `test-user-session` cookie valued `demo-session`.

### Response conventions
- Success: `{ success: true, data }` (+ `pagination` on lists).
- Failure: `{ success: false, error: { message, code, statusCode } }` via `createErrorResponse()`.
- Older routes may return plain `{ error: "..." }` — keep both shapes in mind when writing clients.

### Gotchas
- Appwrite `getBanks` filters client-side (`bank.userId === userId || bank.user_id === userId`) because of schema-mismatch fallbacks — don't "simplify" it back to a server-side query without re-testing.
- `getAccount` expects ids starting with `mock-bank-` to route to mock data.
- Sentry example route (`/api/sentry-example-api`) intentionally throws — a 500 there is **expected**.
- Dwolla env falls back to `sandbox` with a console warning if `DWOLLA_ENVIRONMENT` is unset.
- Transactions list pagination: 10 mock records; `pages = ceil(total/limit)`.

## 🔗 Where Things Live

| What | Where |
|---|---|
| Postman collection (34 requests, auto-tests) | `postman/postman.json` — see `postman/README.md` |
| Documentation set | `docs/` (PRD, ARCHITECTURE, RULES, DESIGN, TASKS, MEMORY) |
| API route handlers | `app/api/**/route.ts` |
| Server actions | `lib/actions/*.actions.ts` |
| Design tokens | `tailwind.config.ts`, `app/globals.css` |
| Global types | `types/index.d.ts` |
