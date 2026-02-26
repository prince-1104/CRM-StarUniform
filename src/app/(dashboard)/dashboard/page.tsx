import Link from "next/link";
import { getTenant } from "@/lib/auth";
import {
  getCachedDashboardStats,
  getCachedRevenueChartData,
  getRecentInvoices,
  getTopClients,
} from "@/lib/dashboard-stats";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { formatCurrency } from "@/lib/utils";
import {
  IndianRupee,
  Users,
  Package,
  FileText,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const tenant = await getTenant();
  if (!tenant) return null;

  const [stats, chartData, recentInvoices, topClients] = await Promise.all([
    getCachedDashboardStats(tenant.organizationId),
    getCachedRevenueChartData(tenant.organizationId),
    getRecentInvoices(tenant.organizationId, 5),
    getTopClients(tenant.organizationId, 5),
  ]);

  const {
    totalInvoices,
    totalClients,
    totalProducts,
    totalRevenue,
    monthlyRevenue,
    revenueTrend,
    pending,
  } = stats;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here’s what’s happening with your business."
        actions={
          <div className="flex gap-2">
            <Button asChild size="sm">
              <Link href="/dashboard/invoices/new">
                <Plus className="h-4 w-4 mr-2" />
                New invoice
              </Link>
            </Button>
          </div>
        }
      />

      {/* Row 1 — KPI cards with trend */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenue (this month)"
          value={formatCurrency(monthlyRevenue)}
          trend={{ value: revenueTrend, label: "from last month" }}
          icon={IndianRupee}
        />
        <StatCard
          title="Total revenue"
          value={formatCurrency(totalRevenue)}
          icon={IndianRupee}
          href="/dashboard/invoices"
        />
        <StatCard
          title="Pending payments"
          value={formatCurrency(pending)}
          icon={IndianRupee}
        />
        <StatCard
          title="Clients"
          value={String(totalClients)}
          icon={Users}
          href="/dashboard/clients"
        />
        <StatCard
          title="Invoices"
          value={String(totalInvoices)}
          icon={FileText}
          href="/dashboard/invoices"
        />
        <StatCard
          title="Products"
          value={String(totalProducts)}
          icon={Package}
          href="/dashboard/catalogue"
        />
      </div>

      {/* Row 2 — Revenue chart + Payment status */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Revenue over time</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={chartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Payment status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pending</span>
              <span className="font-medium">{formatCurrency(pending)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Collected (total)</span>
              <span className="font-medium">{formatCurrency(totalRevenue - pending)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3 — Recent invoices + Top clients */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Recent invoices</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/invoices">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentInvoices.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No invoices yet. Create your first invoice to get started.
              </p>
            ) : (
              <ul className="space-y-2">
                {recentInvoices.map((inv) => (
                  <li key={inv.id}>
                    <Link
                      href={`/dashboard/invoices/${inv.id}`}
                      className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                    >
                      <span>
                        {inv.invoiceNumber} · {inv.client.name}
                      </span>
                      <span className="font-medium tabular-nums">
                        {formatCurrency(Number(inv.grandTotal))}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Top clients</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/clients">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {topClients.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No clients yet. Add your first client to start invoicing.
              </p>
            ) : (
              <ul className="space-y-2">
                {topClients.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/dashboard/clients/${c.id}`}
                      className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                    >
                      <span>{c.name}</span>
                      <span className="text-muted-foreground">{c.invoiceCount} invoices</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
