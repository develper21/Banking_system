# 🎨 Design System

> **CashFlow — Clean. Secure. Effortless.**
>
> This document defines the visual design system, UI components, and user experience guidelines for CashFlow. The goal is to create a modern, minimal, and trustworthy banking interface with a consistent look and feel across the application.

---

## 1. Design Principles

| | | |
:---:|:---:|:---:
**🧭 User-Centered** | **🪶 Minimal & Clean** | **📦 Consistent**
Simple and intuitive for everyday banking users. | Reduce clutter and focus on financial clarity. | Follow a unified design system defined here.

## 2. Color Palette

Primary colors used across the application (defined in `tailwind.config.ts`).

### Brand

| Swatch | Token | Hex | Usage |
|---|---|---|---|
| 🟩 | `bankGradient` | `#86A789` | Primary buttons, links, active states |
| 🟩 | `bank-gradient` | `#4F6F52 → #739072` | Primary gradient background |
| 🟩 | `bank-green-gradient` | `#01797A → #489399` | Alternate card gradient |
| 🟩 | `green-1` | `rgb(112 147 111)` | Auth page side panel |

### Indigo

| Swatch | Token | Hex | Usage |
|---|---|---|---|
| 🟦 | `indigo-500` | `#6172F3` | Main brand accents, charts |
| 🟦 | `indigo-700` | `#3538CD` | Hover / pressed states |

### Semantic

| Swatch | Token | Hex | Usage |
|---|---|---|---|
| 🟢 | `success-600` | `#039855` | Success messages, completed transfers |
| 🟢 | `success-50` | `#ECFDF3` | Success backgrounds |
| 🔴 | `red-500/700` | Tailwind default | Error messages, validation alerts |
| 🟡 | `warning` | `#F59E0B` range | Warnings, caution states |
| 🩷 | `pink-500` | `#EE46BC` | Highlight badges, "Food and Drink" |
| 🔵 | `blue-500` | `#2E90FA` | Info, "Travel" category |

### Grays (text & surfaces)

| Token | Hex | Usage |
|---|---|---|
| `gray-25` | `#FCFCFD` | Page backgrounds |
| `gray-200` | `#EAECF0` | Borders, dividers |
| `gray-300` | `#D0D5DD` | Input borders |
| `gray-500` | `#667085` | Secondary text |
| `gray-600` | `#475467` | Labels, subtext |
| `gray-700` | `#344054` | Body text (`black-2`) |
| `gray-900` | `#101828` | Headings |
| `black-1` | `#00214F` | Logo / strong navy accents |

## 3. Typography

We use **Inter** as the primary font for a clean, modern and highly readable interface, with **IBM Plex Serif** for display numbers (balances, amounts).

| Element | Class | Size / Line |
|---|---|---|
| Display | `text-36` | 36px / 44px |
| H1 | `text-30` | 30px / 38px |
| H2 | `text-24` | 24px / 30px |
| H3 | `text-20` | 20px / 24px |
| Body | `text-16` | 16px / 24px |
| Small | `text-14` | 14px / 20px |
| Caption | `text-12` | 12px / 16px |
| Fine print | `text-10` | 10px / 14px |

Utilities: `font-inter`, `font-ibm-plex-serif`. Headings use `font-semibold text-gray-900`; secondary text uses `text-gray-600`.

## 4. UI Components

Standard components to be used throughout the application (`/components`).

### Buttons

| Variant | Class / Style |
|---|---|
| Primary | `form-btn` / `plaidlink-primary` — bank-gradient bg, white text, `shadow-form` |
| Secondary | `view-all-btn` — bordered, `text-gray-700` |
| Destructive | red bg for account removal / errors |

### Cards

- **Bank card**: `bank-card` — 320×190, 20px radius, `shadow-creditCard`, gradient face + logo side.
- **Total balance box**: `total-balance` — bordered, `shadow-chart`, doughnut chart + amounts.
- **Profile card**: `profile` — banner image, avatar ring, name/email.

### Forms

- Inputs: `input-class` — 16px, rounded-lg, `border-gray-300`.
- Labels: `form-label` — 14px medium `text-gray-700`.
- Errors: `form-message` — 12px red, rendered under the field.
- Layout: `form-item` vertical stack, `auth-form` centered 420px column.

### Navigation

- Sidebar (`sidebar`): 355px @ 2XL, sticky, `sidebar-link` hover states, `sidebar-label`.
- Mobile nav: sheet + `mobilenav-sheet` layout, icons + labels.

### Badges & Tables

- Category badge: `category-badge` — pill, 1.5px border, colored per `transactionCategoryStyles`.
- Transaction table: alternating hover rows, `pending` status chip, right-aligned amounts.
- Top categories: `topCategoryStyles` mapping (blue / success / pink variants).

## 5. Shadows & Effects

| Token | Value | Usage |
|---|---|---|
| `shadow-form` | `0 1px 2px rgba(16,24,40,.05)` | Inputs, buttons |
| `shadow-chart` | `0 1px 3px rgba(16,24,40,.10)` | Chart containers |
| `shadow-profile` | `0 12px 16px -4px rgba(16,24,40,.08)` | Avatar |
| `shadow-creditCard` | `8px 10px 16px rgba(0,0,0,.05)` | Bank cards, layouts |
| `glassmorphism` | `rgba(255,255,255,.25)` + blur | Overlay panels |
| `custom-scrollbar` | 3px thumb `#5c5c7b` | Scrollable columns |

## 6. Layout & Spacing

- Container: centered, 2rem padding, max `1400px` @ 2XL.
- Page padding: `p-8` (dashboard pages), `px-5 sm:px-8` on home.
- Section rhythm: `gap-8` between dashboard blocks.
- Breakpoints: mobile-first — `sm:640`, `md:768`, `xl:1280`, `2xl:1536`.

## 7. Accessibility & UX Rules

- Maintain ≥ 4.5:1 text contrast (grays chosen accordingly).
- Focus rings are never removed except inside sheets (`sheet-content`).
- Every icon-only control gets an accessible name.
- Forms validate on submit; errors are announced beside the field.
- Loading states: skeleton placeholders for balances and transaction tables.
