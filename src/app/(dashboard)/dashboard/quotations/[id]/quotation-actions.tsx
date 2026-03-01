"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PdfPreviewDrawer } from "@/components/invoice/pdf-preview-drawer";
import { FileDown, Eye } from "lucide-react";

export default function QuotationActions({
  quotationId,
  docNumber,
}: {
  quotationId: string;
  docNumber: string;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const pdfUrl = `/api/invoices/${quotationId}/pdf`;

  return (
    <>
      <Button variant="outline" size="sm" asChild>
        <a href={pdfUrl} download={`Quotation-${docNumber}.pdf`}>
          <FileDown className="h-4 w-4 mr-1.5" />
          Download PDF
        </a>
      </Button>
      <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
        <Eye className="h-4 w-4 mr-1.5" />
        Preview
      </Button>
      <PdfPreviewDrawer
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        pdfUrl={pdfUrl}
        title={`Quotation ${docNumber}`}
      />
    </>
  );
}
