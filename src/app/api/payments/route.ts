import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireTenant } from "@/lib/auth";
import { createPaymentSchema } from "@/lib/validations/payment";
import { Decimal } from "@prisma/client/runtime/library";

export async function GET(req: NextRequest) {
  try {
    const tenant = await requireTenant();
    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get("invoiceId");
    if (!invoiceId)
      return Response.json({ error: "invoiceId required" }, { status: 400 });
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, organizationId: tenant.organizationId, deletedAt: null },
    });
    if (!invoice) return Response.json({ error: "Invoice not found" }, { status: 404 });
    const payments = await prisma.payment.findMany({
      where: { invoiceId, organizationId: tenant.organizationId },
      orderBy: { paidAt: "desc" },
    });
    return Response.json(payments);
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenant = await requireTenant();
    const body = await req.json();
    const parsed = createPaymentSchema.safeParse(body);
    if (!parsed.success)
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    const invoice = await prisma.invoice.findFirst({
      where: { id: parsed.data.invoiceId, organizationId: tenant.organizationId, deletedAt: null },
    });
    if (!invoice) return Response.json({ error: "Invoice not found" }, { status: 404 });
    const amount = parsed.data.amount;
    const paidAt = parsed.data.paidAt ? new Date(parsed.data.paidAt) : new Date();
    const currentPaid = Number(invoice.totalPaid);
    const grandTotal = Number(invoice.grandTotal);
    const newTotalPaid = currentPaid + amount;
    const status = newTotalPaid >= grandTotal ? "paid" : newTotalPaid > 0 ? "partial" : "unpaid";

    const [payment] = await prisma.$transaction([
      prisma.payment.create({
        data: {
          organizationId: tenant.organizationId,
          invoiceId: parsed.data.invoiceId,
          amount: new Decimal(amount),
          paidAt,
          method: parsed.data.method ?? null,
          reference: parsed.data.reference ?? null,
          notes: parsed.data.notes ?? null,
        },
      }),
      prisma.invoice.update({
        where: { id: parsed.data.invoiceId },
        data: { totalPaid: new Decimal(newTotalPaid), status },
      }),
    ]);
    return Response.json(payment);
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
