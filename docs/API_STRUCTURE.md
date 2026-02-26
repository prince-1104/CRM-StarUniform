# API Structure

All APIs require authentication (session). Tenant is derived from session; no `organization_id` is accepted from the client.

## Clients

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/clients | List clients (query: `page`, `search`) |
| POST | /api/clients | Create client (body: name, phone, email, gstin, billingAddress, shippingAddress) |
| GET | /api/clients/[id] | Get one client |
| PATCH | /api/clients/[id] | Update client (partial body) |
| DELETE | /api/clients/[id] | Soft delete client |

## Products

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/products | List products (query: `page`, `search`) |
| POST | /api/products | Create product (body: name, description, defaultPrice, gstPercent, unit) |
| GET | /api/products/[id] | Get one product |
| PATCH | /api/products/[id] | Update product |
| DELETE | /api/products/[id] | Soft delete product |

## Invoices

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/invoices | List invoices (query: `page`, `status`) |
| POST | /api/invoices | Create invoice (body: clientId, invoiceDate, dueDate?, notes?, terms?, items[]) |
| GET | /api/invoices/[id] | Get invoice with items, client, org, payments |
| GET | /api/invoices/[id]/pdf | Download PDF (attachment) |

## Payments

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/payments | List payments for an invoice (query: `invoiceId`) |
| POST | /api/payments | Record payment (body: invoiceId, amount, paidAt?, method?, reference?, notes?) |

## Organization

| Method | Path | Description |
|--------|------|-------------|
| PATCH | /api/organization | Update current org (body: name, logo, gstNumber, address, phone, email, bankDetails, upiId, invoicePrefix) |

## Auth (no session required)

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Register (body: name, email, password, confirmPassword, businessName) |
| * | /api/auth/[...nextauth] | NextAuth (login, session, signout) |

## Response shape

- Success: `200` with JSON body (object or `{ data, pagination }` for lists).
- Validation error: `400` with `{ error, details? }`.
- Not found: `404` with `{ error }`.
- Unauthorized: `401` with `{ error }`.
