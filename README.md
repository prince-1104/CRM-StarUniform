# Star Uniform — SaaS Billing & Invoicing

Multi-tenant billing and GST-ready invoicing for small businesses. Built with Next.js 14 (App Router), TypeScript, NeonDB (PostgreSQL), Prisma, NextAuth, Tailwind, and shadcn-style UI.

## Features

- **Multi-tenancy**: Shared database, tenant isolation by `organization_id`; every query is scoped.
- **Organization**: Business profile (name, logo, GST, address, bank, UPI, invoice prefix).
- **Clients**: CRUD with name, phone, email, GSTIN, billing/shipping address.
- **Catalogue**: Products/services with default price, GST %, unit.
- **Invoices**: Create with dynamic line items; auto invoice number per org; GST calculation; PDF download.
- **Payments**: Record payments per invoice; status (paid / partial / unpaid) and history.
- **Dashboard**: Total revenue, monthly revenue, pending payments, clients count, invoices count, products count.
- **Auth**: Credentials (email + password); register creates User + Organization + Membership (owner).

## Tech stack

- Next.js 14+ (App Router), TypeScript
- NeonDB (PostgreSQL), Prisma ORM
- NextAuth (credentials + JWT session with `organizationId` and `role`)
- Tailwind CSS, shadcn-style components (Radix + CVA)
- React Hook Form + Zod, TanStack Query, Zustand available
- @react-pdf/renderer for server-side PDF

## Getting started

1. **Clone and install**
   ```bash
   cd starUniform.com
   npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env`.
   - Set `DATABASE_URL` and `DIRECT_URL` (Neon pooler and direct).
   - Set `NEXTAUTH_SECRET` (e.g. `openssl rand -base64 32`) and `NEXTAUTH_URL` (e.g. `http://localhost:3000`).

3. **Database**
   ```bash
   npx prisma db push
   # or: npx prisma migrate dev --name init
   ```

4. **Run**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000). Register a business, then add clients, products, and invoices.

## Project structure

- `docs/` — SYSTEM_DESIGN.md, IMPLEMENTATION_PLAN.md, API_STRUCTURE.md, UI_ARCHITECTURE.md
- `prisma/schema.prisma` — Full schema (User, Organization, Membership, Client, Product, Invoice, InvoiceItem, Payment)
- `src/app/` — App Router: (auth), (dashboard), api/*
- `src/components/` — ui/*, layout/*, providers
- `src/lib/` — db, auth, tenant, utils, validations, pdf-invoice

## Deployment (Vercel + Neon)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for env vars, migration workflow, and Neon direct URL.

## Bonus features implemented

- Invoice number auto-increment per organization (in transaction with invoice create).
- Amount in words (Indian numbering) in `src/lib/utils.ts` and on PDF.
- GST auto-calculation (CGST/SGST split) in `src/lib/utils.ts` and invoice create.
- Reusable invoice layout in PDF (`src/lib/pdf-invoice.tsx`).
