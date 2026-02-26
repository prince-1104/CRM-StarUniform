"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InvoiceActions({
  invoiceId,
  status,
  grandTotal,
  totalPaid,
}: {
  invoiceId: string;
  status: string;
  grandTotal: number;
  totalPaid: number;
}) {
  const router = useRouter();
  const [showPayment, setShowPayment] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("upi");
  const [submitting, setSubmitting] = useState(false);

  const pending = grandTotal - totalPaid;

  async function handleRecordPayment(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId,
          amount: amt,
          method,
        }),
      });
      if (!res.ok) {
        const j = await res.json();
        alert(j.error ?? "Failed");
        return;
      }
      setShowPayment(false);
      setAmount("");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" asChild>
        <a href={`/api/invoices/${invoiceId}/pdf`} download>
          Download PDF
        </a>
      </Button>
      {(status === "unpaid" || status === "partial") && pending > 0 && (
        <>
          {!showPayment ? (
            <Button variant="default" size="sm" onClick={() => setShowPayment(true)}>
              Record payment
            </Button>
          ) : (
            <form onSubmit={handleRecordPayment} className="flex items-end gap-2">
              <div>
                <Label className="text-xs">Amount (₹)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={String(pending)}
                  className="h-9 w-24"
                />
              </div>
              <div>
                <Label className="text-xs">Method</Label>
                <select
                  className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <option value="upi">UPI</option>
                  <option value="bank">Bank</option>
                  <option value="cash">Cash</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Button type="submit" size="sm" disabled={submitting}>
                {submitting ? "Saving…" : "Save"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPayment(false)}
              >
                Cancel
              </Button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
