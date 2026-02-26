import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

/** 
 * Cached across requests for 60 seconds per org. 
 * Revalidate on invoice/client/product create/update via revalidateTag.
 */
export const getCachedDashboardStats = unstable_cache(
  async (orgId: string) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const baseInvoiceWhere = {
      organizationId: orgId,
      deletedAt: null,
      documentType: "invoice" as const,
    };

    const [
      totalInvoices,
      totalClients,
      totalProducts,
      revenueAll,
      revenueMonth,
      pendingInvoices,
    ] = await Promise.all([
      prisma.invoice.count({ where: baseInvoiceWhere }),
      prisma.client.count({
        where: { organizationId: orgId, deletedAt: null },
      }),
      prisma.product.count({
        where: { organizationId: orgId, deletedAt: null },
      }),
      prisma.invoice.aggregate({
        where: baseInvoiceWhere,
        _sum: { grandTotal: true },
      }),
      prisma.invoice.aggregate({
        where: {
          ...baseInvoiceWhere,
          invoiceDate: { gte: startOfMonth },
        },
        _sum: { grandTotal: true },
      }),
      prisma.invoice.aggregate({
        where: {
          ...baseInvoiceWhere,
          status: { in: ["unpaid", "partial"] as const },
        },
        _sum: { grandTotal: true },
      }),
    ]);

    return {
      totalInvoices,
      totalClients,
      totalProducts,
      totalRevenue: Number(revenueAll._sum.grandTotal ?? 0),
      monthlyRevenue: Number(revenueMonth._sum.grandTotal ?? 0),
      pending: Number(pendingInvoices._sum.grandTotal ?? 0),
    };
  },
  ["dashboard-stats"],
  { revalidate: 60, tags: ["dashboard-stats"] }
);
