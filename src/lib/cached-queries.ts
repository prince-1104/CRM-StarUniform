import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

const PAGE_SIZE = 20;

/** Cached client list for dropdown selects — revalidates every 30s or on tag. */
export const getCachedClientList = unstable_cache(
  async (orgId: string) => {
    return prisma.client.findMany({
      where: { organizationId: orgId, deletedAt: null },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
      take: 500,
    });
  },
  ["client-list"],
  { revalidate: 30, tags: ["clients"] }
);

/** Cached product list for dropdown selects — revalidates every 30s or on tag. Returns plain numbers for defaultPrice/gstPercent (no Prisma Decimal). */
export const getCachedProductList = unstable_cache(
  async (orgId: string) => {
    const rows = await prisma.product.findMany({
      where: { organizationId: orgId, deletedAt: null },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        defaultPrice: true,
        gstPercent: true,
        unit: true,
      },
      take: 500,
    });
    return rows.map((p) => ({
      id: p.id,
      name: p.name,
      defaultPrice: Number(p.defaultPrice),
      gstPercent: Number(p.gstPercent),
      unit: p.unit,
    }));
  },
  ["product-list"],
  { revalidate: 30, tags: ["products"] }
);

/** Cached paginated invoice list — short cache (10s) for list pages. */
export const getCachedInvoiceList = unstable_cache(
  async (orgId: string, page: number, status?: string, documentType: string = "invoice") => {
    const where = {
      organizationId: orgId,
      deletedAt: null,
      documentType,
      ...(status ? { status } : {}),
    };
    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: { client: { select: { name: true } } },
      }),
      prisma.invoice.count({ where }),
    ]);
    return { invoices, total, totalPages: Math.ceil(total / PAGE_SIZE) };
  },
  ["invoice-list"],
  { revalidate: 10, tags: ["invoices"] }
);

/** Cached paginated client list — short cache (10s) for list pages. */
export const getCachedClientPageList = unstable_cache(
  async (orgId: string, page: number, search?: string) => {
    const where = {
      organizationId: orgId,
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };
    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.client.count({ where }),
    ]);
    return { clients, total, totalPages: Math.ceil(total / PAGE_SIZE) };
  },
  ["client-page-list"],
  { revalidate: 10, tags: ["clients"] }
);
