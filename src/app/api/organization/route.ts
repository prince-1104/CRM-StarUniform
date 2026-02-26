import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireTenant } from "@/lib/auth";
import { z } from "zod";

const updateOrgSchema = z.object({
  name: z.string().optional(),
  logo: z.string().optional(),
  gstNumber: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  bankDetails: z.string().nullable().optional(),
  upiId: z.string().nullable().optional(),
  invoicePrefix: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const tenant = await requireTenant();
    const body = await req.json();
    const parsed = updateOrgSchema.safeParse(body);
    if (!parsed.success)
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    const org = await prisma.organization.findFirst({
      where: { id: tenant.organizationId, deletedAt: null },
    });
    if (!org) return Response.json({ error: "Not found" }, { status: 404 });
    const updated = await prisma.organization.update({
      where: { id: tenant.organizationId },
      data: {
        ...(parsed.data.name !== undefined && { name: parsed.data.name }),
        ...(parsed.data.logo !== undefined && { logo: parsed.data.logo }),
        ...(parsed.data.gstNumber !== undefined && { gstNumber: parsed.data.gstNumber }),
        ...(parsed.data.address !== undefined && { address: parsed.data.address }),
        ...(parsed.data.phone !== undefined && { phone: parsed.data.phone }),
        ...(parsed.data.email !== undefined && { email: parsed.data.email }),
        ...(parsed.data.bankDetails !== undefined && { bankDetails: parsed.data.bankDetails }),
        ...(parsed.data.upiId !== undefined && { upiId: parsed.data.upiId }),
        ...(parsed.data.invoicePrefix !== undefined && { invoicePrefix: parsed.data.invoicePrefix }),
      },
    });
    return Response.json(updated);
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
