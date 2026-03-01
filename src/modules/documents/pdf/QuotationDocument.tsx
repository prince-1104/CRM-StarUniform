import React from "react";
import { BaseDocument } from "./BaseDocument";
import type { DocumentData } from "../types";

type QuotationDocumentProps = {
  data: DocumentData;
  /** Number of days this quotation is valid (e.g. 7, 15, 30). */
  validForDays?: number;
};

export function QuotationDocument({ data, validForDays = 15 }: QuotationDocumentProps) {
  const validityText =
    validForDays > 0
      ? `This quotation is valid for ${validForDays} days.`
      : undefined;

  return (
    <BaseDocument
      data={data}
      title="Quotation"
      toLabel="Quotation to"
      validityText={validityText}
      showTotals={false}
      itemsTableVariant="quotation"
      showStatus={false}
      showPaymentInfo={false}
    />
  );
}
