# Star Uniform — Architecture & Data Flow

This document describes the current architecture, directory structure, and data flow of the Star Uniform billing and invoicing application.

---

## 1. Overview

Star Uniform is a **multi-tenant SaaS** for small businesses: each tenant is an **Organization**. Users log in with email/password and are associated with one organization via **Membership** (owner or staff). All business data (clients, products, invoices, payments) is scoped by `organizationId`.

- **Stack:** Next.js 14 (App Router), TypeScript, PostgreSQL (Neon), Prisma, NextAuth (JWT), Tailwind, Radix/shadcn-style UI.
- **Deployment:** Vercel-friendly; serverless API routes; server and client components.

---

## 2. Directory Structure

```
starUniform.com/
├── prisma/
│   └── schema.prisma          # Data model (User, Organization, Client, Product, Invoice, Payment)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (Inter, Providers, globals.css)
│   │   ├── page.tsx           # Landing → redirect to /dashboard or /login
│   │   ├── (auth)/            # Route group: login, register
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/       # Route group: all authenticated app routes
│   │   │   ├── layout.tsx     # Auth check; wraps children in AppShell
│   │   │   └── dashboard/
│   │   │       ├── page.tsx   # Dashboard home (KPIs, charts, recent invoices)
│   │   │       ├── clients/   # List, [id], new
│   │   │       ├── catalogue/ # Products: list, [id], new
│   │   │       ├── invoices/  # List, [id], new, [id]/pdf
│   │   │       ├── quotations/# List, [id], new
│   │   │       ├── reports/   # Placeholder
│   │   │       ├── payments/  # Placeholder
│   │   │       └── settings/  # Organization form
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── [...nextauth]/route.ts
│   │       │   └── register/route.ts
│   │       ├── clients/       # GET list, POST create; [id] GET/PATCH/DELETE
│   │       ├── products/      # GET list, POST create; [id] GET/PATCH/DELETE
│   │       ├── invoices/      # GET list, POST create; [id] GET/PATCH; [id]/pdf GET
│   │       ├── payments/      # POST create
│   │       └── organization/  # GET, PATCH
│   ├── components/
│   │   ├── layout/
│   │   │   ├── app-shell.tsx       # Sidebar + Topbar + main content wrapper
│   │   │   ├── dashboard-sidebar.tsx # Collapsible nav, Quick Create, theme, logout
│   │   │   ├── topbar.tsx          # Search placeholder, notifications, user menu
│   │   │   └── page-header.tsx     # Title, description, actions
│   │   ├── ui/                 # Button, Card, Input, Label, Dialog, DropdownMenu
│   │   ├── forms/              # AddClientDialog
│   │   ├── invoice/
│   │   │   └── payment-info-display.tsx  # Bank/UPI details (collapsible, table layout)
│   │   ├── dashboard/
│   │   │   └── revenue-chart.tsx   # Recharts area chart
│   │   ├── theme-toggle.tsx
│   │   └── providers.tsx      # SessionProvider, ThemeProvider, QueryClientProvider
│   ├── lib/
│   │   ├── auth.ts            # getSession, getTenant, requireTenant
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── utils.ts           # cn, formatCurrency, formatDate, amountInWords, gstFromTaxable
│   │   ├── validations/       # Zod schemas: invoice, client, auth, product, payment
│   │   ├── cached-queries.ts  # getCachedClientList, getCachedProductList, getCachedInvoiceList
│   │   ├── dashboard-stats.ts # getCachedDashboardStats, getCachedRevenueChartData, getRecentInvoices, getTopClients
│   │   ├── invoice-number.ts  # getNextInvoiceNumber (used inside API transaction)
│   │   └── pdf-invoice.tsx   # React-PDF document; generateInvoicePdfBuffer
│   ├── stores/
│   │   └── ui.ts              # Zustand: sidebarCollapsed (persisted)
│   └── middleware.ts         # withAuth for /dashboard/* and /api/* (except auth)
├── .env / .env.example
├── tailwind.config.ts
├── package.json
├── README.md
├── architecture.md           # This file
└── DEPLOYMENT.md (optional)
```

---

## 3. Authentication & Multi-Tenancy

### 3.1 Auth Flow

1. **Register** (`POST /api/auth/register`): Creates `User`, `Organization`, and `Membership` (role: owner). Password is hashed with bcrypt.
2. **Login** (NextAuth Credentials): Lookup user by email, verify password, load first active membership → JWT receives `id`, `email`, `name`, `organizationId`, `role`.
3. **Session:** JWT strategy; no DB session table for credentials. `getServerSession(authOptions)` returns `session.user` with `id`, `organizationId`, `role` (extended in callbacks).
4. **Middleware:** `withAuth` protects `/dashboard/:path*` and `/api/clients|products|invoices|payments|organization`. Unauthenticated requests redirect to `/login`.

