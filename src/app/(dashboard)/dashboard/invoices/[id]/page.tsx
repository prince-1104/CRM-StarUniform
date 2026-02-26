import { getTenant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate, amountInWords } from "@/lib/utils";
import InvoiceActions from "./invoice-actions";
import { PaymentInfoDisplay } from "@/components/invoice/payment-info-display";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const tenant = await getTenant();
  if (!tenant) return null;
  const { id } = await params;
  const invoice = await prisma.invoice.findFirst({
    where: { id, organizationId: tenant.organizationId, deletedAt: null },
    include: { items: true, client: true, organization: true, payments: true },
  });
  if (!invoice) notFound();

  const subtotal = Number(invoice.subtotal);
  const totalGst = Number(invoice.totalGst);
  const deliveryCharges = invoice.deliveryCharges != null ? Number(invoice.deliveryCharges) : 0;
  const advancePayment = invoice.advancePayment != null ? Number(invoice.advancePayment) : 0;
  const grandTotal = Number(invoice.grandTotal);
  const totalPaid = Number(invoice.totalPaid);
  const pending = grandTotal - totalPaid;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/invoices">← Invoices</Link>
          </Button>
          <h1 className="text-2xl font-bold">{invoice.invoiceNumber}</h1>
          <span
            className={
              invoice.status === "paid"
                ? "text-green-600"
                : invoice.status === "partial"
                ? "text-amber-600"
                : "text-muted-foreground"
            }
          >
            {invoice.status}
          </span>
        </div>
        <InvoiceActions
          invoiceId={id}
          status={invoice.status}
          grandTotal={grandTotal}
          totalPaid={totalPaid}
          docNumber={invoice.invoiceNumber}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>From</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="font-medium">{invoice.organization.name}</p>
            {invoice.organization.address && <p className="text-muted-foreground">{invoice.organization.address}</p>}
            {invoice.organization.gstNumber && <p>GSTIN: {invoice.organization.gstNumber}</p>}
            {invoice.organization.email && (
              <p><a href={`mailto:${invoice.organization.email}`} className="text-primary hover:underline">{invoice.organization.email}</a></p>
            )}
            {invoice.organization.phone && (
              <p><a href={`tel:${invoice.organization.phone}`} className="text-primary hover:underline">{invoice.organization.phone}</a></p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bill to</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="font-medium">{invoice.client.name}</p>
            {(invoice.client.billingAddress || invoice.client.shippingAddress) && (
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Address: </span>
                {invoice.client.billingAddress || invoice.client.shippingAddress}
              </p>
            )}
            {invoice.client.gstin && <p>GSTIN: {invoice.client.gstin}</p>}
            {invoice.client.email && (
              <p><a href={`mailto:${invoice.client.email}`} className="text-primary hover:underline">{invoice.client.email}</a></p>
            )}
            {invoice.client.phone && (
              <p><a href={`tel:${invoice.client.phone}`} className="text-primary hover:underline">{invoice.client.phone}</a></p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <p className="text-sm text-muted-foreground">
            Date: {formatDate(invoice.invoiceDate)}
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
                  <th className="text-right p-3">GST Amt</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-3">{item.name}</td>
                      <td className="p-3 text-right">{Number(item.quantity)}</td>
                      <td className="p-3 text-right">₹{Number(item.rate).toFixed(2)}</td>
                      <td className="p-3 text-right">₹{Number(item.amount).toFixed(2)}</td>
                      <td className="p-3 text-right">{Number(item.gstPercent)}%</td>
                      <td className="p-3 text-right">₹{Number(item.gstAmount).toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right space-y-1 max-w-sm ml-auto">
            <p className="flex justify-between"><span>Subtotal</span> {formatCurrency(subtotal)}</p>
            <p className="flex justify-between"><span>Total GST</span> {formatCurrency(totalGst)}</p>
            {deliveryCharges > 0 && (
              <p className="flex justify-between"><span>Delivery charges</span> {formatCurrency(deliveryCharges)}</p>
            )}
            {advancePayment > 0 && (
              <p className="flex justify-between"><span>Advance paid</span> - {formatCurrency(advancePayment)}</p>
            )}
            <p className="font-bold text-lg flex justify-between pt-2 border-t mt-2">
              <span>Grand total</span> {formatCurrency(grandTotal)}
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              In words: {amountInWords(grandTotal)}
            </p>
          </div>
        </CardContent>
      </Card>

      {invoice.payments.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Payments</CardTitle>
            <p className="text-sm text-muted-foreground">
              Total paid: {formatCurrency(totalPaid)} | Pending: {formatCurrency(pending)}
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {invoice.payments.map((p) => (
                <li key={p.id} className="flex justify-between text-sm">
                  <span>
                    {formatDate(p.paidAt)} — {p.method ?? "—"}
                    {p.reference && ` (${p.reference})`}
                  </span>
                  <span>₹{Number(p.amount).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {(invoice.notes || invoice.terms) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Notes / Terms</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {invoice.notes && <p>{invoice.notes}</p>}
            {invoice.terms && <p className="mt-2">{invoice.terms}</p>}
          </CardContent>
        </Card>
      )}

      {(invoice.organization.bankDetails || invoice.organization.upiId) && (
        <PaymentInfoDisplay
          bankDetails={invoice.organization.bankDetails}
          upiId={invoice.organization.upiId}
          settingsUrl="/dashboard/settings"
        />
      )}
    </div>
  );
}
