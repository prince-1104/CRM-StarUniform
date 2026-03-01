import { getTenant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InvoicesList from "./invoices-list";

const PAGE_SIZE = 20;

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const tenant = await getTenant();
  if (!tenant) return null;
  const { page = "1", status = "" } = await searchParams;
  const pageNum = Math.max(1, parseInt(page, 10));

  const where = {
    organizationId: tenant.organizationId,
    deletedAt: null,
    documentType: "invoice",
    ...(status ? { status } : {}),
  };

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { client: { select: { name: true } } },
    }),
    prisma.invoice.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
        <Button asChild className="rounded-lg bg-primary hover:bg-primary/90">
          <Link href="/dashboard/invoices/new">New invoice</Link>
        </Button>
      </div>
      <Card className="rounded-xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">All invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoicesList
            invoices={invoices}
            page={pageNum}
            totalPages={totalPages}
            total={total}
            status={status}
          />
        </CardContent>
      </Card>
    </div>
  );
}
