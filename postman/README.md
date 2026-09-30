# 📮 Postman — CashFlow Banking Platform

Complete route-testing collection for the project. One collection, two big folders:

```
postman/
└── postman.json   ← import this file into Postman
```

| Folder | Covers | Requests |
|---|---|---|
| **01 Server API Routes** | every handler in `app/api/**/route.ts` — Auth, Users, Accounts, Banks, Transactions, Plaid (link token + webhook), Monitoring & Errors | 28 |
| **02 Frontend Page Routes** | every page in `app/(auth)` and `app/(root)` — sign-in, sign-up, home, my-banks, transaction-history, payment-transfer | 6 |

Every request carries `pm.test` assertions (status code, response shape, pagination math, auth guards), plus a collection-wide **response time < 5s** check.

---

## 🚀 Quick Start

```bash
npm run dev          # start the app on http://localhost:3000
```

1. Open **Postman** → **Import** → drop `postman/postman.json`
2. Collection variable `baseUrl` defaults to `http://localhost:3000`
3. **Run collection** (Runner ▶) or run folders individually

## ✅ vs ⚠️ — what works out of the box

| Marker | Meaning |
|---|---|
| ✅ **Demo** | Works with **zero configuration** — mock test user / validation guards only |
| ⚠️ **Live** | Needs `.env` credentials (Appwrite / Plaid / Dwolla) and sometimes a session cookie |

### Mock test user (no services required)

```
userId:            test-user-demo
bank document ids: mock-bank-1, mock-bank-2, mock-bank-3
data:              3 banks, 10 transactions, paginated
```

Requests that use it: **Get All Accounts — Demo User**, **Get Single Account — Demo Bank**, **Get Banks — Demo User**, **List Transactions (pages 1 & 2)**, plus all validation-guard tests (400s / 401s) and the Plaid webhook tests.

## 🔑 Testing the ⚠️ live routes

1. **Register → Login chain**: run *Users → Register — Success* first — a pre-request script generates a unique email and saves `{{registeredEmail}}` / `{{registeredPassword}}`, which *Login — Success* reuses automatically.
2. **Session-protected writes** (`POST /api/transactions`, Plaid link token): sign in through the UI, then copy the `appwrite-session` cookie (DevTools → Application → Cookies) into the request's `Cookie` header.

## 🧱 Collection variables

| Variable | Default | Purpose |
|---|---|---|
| `baseUrl` | `http://localhost:3000` | App origin |
| `userId` | `test-user-demo` | Mock demo user |
| `appwriteItemId` | `mock-bank-1` | Bank document id (auto-updated by the accounts test) |
| `registeredEmail` / `registeredPassword` / `registeredUserId` | *(generated)* | Filled in by Register — Success |
| `page` / `limit` | `1` / `3` | Pagination defaults |
