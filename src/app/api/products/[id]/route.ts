import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireTenant } from "@/lib/auth";
import { updateProductSchema } from "@/lib/validations/product";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await requireTenant();
    const { id } = await params;
    const product = await prisma.product.findFirst({
      where: { id, organizationId: tenant.organizationId, deletedAt: null },
    });
    if (!product) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(product);
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
    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success)
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    const existing = await prisma.product.findFirst({
      where: { id, organizationId: tenant.organizationId, deletedAt: null },
    });
    if (!existing) return Response.json({ error: "Not found" }, { status: 404 });
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(parsed.data.name !== undefined && { name: parsed.data.name }),
        ...(parsed.data.description !== undefined && { description: parsed.data.description }),
        ...(parsed.data.defaultPrice !== undefined && { defaultPrice: parsed.data.defaultPrice }),
        ...(parsed.data.gstPercent !== undefined && { gstPercent: parsed.data.gstPercent }),
        ...(parsed.data.unit !== undefined && { unit: parsed.data.unit }),
      },
    });
    return Response.json(product);
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
    const existing = await prisma.product.findFirst({
      where: { id, organizationId: tenant.organizationId, deletedAt: null },
    });
    if (!existing) return Response.json({ error: "Not found" }, { status: 404 });
    await prisma.product.update({
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
