import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireTenant } from "@/lib/auth";
import {
  mapInvoiceToDocumentData,
  generateInvoicePdf,
  generateQuotationPdf,
  getInvoicePdfFilename,
  getQuotationPdfFilename,
  DocumentValidationError,
} from "@/modules/documents";

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

    const data = mapInvoiceToDocumentData(invoice);
    const isQuotation = invoice.documentType === "quotation";

    const blob = isQuotation
      ? await generateQuotationPdf(data, 15)
      : await generateInvoicePdf(data);

    const filename = isQuotation
      ? getQuotationPdfFilename(invoice.invoiceNumber)
      : getInvoicePdfFilename(invoice.invoiceNumber);

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return new Response(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (e instanceof DocumentValidationError)
      return Response.json({ error: e.message }, { status: 400 });
    return Response.json(
      { error: e instanceof Error ? e.message : "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
