import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { docStyles } from "./documentStyles";
import { DocumentHeader } from "../sections/DocumentHeader";
import { PartyDetails } from "../sections/PartyDetails";
import { ItemsTable } from "../sections/ItemsTable";
import { TotalsBlock } from "../sections/TotalsBlock";
import { AmountInWords } from "../sections/AmountInWords";
import { NotesTerms } from "../sections/NotesTerms";
import { BankDetails } from "../sections/BankDetails";
import { calculateTotals } from "../utils/calculateTotals";
import type { DocumentData } from "../types";

type BaseDocumentProps = {
  data: DocumentData;
  title: "INVOICE" | "QUOTATION";
  toLabel: string;
  /** Quotation only: validity text (e.g. "This quotation is valid for 15 days."). */
  validityText?: string;
};

export function BaseDocument({
  data,
  title,
  toLabel,
  validityText,
}: BaseDocumentProps) {
  const totals = calculateTotals(data.items);
  const currency = data.currency ?? "INR";

  return (
    <Document>
      <Page size="A4" style={docStyles.page}>
        <DocumentHeader
          title={title}
          documentNumber={data.documentNumber}
          date={data.date}
          companyName={data.company.name}
          companyAddress={data.company.address || undefined}
          companyEmail={data.company.email}
          companyPhone={data.company.phone}
        />
        <PartyDetails billedBy={data.company} billedTo={data.client} toLabel={toLabel} />
        <ItemsTable items={data.items} totals={totals} currency={currency} />
        <TotalsBlock
          totals={totals}
          deliveryCharges={data.deliveryCharges}
          advancePayment={data.advancePayment}
          currency={currency}
        />
        <AmountInWords
          totals={totals}
          deliveryCharges={data.deliveryCharges}
          advancePayment={data.advancePayment}
        />
        {validityText && (
          <View style={docStyles.validity}>
            <Text>{validityText}</Text>
          </View>
        )}
        <NotesTerms notes={data.notes} terms={data.terms} />
        {data.bankDetails && <BankDetails bank={data.bankDetails} />}
      </Page>
    </Document>
  );
}
