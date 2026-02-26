import { cache } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type Tenant = {
  userId: string;
  organizationId: string;
  role: "owner" | "staff";
  email: string;
  name?: string | null;
};

/** Cached per request — use this in layout + pages to avoid duplicate session fetches. */
export const getSession = cache(async () => getServerSession(authOptions));

/** Use in API routes and Server Components. Returns null if not authenticated or no org. */
export async function getTenant(): Promise<Tenant | null> {
  const session = await getSession();
  if (!session?.user?.id || !session?.user?.organizationId || !session?.user?.role) return null;
  return {
    userId: session.user.id,
    organizationId: session.user.organizationId,
    role: session.user.role as "owner" | "staff",
    email: session.user.email ?? "",
    name: session.user.name ?? null,
  };
}

/** Throws if not authenticated or no tenant. Use in API handlers that require auth. */
export async function requireTenant(): Promise<Tenant> {
  const t = await getTenant();
  if (!t) throw new Error("Unauthorized");
  return t;
}
