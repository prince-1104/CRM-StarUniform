import { getTenant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuotationsList from "./quotations-list";

const PAGE_SIZE = 20;

export default async function QuotationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const tenant = await getTenant();
  if (!tenant) return null;
  const { page = "1" } = await searchParams;
  const pageNum = Math.max(1, parseInt(page, 10));

  const where = {
    organizationId: tenant.organizationId,
    deletedAt: null,
    documentType: "quotation",
  };

  const [quotations, total] = await Promise.all([
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quotations</h1>
        <Button asChild>
          <Link href="/dashboard/quotations/new">New quotation</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All quotations</CardTitle>
        </CardHeader>
        <CardContent>
          <QuotationsList
            quotations={quotations}
            page={pageNum}
            totalPages={totalPages}
            total={total}
          />
        </CardContent>
      </Card>
    </div>
  );
}
