import { getTenant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const tenant = await getTenant();
  if (!tenant) return null;
  const { id } = await params;
  const client = await prisma.client.findFirst({
    where: { id, organizationId: tenant.organizationId, deletedAt: null },
    include: {
      invoices: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
  if (!client) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/clients">← Clients</Link>
          </Button>
          <h1 className="text-2xl font-bold">{client.name}</h1>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/invoices/new?clientId=${client.id}`}>
            Create invoice
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Email:</span> {client.email ?? "—"}</p>
            <p><span className="text-muted-foreground">Phone:</span> {client.phone ?? "—"}</p>
            <p><span className="text-muted-foreground">GSTIN:</span> {client.gstin ?? "—"}</p>
            {client.billingAddress && (
              <p><span className="text-muted-foreground">Billing:</span> {client.billingAddress}</p>
            )}
            {client.shippingAddress && (
              <p><span className="text-muted-foreground">Shipping:</span> {client.shippingAddress}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {client.invoices.length === 0 ? (
              <p className="text-muted-foreground text-sm">No invoices yet.</p>
            ) : (
              <ul className="space-y-2">
                {client.invoices.map((inv) => (
                  <li key={inv.id} className="flex justify-between text-sm">
                    <Link
                      href={`/dashboard/invoices/${inv.id}`}
                      className="hover:underline"
                    >
                      {inv.invoiceNumber}
                    </Link>
                    <span>₹{Number(inv.grandTotal).toFixed(2)} — {inv.status}</span>
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
