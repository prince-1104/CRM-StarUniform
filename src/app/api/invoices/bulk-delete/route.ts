import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireTenant } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const tenant = await requireTenant();
    const body = await req.json();
    const ids = Array.isArray(body?.ids) ? body.ids.filter((id: unknown) => typeof id === "string") : [];
    if (ids.length === 0) {
      return Response.json({ error: "No valid ids provided" }, { status: 400 });
    }
    await prisma.invoice.updateMany({
      where: {
        id: { in: ids },
        organizationId: tenant.organizationId,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
    return Response.json({ ok: true, count: ids.length });
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
