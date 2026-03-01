import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { documentStyles } from "../styles";
import { BaseDocumentLayout } from "./BaseDocumentLayout";
import { DocumentHeader } from "./DocumentHeader";
import { BillingSection } from "./BillingSection";
import { ItemsTable } from "./ItemsTable";
import { TotalsSection } from "./TotalsSection";
import { BankSection } from "./BankSection";
import { SignatureSection } from "./SignatureSection";
import { calculateTotals } from "../utils/calculateTotals";
import { validateDocumentData } from "../validateDocumentData";
import type { DocumentData } from "../types";

type QuotationPdfProps = {
  data: DocumentData;
  /** Number of days this quotation is valid (e.g. 7, 15, 30). */
  validForDays?: number;
};

export function QuotationPdf({ data, validForDays = 15 }: QuotationPdfProps) {
  validateDocumentData(data);

  const totals = calculateTotals(data.items);
  const currency = data.currency ?? "INR";

  return (
    <BaseDocumentLayout watermark={data.watermark}>
      <DocumentHeader
        title="QUOTATION"
        docNumber={data.documentNumber}
        date={data.date}
        companyName={data.company.name}
        logoUrl={data.logoUrl}
      />
      <BillingSection
        billedBy={data.company}
        billedTo={data.client}
        toLabel="Quotation to"
      />
      <ItemsTable items={data.items} totals={totals} currency={currency} />
      <TotalsSection totals={totals} currency={currency} />
      {validForDays > 0 && (
        <View style={[documentStyles.footer, { marginTop: 12 }]}>
          <Text>This quotation is valid for {validForDays} days.</Text>
        </View>
      )}
      {data.bankDetails && <BankSection bank={data.bankDetails} />}
      {(data.notes || data.terms) && (
        <View style={documentStyles.footer}>
          {data.notes && <View style={{ marginBottom: 8 }}><Text style={{ fontWeight: "bold" }}>Notes</Text><Text>{data.notes}</Text></View>}
          {data.terms && <View><Text style={{ fontWeight: "bold" }}>Terms & conditions</Text><Text>{data.terms}</Text></View>}
        </View>
      )}
      <SignatureSection />
    </BaseDocumentLayout>
  );
}
