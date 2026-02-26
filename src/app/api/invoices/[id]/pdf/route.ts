import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireTenant } from "@/lib/auth";
import { generateInvoicePdfBuffer } from "@/lib/pdf-invoice";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await requireTenant();
    const { id } = await params;
    const invoice = await prisma.invoice.findFirst({
      where: { id, organizationId: tenant.organizationId, deletedAt: null },
      include: { items: true, client: true, organization: true },
    });
    if (!invoice) return Response.json({ error: "Not found" }, { status: 404 });
    const pdfBuffer = await generateInvoicePdfBuffer(invoice);
    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${invoice.documentType === "quotation" ? "quotation" : "invoice"}-${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
