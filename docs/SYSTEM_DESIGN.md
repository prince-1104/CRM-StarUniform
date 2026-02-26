# SaaS Billing Software — System Design

## 1. Overview

Multi-tenant billing & invoicing SaaS for small businesses. Each business (organization) has isolated data via `organization_id` on every tenant-scoped table. No cross-tenant data is ever returned.

---

## 2. Folder Structure

```
starUniform.com/
├── prisma/
│   ├── schema.prisma          # Full schema (User, Org, Membership, Client, Product, Invoice, Payment)
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── (auth)/            # Auth layout group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/       # Protected dashboard layout
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx       # Dashboard home
│   │   │   ├── clients/
│   │   │   │   ├── page.tsx   # List
│   │   │   │   ├── new/
│   │   │   │   └── [id]/
│   │   │   ├── catalogue/
│   │   │   ├── invoices/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   └── [id]/
│   │   │   └── settings/      # Organization settings
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── clients/
│   │   │   ├── products/
│   │   │   ├── invoices/
│   │   │   └── payments/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                # shadcn components
│   │   ├── forms/             # Reusable form components
│   │   ├── invoice/           # Invoice layout, preview, PDF
│   │   └── layout/            # Sidebar, header
│   ├── lib/
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── auth.ts            # Auth config, getSession, getTenant
│   │   ├── tenant.ts          # Tenant context / scoping helpers
│   │   ├── utils.ts           # amountInWords, etc.
│   │   └── validations/       # Zod schemas
│   ├── hooks/                 # useClients, useInvoices, etc.
│   ├── actions/               # Server actions (mutations)
│   └── types/
├── public/
├── .env.example
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 3. Data Flow

- **Auth**: Credentials (email + password) → Auth.js session → `session.user.id` + `session.user.organizationId` + `session.user.role`.
- **Tenant resolution**: Every request (API or page) resolves tenant from session → `organization_id`. All DB queries use this ID; never from client.
- **Data fetch**: Server Components call `getTenant()` then Prisma with `where: { organizationId }`. No client-side DB.
- **Mutations**: Route handlers (POST/PATCH/DELETE) or Server Actions validate session, get `organizationId`, then run Prisma with tenant filter.
- **Rendering**: Dashboard = Server Components for lists + Client Components for forms/modals; TanStack Query or Zustand only for client-side UI state (e.g. form draft), not for server data.

---

## 4. Rendering Strategy

| Page / Feature        | Strategy |
|-----------------------|----------|
| Login / Register      | Client Component (form) + Server Action (auth) |
| Dashboard             | Server Component (fetch stats), no client fetch |
| Clients list          | Server Component + pagination (searchParams) |
| Client create/edit    | Client form (RHF + Zod) → Server Action or API |
| Catalogue             | Server Component list; Client form for add/edit |
| Invoice create        | Client (dynamic rows) → API POST → redirect |
| Invoice preview/detail| Server Component + Server-side PDF generation |
| PDF download          | Route handler or Server Action → PDF stream |

---

## 5. Multi-Tenancy Rules

1. **Shared DB, tenant by `organization_id`**: All tenant tables have `organizationId` (required). No row is ever read/updated without this filter.
2. **Resolution**: Tenant = current user’s active organization from `Membership`. Stored in session after login.
3. **Middleware**: Optional middleware can reject unauthenticated access to `/dashboard/*` and `/api/*` (except auth).
4. **API**: Every handler calls `getTenant(req)` (or equivalent); all Prisma calls include `where: { organizationId }`.

---

## 6. Security

- Passwords hashed (bcrypt) before store.
- Session contains only `userId`, `organizationId`, `role` (no sensitive DB fields).
- CSRF: Next.js + Auth.js handle CSRF for session auth.
- No raw SQL; Prisma only. Tenant ID never from query/body; only from session.

---

## 7. Future Extensions (Designed For)

- **Subscriptions**: Add `Subscription`, `Plan` tables; `organizationId` on both.
- **Email invoice**: Use Resend/SendGrid; queue job with `invoiceId` + `organizationId`.
- **WhatsApp**: Same pattern; external API with tenant-scoped credentials later.
- **Inventory**: Add `Product.inventoryQuantity`, `StockMovement` with `organizationId`.
- **Multi-user**: Already supported via `Membership`; add invite flow and more roles.

---

## 8. API Structure Summary

| Method | Path | Purpose |
|--------|------|---------|
| GET    | /api/clients | List clients (paginated, tenant-scoped) |
| POST   | /api/clients | Create client |
| GET    | /api/clients/[id] | Get one client |
| PATCH  | /api/clients/[id] | Update client |
| DELETE | /api/clients/[id] | Soft delete client |
| GET    | /api/products | List products (paginated) |
| POST   | /api/products | Create product |
| GET/PATCH/DELETE | /api/products/[id] | CRUD product |
| GET    | /api/invoices | List invoices (paginated) |
| POST   | /api/invoices | Create invoice + items |
| GET    | /api/invoices/[id] | Get invoice with items |
| PATCH  | /api/invoices/[id] | Update invoice |
| GET    | /api/invoices/[id]/pdf | Download PDF |
| GET    | /api/payments | List by invoice or org (tenant-scoped) |
| POST   | /api/payments | Record payment |

All responses validated with Zod; errors return consistent JSON shape.
