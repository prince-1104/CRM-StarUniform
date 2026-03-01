import { getTenant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CatalogueList from "./catalogue-list";

const PAGE_SIZE = 20;

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const tenant = await getTenant();
  if (!tenant) return null;
  const { page = "1", search = "" } = await searchParams;
  const pageNum = Math.max(1, parseInt(page, 10));

  const where = {
    organizationId: tenant.organizationId,
    deletedAt: null,
    ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
  };

  const [rawProducts, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  const products = rawProducts.map((p) => ({
    id: p.id,
    name: p.name,
    defaultPrice: Number(p.defaultPrice),
    gstPercent: Number(p.gstPercent),
    unit: p.unit,
  }));

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Catalogue</h1>
        <Button asChild>
          <Link href="/dashboard/catalogue/new">Add product</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Products & services</CardTitle>
        </CardHeader>
        <CardContent>
          <CatalogueList
            products={products}
            page={pageNum}
            totalPages={totalPages}
            total={total}
            search={search}
          />
        </CardContent>
      </Card>
    </div>
  );
}
