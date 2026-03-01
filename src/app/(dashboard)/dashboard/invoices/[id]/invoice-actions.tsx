"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PdfPreviewDrawer } from "@/components/invoice/pdf-preview-drawer";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FileDown, Eye, Share2, Pencil, Trash2 } from "lucide-react";

export default function InvoiceActions({
  invoiceId,
  status,
  grandTotal,
  totalPaid,
  docNumber,
}: {
  invoiceId: string;
  status: string;
  grandTotal: number;
  totalPaid: number;
  docNumber: string;
}) {
  const router = useRouter();
  const [showPayment, setShowPayment] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("upi");
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const pending = grandTotal - totalPaid;
  const pdfUrl = `/api/invoices/${invoiceId}/pdf`;

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

  function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `Invoice ${docNumber}`,
        url,
        text: `Invoice ${docNumber}`,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard");
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json();
        alert(j.error ?? "Failed to delete invoice");
        return;
      }
      setDeleteConfirmOpen(false);
      router.push("/dashboard/invoices");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/dashboard/invoices/${invoiceId}/edit`}>
          <Pencil className="h-4 w-4 mr-1.5" />
          Edit
        </Link>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={pdfUrl} download={`Invoice-${docNumber}.pdf`}>
          <FileDown className="h-4 w-4 mr-1.5" />
          Download PDF
        </a>
      </Button>
      <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
        <Eye className="h-4 w-4 mr-1.5" />
        Preview
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="h-4 w-4 mr-1.5" />
        Share
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={() => setDeleteConfirmOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-1.5" />
        Delete
      </Button>
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete this invoice?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
      />
      <PdfPreviewDrawer
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        pdfUrl={pdfUrl}
        title={`Invoice ${docNumber}`}
      />
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
