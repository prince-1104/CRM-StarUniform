# Step-by-Step Implementation Plan

## Phase 1: Project & DB
1. Initialize Next.js 14 (App Router), TypeScript, Tailwind.
2. Add Prisma, connect to NeonDB, define full schema with indexes and soft deletes.
3. Run migrations; verify tables and relations.

## Phase 2: Auth & Tenant
4. Install Auth.js (NextAuth) with Credentials provider; Prisma adapter for User/Session/Account.
5. Implement registration (create User + Organization + Membership as owner).
6. Implement login; store `organizationId` and `role` in session (JWT or DB session).
7. Add `getTenant()` helper that returns `{ organizationId, role }` from session; use in all API and server components.

## Phase 3: API Layer
8. Implement `/api/clients` (GET list with pagination, POST create) with Zod validation and tenant scoping.
9. Implement `/api/clients/[id]` (GET, PATCH, DELETE soft).
10. Same pattern for `/api/products` and `/api/products/[id]`.
11. Implement `/api/invoices` (GET list, POST create with items); `/api/invoices/[id]` (GET, PATCH); `/api/invoices/[id]/pdf` (GET → PDF).
12. Implement `/api/payments` (GET, POST) with tenant and invoice scoping.

## Phase 4: Lib & Utils
13. Add `amountInWords()` utility.
14. Add invoice number auto-increment per organization (Prisma transaction or raw query).
15. GST calculation helper (input: taxable amount, GST%; output: CGST, SGST, total).

## Phase 5: UI — Auth & Layout
16. Login page (form → credentials signIn).
17. Register page (form → create User + Org + Membership, then signIn).
18. Dashboard layout: sidebar (links to Dashboard, Clients, Catalogue, Invoices, Settings), header with org name and logout.

## Phase 6: UI — Modules
19. Dashboard home: server component fetching stats (revenue, pending, clients count, invoices count).
20. Clients: list (server, paginated), create client form (RHF + Zod), client detail page.
21. Catalogue: list products; add/edit product form.
22. Invoices: list (server, paginated); create invoice page with dynamic item rows (client component), preview; invoice detail view with payment status and history.
23. Settings: organization profile form (name, logo, GST, address, bank, UPI, invoice prefix).

## Phase 7: PDF & Polish
24. Server-side PDF generation: reusable invoice layout (logo, from/to, items, GST, total in words, bank, UPI QR placeholder); stream PDF for download.
25. Env structure (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL); document migration workflow for Vercel.
26. Middleware: protect `/dashboard` and `/api` (except auth routes); optional role check for staff vs owner.

## Phase 8: Deployment
27. Vercel project; connect repo; set env vars; run `prisma migrate deploy` in build or release phase.
28. Smoke test: register → create client → product → invoice → PDF download.
