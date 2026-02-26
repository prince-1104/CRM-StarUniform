import { getTenant } from "@/lib/auth";
import { getCachedDashboardStats } from "@/lib/dashboard-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { FileText, Users, Package, IndianRupee } from "lucide-react";

export default async function DashboardPage() {
  const tenant = await getTenant();
  if (!tenant) return null;

  const stats = await getCachedDashboardStats(tenant.organizationId);
  const {
    totalInvoices,
    totalClients,
    totalProducts,
    totalRevenue,
    monthlyRevenue,
    pending,
  } = stats;

  const cards = [
    {
      title: "Total revenue",
      value: formatCurrency(totalRevenue),
      icon: IndianRupee,
      href: "/dashboard/invoices",
    },
    {
      title: "This month",
      value: formatCurrency(monthlyRevenue),
      icon: IndianRupee,
    },
    {
      title: "Pending payments",
      value: formatCurrency(pending),
      icon: IndianRupee,
    },
    {
      title: "Total clients",
      value: String(totalClients),
      icon: Users,
      href: "/dashboard/clients",
    },
    {
      title: "Total invoices",
      value: String(totalInvoices),
      icon: FileText,
      href: "/dashboard/invoices",
    },
    {
      title: "Products",
      value: String(totalProducts),
      icon: Package,
      href: "/dashboard/catalogue",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {c.title}
              </CardTitle>
              <c.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {c.href ? (
                <Link href={c.href} className="text-2xl font-bold hover:underline">
                  {c.value}
                </Link>
              ) : (
                <span className="text-2xl font-bold">{c.value}</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
