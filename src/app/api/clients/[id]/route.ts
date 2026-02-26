import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireTenant } from "@/lib/auth";
import { updateClientSchema } from "@/lib/validations/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await requireTenant();
    const { id } = await params;
    const client = await prisma.client.findFirst({
      where: { id, organizationId: tenant.organizationId, deletedAt: null },
    });
    if (!client) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(client);
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await requireTenant();
    const { id } = await params;
    const body = await req.json();
    const parsed = updateClientSchema.safeParse(body);
    if (!parsed.success)
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    const existing = await prisma.client.findFirst({
      where: { id, organizationId: tenant.organizationId, deletedAt: null },
    });
    if (!existing) return Response.json({ error: "Not found" }, { status: 404 });
    const client = await prisma.client.update({
      where: { id },
      data: {
        ...(parsed.data.name !== undefined && { name: parsed.data.name }),
        ...(parsed.data.phone !== undefined && { phone: parsed.data.phone }),
        ...(parsed.data.email !== undefined && { email: parsed.data.email || null }),
        ...(parsed.data.gstin !== undefined && { gstin: parsed.data.gstin }),
        ...(parsed.data.billingAddress !== undefined && { billingAddress: parsed.data.billingAddress }),
        ...(parsed.data.shippingAddress !== undefined && { shippingAddress: parsed.data.shippingAddress }),
      },
    });
    return Response.json(client);
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await requireTenant();
    const { id } = await params;
    const existing = await prisma.client.findFirst({
      where: { id, organizationId: tenant.organizationId, deletedAt: null },
    });
    if (!existing) return Response.json({ error: "Not found" }, { status: 404 });
    await prisma.client.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return Response.json({ ok: true });
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
