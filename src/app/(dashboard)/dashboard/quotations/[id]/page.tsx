import { getTenant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate, amountInWords } from "@/lib/utils";

export default async function QuotationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const tenant = await getTenant();
  if (!tenant) return null;
  const { id } = await params;
  const quotation = await prisma.invoice.findFirst({
    where: {
      id,
      organizationId: tenant.organizationId,
      deletedAt: null,
      documentType: "quotation",
    },
    include: { items: true, client: true, organization: true },
  });
  if (!quotation) notFound();

  const subtotal = Number(quotation.subtotal);
  const totalGst = Number(quotation.totalGst);
  const grandTotal = Number(quotation.grandTotal);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/quotations">← Quotations</Link>
          </Button>
          <h1 className="text-2xl font-bold">{quotation.invoiceNumber}</h1>
          <span className="text-muted-foreground">Quotation</span>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={`/api/invoices/${id}/pdf`} download>
            Download PDF
          </a>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>From</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="font-medium">{quotation.organization.name}</p>
            {quotation.organization.address && <p>{quotation.organization.address}</p>}
            {quotation.organization.gstNumber && <p>GSTIN: {quotation.organization.gstNumber}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quotation to</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="font-medium">{quotation.client.name}</p>
            {quotation.client.billingAddress && <p>{quotation.client.billingAddress}</p>}
            {quotation.client.gstin && <p>GSTIN: {quotation.client.gstin}</p>}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <p className="text-sm text-muted-foreground">
            Date: {formatDate(quotation.invoiceDate)}
            {quotation.dueDate && ` · Valid until: ${formatDate(quotation.dueDate)}`}
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3">Item</th>
                  <th className="text-right p-3">Qty</th>
                  <th className="text-right p-3">Rate</th>
                  <th className="text-right p-3">Amount</th>
                  <th className="text-right p-3">GST %</th>
                  <th className="text-right p-3">CGST</th>
                  <th className="text-right p-3">SGST</th>
                  <th className="text-right p-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((item) => {
                    const amt = Number(item.amount);
                    const gst = Number(item.gstAmount);
                    const half = gst / 2;
                    return (
                      <tr key={item.id} className="border-b">
                        <td className="p-3">{item.name}</td>
                        <td className="p-3 text-right">{Number(item.quantity)}</td>
                        <td className="p-3 text-right">₹{Number(item.rate).toFixed(2)}</td>
                        <td className="p-3 text-right">₹{amt.toFixed(2)}</td>
                        <td className="p-3 text-right">{Number(item.gstPercent)}%</td>
                        <td className="p-3 text-right">₹{half.toFixed(2)}</td>
                        <td className="p-3 text-right">₹{half.toFixed(2)}</td>
                        <td className="p-3 text-right">₹{(amt + gst).toFixed(2)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right space-y-1">
            <p>Subtotal: {formatCurrency(subtotal)}</p>
            <p>Total GST: {formatCurrency(totalGst)}</p>
            <p className="font-bold text-lg">Grand total: {formatCurrency(grandTotal)}</p>
            <p className="text-muted-foreground text-xs mt-2">
              In words: {amountInWords(grandTotal)}
            </p>
          </div>
        </CardContent>
      </Card>

      {(quotation.notes || quotation.terms) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Notes / Terms</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {quotation.notes && <p>{quotation.notes}</p>}
            {quotation.terms && <p className="mt-2">{quotation.terms}</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
