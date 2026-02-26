# Deployment (Vercel + NeonDB)

## Environment variables

Set these in Vercel (Project → Settings → Environment Variables):

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon pooler connection string (with `?sslmode=require`) |
| `DIRECT_URL` | Neon direct connection string (for migrations) |
| `NEXTAUTH_SECRET` | Random string, e.g. `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Production URL, e.g. `https://your-app.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Same as `NEXTAUTH_URL` (optional, for links) |

## Database migrations

1. **First time (create tables):**
   - Locally: `npx prisma migrate dev --name init`
   - Commit the new folder under `prisma/migrations/`
   - On Vercel build we run `prisma generate`; run migrations separately or in a release step.

2. **Vercel build:**
   - Build command already runs `prisma generate && next build`.
   - To run migrations on deploy, add a custom build script that runs `prisma migrate deploy` before `next build`, or use Neon’s dashboard to run migrations, or run `prisma migrate deploy` in a CI step after deploy.

3. **Manual migrate (production):**
   ```bash
   DATABASE_URL="your-neon-direct-url" npx prisma migrate deploy
   ```

## Neon direct URL

Use the **direct** connection string for migrations (not the pooler). In Neon dashboard: Connection string → choose “Direct” and copy. Set as `DIRECT_URL`; use the pooler URL for `DATABASE_URL`.

## Post-deploy

1. Open the app URL and register a new business (user + organization).
2. Create a client, add a product, create an invoice, download PDF and record a payment to smoke-test.
