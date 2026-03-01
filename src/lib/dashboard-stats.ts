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

    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const in30Days = new Date(now);
    in30Days.setDate(in30Days.getDate() + 30);

    const [
      totalInvoices,
      totalClients,
      totalProducts,
      revenueAll,
      revenueMonth,
      revenueLastMonth,
      pendingInvoices,
      paidThisMonthAgg,
      upcomingCount,
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
      prisma.invoice.aggregate({
        where: {
          ...baseInvoiceWhere,
          status: "paid",
          invoiceDate: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { grandTotal: true },
      }),
      prisma.invoice.count({
        where: {
          ...baseInvoiceWhere,
          dueDate: { gte: now, lte: in30Days },
          status: { in: ["unpaid", "partial", "sent"] as const },
        },
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
      paidThisMonth: Number(paidThisMonthAgg._sum.grandTotal ?? 0),
      upcomingCount,
    };
  },
  ["dashboard-stats"],
  { revalidate: 60, tags: ["dashboard-stats"] }
);

/** Invoice totals by status for bar chart (Draft, Sent, Paid, Overdue) */
export const getCachedInvoiceByAmountChartData = unstable_cache(
  async (orgId: string) => {
    const now = new Date();
    const baseWhere = {
      organizationId: orgId,
      deletedAt: null,
      documentType: "invoice" as const,
    };
    const [draft, sent, paid, overdue] = await Promise.all([
      prisma.invoice.aggregate({
        where: { ...baseWhere, status: "draft" },
        _sum: { grandTotal: true },
      }),
      prisma.invoice.aggregate({
        where: { ...baseWhere, status: "sent" },
        _sum: { grandTotal: true },
      }),
      prisma.invoice.aggregate({
        where: { ...baseWhere, status: "paid" },
        _sum: { grandTotal: true },
      }),
      prisma.invoice.aggregate({
        where: {
          ...baseWhere,
          status: { in: ["unpaid", "partial"] as const },
          dueDate: { lt: now },
        },
        _sum: { grandTotal: true },
      }),
    ]);
    return [
      { status: "Draft", amount: Number(draft._sum.grandTotal ?? 0) },
      { status: "Sent", amount: Number(sent._sum.grandTotal ?? 0) },
      { status: "Paid", amount: Number(paid._sum.grandTotal ?? 0) },
      { status: "Overdue", amount: Number(overdue._sum.grandTotal ?? 0) },
    ];
  },
  ["invoice-by-amount-chart"],
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

/** Recent invoices for dashboard (with dueDate for table) */
export async function getRecentInvoices(orgId: string, limit = 10) {
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
      dueDate: true,
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
