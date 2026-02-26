import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireTenant } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await requireTenant();
    const { id } = await params;
    const invoice = await prisma.invoice.findFirst({
      where: { id, organizationId: tenant.organizationId, deletedAt: null },
      include: { items: true, client: true, organization: true, payments: true },
    });
    if (!invoice) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(invoice);
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
