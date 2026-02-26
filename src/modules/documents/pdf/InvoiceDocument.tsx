import React from "react";
import { BaseDocument } from "./BaseDocument";
import type { DocumentData } from "../types";

type InvoiceDocumentProps = {
  data: DocumentData;
};

export function InvoiceDocument({ data }: InvoiceDocumentProps) {
  return (
    <BaseDocument
      data={data}
      title="INVOICE"
      toLabel="Billed to"
    />
  );
}
