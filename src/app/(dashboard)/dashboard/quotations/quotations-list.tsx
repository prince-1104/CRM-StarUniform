"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type Quotation = {
  id: string;
  invoiceNumber: string;
  invoiceDate: Date;
  grandTotal: { toString(): string };
  status: string;
  client: { name: string };
};

export default function QuotationsList({
  quotations,
  page,
  totalPages,
  total,
}: {
  quotations: Quotation[];
  page: number;
  totalPages: number;
  total: number;
}) {
  return (
    <div className="space-y-4">
      {quotations.length === 0 ? (
        <p className="text-muted-foreground">No quotations yet. Create your first quotation.</p>
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
                {quotations.map((q) => (
                  <tr key={q.id} className="border-b last:border-0">
                    <td className="p-3">
                      <Link
                        href={`/dashboard/quotations/${q.id}`}
                        className="font-medium hover:underline"
                      >
                        {q.invoiceNumber}
                      </Link>
                    </td>
                    <td className="p-3">{q.client.name}</td>
                    <td className="p-3">
                      {new Date(q.invoiceDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="p-3 text-right">₹{Number(q.grandTotal).toFixed(2)}</td>
                    <td className="p-3 text-muted-foreground">{q.status}</td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/quotations/${q.id}`}>View</Link>
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
                  <Link href={`/dashboard/quotations?page=${page - 1}`}>Previous</Link>
                </Button>
              )}
              {page < totalPages && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/quotations?page=${page + 1}`}>Next</Link>
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
