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
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
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
      revenueLastMonth,
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
          invoiceDate: { gte: startOfLastMonth, lte: endOfLastMonth },
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

    const monthlyRevenue = Number(revenueMonth._sum.grandTotal ?? 0);
    const previousMonthRevenue = Number(revenueLastMonth._sum.grandTotal ?? 0);
    const revenueTrend =
      previousMonthRevenue > 0
        ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
        : (monthlyRevenue > 0 ? 100 : 0);

    return {
      totalInvoices,
      totalClients,
      totalProducts,
      totalRevenue: Number(revenueAll._sum.grandTotal ?? 0),
      monthlyRevenue,
      previousMonthRevenue,
      revenueTrend,
      pending: Number(pendingInvoices._sum.grandTotal ?? 0),
    };
  },
  ["dashboard-stats"],
  { revalidate: 60, tags: ["dashboard-stats"] }
);

/** Last 6 months revenue for chart */
export const getCachedRevenueChartData = unstable_cache(
  async (orgId: string) => {
    const now = new Date();
    const months: { label: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      const agg = await prisma.invoice.aggregate({
        where: {
          organizationId: orgId,
          deletedAt: null,
          documentType: "invoice",
          invoiceDate: { gte: start, lte: end },
        },
        _sum: { grandTotal: true },
      });
      months.push({
        label: start.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
        revenue: Number(agg._sum.grandTotal ?? 0),
      });
    }
    return months;
  },
  ["revenue-chart"],
  { revalidate: 60, tags: ["dashboard-stats"] }
);

/** Recent invoices for dashboard */
export async function getRecentInvoices(orgId: string, limit = 5) {
  return prisma.invoice.findMany({
    where: { organizationId: orgId, deletedAt: null, documentType: "invoice" },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      invoiceNumber: true,
      grandTotal: true,
      status: true,
      invoiceDate: true,
      client: { select: { name: true } },
    },
  });
}

/** Top clients by invoice count for dashboard */
export async function getTopClients(orgId: string, limit = 5) {
  const clients = await prisma.client.findMany({
    where: { organizationId: orgId, deletedAt: null },
    select: {
      id: true,
      name: true,
      _count: { select: { invoices: true } },
    },
    take: 50,
  });
  return clients
    .sort((a, b) => b._count.invoices - a._count.invoices)
    .slice(0, limit)
    .map((c) => ({ id: c.id, name: c.name, invoiceCount: c._count.invoices }));
}
