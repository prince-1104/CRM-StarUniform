import { getTenant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { getCachedClientList, getCachedProductList } from "@/lib/cached-queries";
import { EditInvoiceForm } from "./edit-invoice-form";

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const tenant = await getTenant();
  if (!tenant) return null;
  const { id } = await params;

  const [invoice, clients, products] = await Promise.all([
    prisma.invoice.findFirst({
      where: { id, organizationId: tenant.organizationId, deletedAt: null },
      include: { items: true, client: true },
    }),
    getCachedClientList(tenant.organizationId),
    getCachedProductList(tenant.organizationId),
  ]);

  if (!invoice) notFound();

  const items = invoice.items
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => ({
      id: item.id,
      productId: item.productId ?? undefined,
      name: item.name,
      description: item.description ?? undefined,
      quantity: Number(item.quantity),
      unit: item.unit,
      rate: Number(item.rate),
      gstPercent: Number(item.gstPercent),
    }));

  return (
    <EditInvoiceForm
      invoiceId={id}
      invoiceNumber={invoice.invoiceNumber}
      initialData={{
        clientId: invoice.clientId ?? "",
        invoiceDate: invoice.invoiceDate.toISOString().slice(0, 10),
        dueDate: invoice.dueDate ? invoice.dueDate.toISOString().slice(0, 10) : "",
        notes: invoice.notes ?? "",
        terms: invoice.terms ?? "",
        deliveryCharges: invoice.deliveryCharges != null ? Number(invoice.deliveryCharges) : undefined,
        advancePayment: invoice.advancePayment != null ? Number(invoice.advancePayment) : undefined,
        items: items.map(({ productId, name, description, quantity, unit, rate, gstPercent }) => ({
          productId,
          name,
          description,
          quantity,
          unit,
          rate,
          gstPercent,
        })),
      }}
      clients={clients}
      products={products}
    />
  );
}
