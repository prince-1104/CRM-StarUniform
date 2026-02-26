"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Invoice = {
  id: string;
  invoiceNumber: string;
  invoiceDate: Date;
  grandTotal: { toString(): string };
  status: string;
  client: { name: string };
};

export default function InvoicesList({
  invoices,
  page,
  totalPages,
  total,
  status,
}: {
  invoices: Invoice[];
  page: number;
  totalPages: number;
  total: number;
  status: string;
}) {
  const router = useRouter();
  const statuses = ["", "draft", "sent", "unpaid", "partial", "paid"];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {statuses.map((s) => (
          <Button
            key={s || "all"}
            variant={status === s ? "default" : "outline"}
            size="sm"
            onClick={() =>
              router.push(
                `/dashboard/invoices?status=${s}&page=1`
              )
            }
          >
            {s || "All"}
          </Button>
        ))}
      </div>
      {invoices.length === 0 ? (
        <p className="text-muted-foreground">No invoices yet.</p>
      ) : (
        <>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3">Number</th>
                  <th className="text-left p-3">Client</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-right p-3">Amount</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b last:border-0">
                    <td className="p-3">
                      <Link
                        href={`/dashboard/invoices/${inv.id}`}
                        className="font-medium hover:underline"
                      >
                        {inv.invoiceNumber}
                      </Link>
                    </td>
                    <td className="p-3">{inv.client.name}</td>
                    <td className="p-3">
                      {new Date(inv.invoiceDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="p-3 text-right">₹{Number(inv.grandTotal).toFixed(2)}</td>
                    <td className="p-3">
                      <span
                        className={
                          inv.status === "paid"
                            ? "text-green-600"
                            : inv.status === "partial"
                            ? "text-amber-600"
                            : "text-muted-foreground"
                        }
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/invoices/${inv.id}`}>View</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Page {page} of {totalPages} ({total} total)</span>
            <div className="flex gap-2">
              {page > 1 && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/invoices?page=${page - 1}${status ? `&status=${status}` : ""}`}>
                    Previous
                  </Link>
                </Button>
              )}
              {page < totalPages && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/invoices?page=${page + 1}${status ? `&status=${status}` : ""}`}>
                    Next
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
