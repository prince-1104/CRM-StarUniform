import React from "react";
import type { DocumentData, LegacyDocumentData } from "./types";
import { InvoiceDocument } from "./pdf/InvoiceDocument";
import { QuotationDocument } from "./pdf/QuotationDocument";
import { validateDocumentData, DocumentValidationError, normalizeDocumentData } from "./validateDocumentData";

/**
 * Generate invoice PDF as Blob.
 * Filename: Invoice-<number>.pdf
 */
export async function generateInvoicePdf(
  data: DocumentData | LegacyDocumentData
): Promise<Blob> {
  const normalized = normalizeDocumentData(data);
  validateDocumentData(normalized);

  const { renderToBuffer } = await import("@react-pdf/renderer");
  try {
    const buffer = await renderToBuffer(
      React.createElement(InvoiceDocument, { data: normalized }) as React.ReactElement
    );
    const arr =
      buffer instanceof ArrayBuffer
        ? new Uint8Array(buffer)
        : new Uint8Array(buffer as ArrayLike<number>);
    return new Blob([arr], { type: "application/pdf" });
  } catch (e) {
    if (e instanceof DocumentValidationError) throw e;
    throw new Error(
      e instanceof Error ? e.message : "Failed to generate invoice PDF"
    );
  }
}

/**
 * Generate quotation PDF as Blob.
 * Filename: Quotation-<number>.pdf
 */
export async function generateQuotationPdf(
  data: DocumentData | LegacyDocumentData,
  validForDays: number = 15
): Promise<Blob> {
  const normalized = normalizeDocumentData(data);
  validateDocumentData(normalized);

  const { renderToBuffer } = await import("@react-pdf/renderer");
  try {
    const buffer = await renderToBuffer(
      React.createElement(QuotationDocument, {
        data: normalized,
        validForDays,
      }) as React.ReactElement
    );
    const arr =
      buffer instanceof ArrayBuffer
        ? new Uint8Array(buffer)
        : new Uint8Array(buffer as ArrayLike<number>);
    return new Blob([arr], { type: "application/pdf" });
  } catch (e) {
    if (e instanceof DocumentValidationError) throw e;
    throw new Error(
      e instanceof Error ? e.message : "Failed to generate quotation PDF"
    );
  }
}

export function getInvoicePdfFilename(docNumber: string): string {
  return `Invoice-${docNumber}.pdf`;
}

export function getQuotationPdfFilename(docNumber: string): string {
  return `Quotation-${docNumber}.pdf`;
}
