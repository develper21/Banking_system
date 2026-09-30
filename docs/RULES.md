# 📋 Development Rules

> **CashFlow — Project Guidelines for AI & Human Collaboration**
>
> This document defines the development rules, coding standards, and best practices for the CashFlow banking application. These rules ensure consistency, maintainability, security, and quality. Both AI assistants and human contributors must follow these guidelines.

---

## 1️⃣ General Principles

These rules apply to the entire project.

- ✅ Follow the project documentation (PRD, ARCHITECTURE, DESIGN) before building any feature.
- ✅ Keep the code clean, readable and well-structured.
- ✅ Prioritize simplicity and maintainability.
- ✅ Do not duplicate logic. Reuse existing components, utilities or services.
- ✅ Make small, focused changes instead of large, risky edits.
- ✅ Do not modify unrelated files.
- ✅ Write self-explanatory code with meaningful variable and function names.

## 2️⃣ Technology & Coding Standards

Rules related to the tech stack and coding style.

| Category | Rule |
|---|---|
| 🧠 Language | Use **TypeScript**. Avoid `any` unless absolutely necessary — prefer the global types in `types/index.d.ts`. |
| 🏗 Framework | Follow **Next.js (App Router)** best practices. Server components by default; `"use client"` only where interactivity demands it. |
| 🎨 Styling | Use **Tailwind CSS** and follow the design system in [DESIGN.md](DESIGN.md). Never inline raw hex values in components. |
| 🔍 Linting | Follow **ESLint** (`eslint-config-next`). Zero errors before merge. |
| 🖋 Formatting | Use **Prettier** — 2-space indent, single quotes, trailing commas. |
| 📦 Dependencies | Use stable, well-maintained packages only. Ask before adding a new dependency. |
| 📁 File Naming | Use clear and consistent names: `PascalCase.tsx` for components, `camelCase.ts` for utilities, `kebab-case` for route folders. |

## 3️⃣ Project Structure

Follow the folder structure defined in [ARCHITECTURE.md](ARCHITECTURE.md).

- ✅ Place reusable UI components in `/components`.
- ✅ Feature-specific code should be in `/lib/actions` (server) or colocated hooks (`/hooks`).
- ✅ Database and external service logic should be in `/lib` (`appwrite.ts`, `plaid.ts`, `dwolla.actions.ts`).
- ✅ Common utilities should be in `/lib` (`utils.ts`, `logger.ts`, `error-handler.ts`).
- ✅ Types and interfaces should be placed in `/types/index.d.ts` (global) — keep component props close to their component when local.
- ✅ Do not create new folders without a clear purpose and a matching doc update.

## 4️⃣ Server Actions & API Routes

- ✅ Validate every request body — fail fast with `ValidationError` (400) before touching external services.
- ✅ Return consistent JSON: success → `{ success: true, data }`; failure → `{ success: false, error: { message, code, statusCode } }` via `createErrorResponse()`.
- ✅ Use `createSessionClient()` for user-scoped operations; `createAdminClient()` only when privileges are genuinely required.
- ✅ Never trust client-supplied `userId` for privileged reads — derive from the session cookie when possible.
- ✅ Guard writes (`POST /api/transactions`, Plaid link token) with the session cookie — return **401** when absent.
- ✅ Log the start and outcome of every auth event via `lib/logger.ts`.

## 5️⃣ Security Rules

- ✅ Session cookies must stay `httpOnly`, `sameSite: "strict"`, `secure` in production.
- ✅ Never expose Appwrite API keys, Plaid secrets, or Dwolla keys to the client — server-only env vars.
- ✅ Keep the CSP and security headers in `proxy.ts` intact; extend rather than weaken.
- ✅ Encrypt/shareable ids via `encryptId()` — never expose raw account ids.
- ✅ Validate and sanitize anything that reaches Appwrite queries.
- ✅ Never commit `.env` files or tokens.

## 6️⃣ Git & Collaboration

- ✅ Branch from `main`; use descriptive names (`feat/plaid-webhook`, `fix/txn-pagination`).
- ✅ Commits: small, atomic, imperative subject lines ("Add transaction pagination guard").
- ✅ Never commit directly to `main` for substantive changes.
- ✅ PRs must pass `npm run lint`, `npm run build`, and `npm test`.
- ✅ Update the relevant docs (`docs/TASKS.md`, `docs/MEMORY.md`) when scope changes.

## 7️⃣ Testing & Quality

- ✅ New API routes need Postman requests in `postman/postman.json` with `pm.test` assertions.
- ✅ Guard clauses (missing params, unauthorized) must have tests — see the ✅ requests in the collection.
- ✅ Unit-test pure utilities in `/lib` with Jest (`npm test`).
- ✅ Keep the mock test user (`test-user-demo`) working — it powers demo testing without credentials.

## 8️⃣ Documentation Rules

- ✅ Keep `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN.md` current when architecture or UI changes.
- ✅ Mark task status in `docs/TASKS.md` as work progresses; record state snapshots in `docs/MEMORY.md`.
- ✅ Document every new route (method, params, response shape) in the Postman collection description.
