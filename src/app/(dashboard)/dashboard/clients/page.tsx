import { getTenant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClientsList from "./clients-list";

const PAGE_SIZE = 20;

export default async function ClientsPage({
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
      skip: (pageNum - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.client.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button asChild>
          <Link href="/dashboard/clients/new">Add client</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All clients</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientsList
            clients={clients}
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
