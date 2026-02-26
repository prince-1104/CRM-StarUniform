# UI Architecture

## Layouts

- **Root** (`src/app/layout.tsx`): Global layout with `Providers` (Session + React Query) and `globals.css`.
- **Auth** (`(auth)/login`, `(auth)/register`): Standalone pages; no shared layout.
- **Dashboard** (`(dashboard)/layout.tsx`): Sidebar + main area. All dashboard routes are under `/dashboard/*`.

## Data loading

- **Server Components**: Used for dashboard home, clients list, catalogue list, invoices list, invoice detail, settings. Data is fetched with `getTenant()` and Prisma in the same request; no client-side fetch for initial data.
- **Client Components**: Used for forms (login, register, new client, new product, edit product, new invoice, organization form), list filters (search, pagination), and invoice actions (record payment, PDF link). They call APIs via `fetch` or use router for navigation.

## Forms

- **React Hook Form + Zod**: All forms use `useForm` with `zodResolver(schema)` and schemas from `src/lib/validations/*`.
- **Server Actions**: Not used for mutations; all mutations go through `fetch` to API routes (easier to share with future mobile or external clients).

## State

- **Server state**: Lives in Server Components and is refetched on navigation or `router.refresh()` after mutations.
- **Client state**: Form state (RHF), UI toggles (e.g. “Record payment” form visibility). TanStack Query is available in `Providers` for optional caching; current implementation uses direct fetch + refresh.

## Key pages

| Route | Purpose |
|-------|---------|
| / | Landing with Login / Register links |
| /login | Credentials login form |
| /register | Register (user + org + owner membership) |
| /dashboard | Stats cards (revenue, pending, clients, invoices, products) |
| /dashboard/clients | Client list with search and pagination |
| /dashboard/clients/new | Create client form |
| /dashboard/clients/[id] | Client detail + recent invoices |
| /dashboard/catalogue | Product list with search and pagination |
| /dashboard/catalogue/new | Create product form |
| /dashboard/catalogue/[id] | Edit product form (client fetch + RHF) |
| /dashboard/invoices | Invoice list with status filter |
| /dashboard/invoices/new | Create invoice (dynamic item rows, client/product select) |
| /dashboard/invoices/[id] | Invoice detail, PDF download, record payment |
| /dashboard/settings | Organization profile form |

## Components

- **ui/** (shadcn-style): `Button`, `Input`, `Label`, `Card` (and subcomponents). Built with Tailwind and Radix where used.
- **layout/** : `DashboardSidebar` (nav links, logout).
- **providers.tsx**: `SessionProvider`, `QueryClientProvider`.

## Styling

- Tailwind with CSS variables in `globals.css` for theme (e.g. `--primary`, `--background`).
- No component library beyond Radix primitives used in ui components.