### 3.2 Tenant Context

- **`getTenant()`** (from `@/lib/auth`): Returns `{ userId, organizationId, role, email, name }` or `null`. Used in Server Components and API routes. Cached per request via `getSession()` cache.
- **`requireTenant()`**: Same but throws if not authenticated; used in API handlers.
- **Data isolation:** Every Prisma query for clients, products, invoices, payments includes `where: { organizationId: tenant.organizationId, deletedAt: null }` (or equivalent). Invoices also filter by `documentType` where needed.

---

## 4. Data Layer

### 4.1 Prisma Schema (Summary)

| Model         | Purpose |
|---------------|--------|
| User          | Auth identity; linked to Memberships. |
| Organization  | Tenant: name, logo, GST, address, phone, email, bankDetails, upiId, invoicePrefix/NextNumber, quotationPrefix/NextNumber. |
| Membership    | Links User to Organization with role (owner \| staff). |
| Client        | Tenant-scoped; name, phone, email, gstin, billingAddress, shippingAddress; soft delete. |
| Product       | Tenant-scoped; name, description, defaultPrice, gstPercent, unit; soft delete. |
| Invoice       | Tenant-scoped; clientId, documentType (invoice \| quotation), invoiceNumber, dates, status, amounts, notes, terms; soft delete. |
| InvoiceItem   | Line items: productId (optional), name, quantity, unit, rate, amount, gstPercent, gstAmount, sortOrder. |
| Payment       | Tenant-scoped; invoiceId, amount, paidAt, method, reference; updates invoice.totalPaid. |

Invoice number and quotation number are generated in a transaction: `Organization.invoiceNextNumber` / `quotationNextNumber` incremented, then e.g. `INV-00001` / `QOT-00001` built from prefix + padded number.

### 4.2 Caching & Revalidation

- **Dashboard stats:** `getCachedDashboardStats(orgId)` and `getCachedRevenueChartData(orgId)` use `unstable_cache` with tag `"dashboard-stats"` and 60s revalidate.
- **Lists:** `getCachedClientList`, `getCachedProductList`, `getCachedInvoiceList`, `getCachedClientPageList` in `cached-queries.ts` use `unstable_cache` with tags `"clients"`, `"products"`, `"invoices"`.
- **Revalidation:** After create/update of clients, products, or invoices, API routes call `revalidateTag("clients")` / `"products"` / `"invoices"` and `revalidateTag("dashboard-stats")` so cached data is refreshed.

---

## 5. Request & Data Flow

### 5.1 Page Load (e.g. Dashboard)

1. **Middleware:** Request to `/dashboard` → `withAuth` runs; if no session, redirect to `/login`.
2. **Layout** (`(dashboard)/layout.tsx`): Runs `getSession()`; if no `organizationId`, redirect to `/login`. Renders `AppShell` (client) with `children`.
3. **AppShell:** Renders `DashboardSidebar` (client, collapsible, Quick Create, nav links) and `Topbar` (search, notifications, user menu). Main content area has `max-w-content` and padding; `children` (page) render inside.
4. **Page** (e.g. `dashboard/page.tsx`): Server Component; calls `getTenant()`, then `getCachedDashboardStats(orgId)`, `getCachedRevenueChartData(orgId)`, `getRecentInvoices(orgId)`, `getTopClients(orgId)`. Renders KPIs (StatCard), revenue chart (Recharts), recent invoices, top clients.

### 5.2 Invoice Create Flow

1. **Page:** `dashboard/invoices/new/page.tsx` (server) loads cached clients and products, passes to `NewInvoiceForm` (client).
2. **Form:** React Hook Form + Zod (`createInvoiceSchema`). User selects client, dates, line items (product picker or manual), optional notes/terms; delivery/advance optional. Subtotal, GST, grand total computed client-side.
3. **Submit:** `POST /api/invoices` with JSON body. API uses `requireTenant()`, validates with `createInvoiceSchema`, then:
   - Runs a **transaction:** increment org’s invoice/quotation next number, build invoice number, create `Invoice` and `InvoiceItem` records, compute subtotal/totalGst/grandTotal (and optionally delivery/advance).
   - Calls `revalidateTag("invoices")` and `revalidateTag("dashboard-stats")`.
4. **Response:** Returns created invoice `{ id, ... }`. Client `router.push(`/dashboard/invoices/${id}`)` and `router.refresh()`.

