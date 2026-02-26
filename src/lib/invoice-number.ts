import { prisma } from "@/lib/db";

/** Get next invoice number for org and increment. Use inside prisma.$transaction when creating invoice. */
export async function getNextInvoiceNumber(organizationId: string): Promise<{
  prefix: string;
  number: number;
  full: string;
}> {
  const org = await prisma.organization.update({
    where: { id: organizationId },
    data: { invoiceNextNumber: { increment: 1 } },
    select: { invoicePrefix: true, invoiceNextNumber: true },
  });
  const full = `${org.invoicePrefix}-${String(org.invoiceNextNumber).padStart(5, "0")}`;
  return { prefix: org.invoicePrefix, number: org.invoiceNextNumber, full };
}
