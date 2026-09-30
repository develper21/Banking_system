# 🏛 System Architecture

> **CashFlow Banking Platform — Full Stack Banking Application**
>
> This document describes the overall system architecture, technology stack, folder structure, data flow, and key design decisions for the CashFlow application.

---

## 1. High-Level Architecture

CashFlow follows a full-stack architecture using Next.js and Appwrite.

```
┌──────────┐       HTTPS        ┌─────────────────┐      Server Actions / API Routes      ┌──────────┐
│   User   │ ◄──────────────►  │  Next.js        │ ◄──────────────────────────────────►  │ Appwrite │
│          │                    │  Frontend       │                                        │          │
│ (Web     │                    │  (App Router)   │                                        │ (Postgres│
│ Browser) │                    │                 │                                        │  + Auth) │
└──────────┘                    └────────┬────────┘                                        └────┬─────┘
                                         │                                                      │
                                         │ Server Actions / API Routes                          │
                                         ▼                                                      │
                                ┌─────────────────┐                                             │
                                │  Next.js        │      External services:                     │
                                │  Backend        │ ◄──────────── Plaid (bank data)             │
                                │ (API Routes)    │ ◄──────────── Dwolla (transfers)            │
                                └─────────────────┘ ◄──────────── Sentry (monitoring)           │
```

## 2. Technology Stack

Technologies used in the project and their purpose:

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js (App Router) | UI framework |
| Language | TypeScript | Type safety and better developer experience |
| Styling | Tailwind CSS + ShadCN | Modern and responsive UI |
| Backend | Next.js API Routes / Server Actions | Backend logic and API endpoints |
| Database | Appwrite (PostgreSQL) | Database and real-time capabilities |
| Authentication | Appwrite Auth | User authentication and authorization |
| Bank Linking | Plaid | Connect external bank accounts, fetch balances & transactions |
| Transfers | Dwolla | ACH transfers & funding sources |
| Forms | React Hook Form + Zod | Type-safe forms with schema validation |
| Charts | Chart.js (react-chartjs-2) | Doughnut chart for spending categories |
| Monitoring | Sentry | Error tracking and performance |
| DevTools | ESLint, Prettier, Jest | Code quality, formatting, testing |
| Version Control | Git & GitHub | Source code management |
| Deployment | Vercel | Hosting and deployment |

## 3. Folder Structure

The project follows the Next.js App Router layout to keep the code organized and scalable.

```
cashflow-banking/
├── app/                    # Next.js App Router
│   ├── (auth)/             #   Auth pages: sign-in, sign-up
│   ├── (root)/             #   Protected pages: /, my-banks, transaction-history, payment-transfer
│   ├── api/                #   API route handlers (REST)
│   │   ├── auth/           #     POST login, DELETE logout
│   │   ├── user/register/  #     POST registration
│   │   ├── accounts/       #     GET aggregated accounts
│   │   ├── account/        #     GET single account + transactions
│   │   ├── banks/          #     GET connected banks
│   │   ├── transactions/   #     GET list (paginated), POST create
│   │   ├── plaid/          #     create-link-token, webhook
│   │   └── error/          #     POST client error reporting
│   ├── layout.tsx          #   Root layout (fonts, theme provider)
│   └── globals.css         #   Tailwind layers + shared component classes
├── components/             # Reusable UI components (AuthForm, BankCard, …)
├── lib/                    # Core logic
│   ├── actions/            #   Server actions (user, bank, transaction, dwolla)
│   ├── appwrite.ts         #   Admin & session clients
│   ├── plaid.ts            #   Plaid client
│   ├── error-handler.ts    #   Typed AppError hierarchy
│   └── logger.ts           #   Structured logging
├── constants/              # Static data (sidebar links, category styles)
├── hooks/                  # Custom React hooks
├── types/                  # Global TypeScript declarations
├── docs/                   # Project documentation (this folder)
├── postman/                # Postman collection for route testing
└── public/                 # Static assets (icons, images)
```

### Key files at a glance

| File | Responsibility |
|---|---|
| `proxy.ts` | Middleware: security headers (CSP, X-Frame-Options), request logging |
| `lib/appwrite.ts` | `createAdminClient()` (API key) and `createSessionClient()` (user session) factories |
| `lib/actions/user.actions.ts` | signUp, signIn, getLoggedInUser, banks, Plaid token exchange |
| `lib/actions/bank.actions.ts` | getAccounts, getAccount, institution lookup, transferFunds |
| `lib/actions/dwolla.actions.ts` | Dwolla customers, funding sources, transfers |
| `lib/test-user.ts` | Mock demo user (`test-user-demo`) with 3 banks & 10 transactions |

## 4. Data Flow

### 4.1 Authentication flow

```
Sign-in form (React Hook Form + Zod)
  → signIn() server action
    → Appwrite createEmailPasswordSession
    → session secret stored in httpOnly cookie "appwrite-session"
    → user document fetched (or auto-created) from Appwrite DB
  → redirect to protected dashboard
```

### 4.2 Bank linking flow

```
PlaidLink (client) → createLinkToken() server action → Plaid Link Token
User completes Plaid Link → public_token
  → exchangePublicToken() server action
    → Plaid itemPublicTokenExchange → access_token
    → Plaid accountsGet → first account
    → Dwolla processor token → funding source (if customer exists)
    → createBankAccount() stores bank document in Appwrite
  → revalidatePath("/") refreshes dashboard
```

### 4.3 Transfer flow

```
PaymentTransferForm
  → transferFunds() server action
    → Dwolla createTransfer (source & destination funding sources)
    → createTransaction() stores transfer record in Appwrite
  → revalidatePath("/")
```

## 5. Design Decisions

- **Route handlers for external testing**: REST endpoints under `/api/*` mirror the server actions so tools like Postman (see `postman/postman.json`) can exercise the same logic.
- **Admin vs session clients**: Reads/writes that belong to the user go through `createSessionClient()`; privileged operations (registration, admin listing) use `createAdminClient()` with the server API key.
- **Mock demo user**: `userId === "test-user-demo"` short-circuits to in-memory mock data so the app and its Postman collection can be tested without Plaid/Appwrite credentials.
- **Central error handling**: `lib/error-handler.ts` provides `AppError` subclasses (ValidationError, AuthenticationError, …) and a consistent `{ success, error: { message, code, statusCode } }` response shape.
- **Security first**: httpOnly + sameSite=strict session cookies, strict CSP in middleware, no tokens ever exposed to the client bundle.
- **Revalidation strategy**: Mutations call `revalidatePath()` to keep SSR data fresh without client refetching.

## 6. Environment Variables

| Variable | Used by |
|---|---|
| `NEXT_PUBLIC_APPWRITE_ENDPOINT`, `NEXT_PUBLIC_APPWRITE_PROJECT` | Appwrite clients |
| `APPWRITE_DATABASE_ID`, `APPWRITE_*_COLLECTION_NAME` | Database access |
| `NEXT_APPWRITE_KEY` | Admin client (server-only) |
| `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV` | Plaid integration |
| `DWOLLA_KEY`, `DWOLLA_SECRET`, `DWOLLA_ENVIRONMENT` | Dwolla transfers |
| `SENTRY_*` | Monitoring |