### 5.3 Invoice Detail & PDF

- **Detail page:** Server Component loads invoice by `id` and `organizationId`, includes `items`, `client`, `organization`, `payments`. Renders From/Bill to (with address, email, phone), Items table, totals, payments, notes/terms, and at the end the **Payment information** block (Bank details + UPI via `PaymentInfoDisplay` client component).
- **PDF:** `GET /api/invoices/[id]/pdf` uses same tenant-scoped invoice fetch, then `generateInvoicePdfBuffer(invoice)` (React-PDF). Returns PDF buffer with `Content-Disposition: attachment`.

### 5.4 API Conventions

- **Auth:** All protected APIs call `requireTenant()` first. On failure they return `401 Unauthorized`.
- **Validation:** Request bodies are validated with Zod; on failure return `400` with error/details.
- **Scoping:** All Prisma reads/writes for business data use `tenant.organizationId` (and `deletedAt: null` where applicable).
- **Responses:** JSON for CRUD; PDF route returns binary.

---

## 6. UI Architecture

### 6.1 Layout Hierarchy

- **Root:** `layout.tsx` — HTML, body, Inter font, `Providers`, `globals.css`.
- **Dashboard:** `(dashboard)/layout.tsx` — auth check, then `AppShell` (sidebar + topbar + main). Main content is in a max-width container (`max-w-content`).
- **AppShell:** Client component; sidebar state (collapsed) is in Zustand with persistence.

### 6.2 Design System

- **Tokens:** `globals.css` defines CSS variables for light/dark (e.g. `--background`, `--foreground`, `--card`, `--primary`, `--surface`, `--success`, `--warning`, `--destructive`). Dark theme is SaaS-oriented (e.g. dark backgrounds).
- **Tailwind:** `tailwind.config.ts` extends colors from these variables, plus `surface`, `success`, `warning`, `max-w-content` (1280px). 8px spacing scale used where specified.
- **Components:** Radix primitives (Dialog, DropdownMenu, Select, Tabs, etc.) + CVA + `cn()` for variants. No separate shadcn package; built in `src/components/ui/`.

### 6.3 Key Client Components

- **DashboardSidebar:** Nav links (Dashboard, Clients, Invoices, Quotations, Products/Catalogue, Reports, Payments, Settings), Quick Create dropdown (Invoice/Client/Product), theme toggle, logout. Collapsible via Zustand.
- **Topbar:** Search placeholder (⌘K), notifications bell, user dropdown (Settings, Log out).
- **PaymentInfoDisplay:** Bank details and UPI in a table layout; “Hide Bank Details” / “Hide UPI Details” checkboxes; pencil link to settings. Used on invoice and quotation detail pages.
- **Forms:** Invoice and quotation creation are client forms (React Hook Form) with server-loaded initial data (clients, products).

---

## 7. Security & Conventions

- **Tenant isolation:** Never expose data across organizations; all queries filter by `organizationId` from `getTenant()` / `requireTenant()`.
- **Secrets:** `NEXTAUTH_SECRET`, `DATABASE_URL`, etc. in `.env`; not committed. `.env.example` documents variables.
- **Soft deletes:** Clients, products, invoices use `deletedAt`; list and stats queries exclude `deletedAt: null`.
- **Input:** All API inputs validated with Zod; Prisma used with parameterized queries.

---

## 8. Document Flow Summary

| Flow              | Entry              | Server / API                          | Client / UI                    |
|-------------------|--------------------|----------------------------------------|--------------------------------|
| Auth              | /login, /register  | NextAuth, register API                | Login/register forms           |
| Dashboard         | /dashboard         | getTenant, cached stats/chart/lists    | AppShell, StatCards, charts    |
| Invoices list     | /dashboard/invoices| Optional cached list; or API GET       | invoices-list (table)         |
| New invoice       | /dashboard/invoices/new | Cached clients/products              | NewInvoiceForm → POST /api/invoices |
| Invoice detail    | /dashboard/invoices/[id] | Prisma invoice + relations          | PaymentInfoDisplay, actions    |
| PDF download      | Link/button         | GET /api/invoices/[id]/pdf            | Browser download               |
| Clients / Catalogue | Similar list/[id]/new + API CRUD    | List, forms, dialogs                 |
| Settings          | /dashboard/settings| Load org; PATCH /api/organization     | OrganizationForm               |

This architecture keeps a clear separation: **auth and tenant in middleware/layout**, **data access and caching in lib and API**, and **UI in App Router pages and client components**, with strict organization scoping end-to-end.
