import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { documentStyles } from "../styles";
import { formatCurrency } from "../utils/formatCurrency";
import { amountInWords } from "../utils/amountInWords";
import type { TotalsResult } from "../types";

type TotalsSectionProps = {
  totals: TotalsResult;
  deliveryCharges?: number;
  advancePayment?: number;
  currency?: string;
};

export function TotalsSection({
  totals,
  deliveryCharges,
  advancePayment,
  currency = "INR",
}: TotalsSectionProps) {
  let grandTotal = totals.grandTotal;
  if (deliveryCharges != null && deliveryCharges > 0) grandTotal += deliveryCharges;
  if (advancePayment != null && advancePayment > 0) grandTotal -= advancePayment;
  grandTotal = Math.max(0, Math.round(grandTotal * 100) / 100);

  return (
    <>
      <View style={documentStyles.totals}>
        <View style={documentStyles.totalRow}>
          <Text>Subtotal</Text>
          <Text>{formatCurrency(totals.subtotal, currency)}</Text>
        </View>
        {totals.totalGst > 0 && (
          <View style={documentStyles.totalRow}>
            <Text>Total GST</Text>
            <Text>{formatCurrency(totals.totalGst, currency)}</Text>
          </View>
        )}
        {deliveryCharges != null && deliveryCharges > 0 && (
          <View style={documentStyles.totalRow}>
            <Text>Delivery charges</Text>
            <Text>{formatCurrency(deliveryCharges, currency)}</Text>
          </View>
        )}
        {advancePayment != null && advancePayment > 0 && (
          <View style={documentStyles.totalRow}>
            <Text>Advance paid</Text>
            <Text>({formatCurrency(advancePayment, currency)})</Text>
          </View>
        )}
        <View style={[documentStyles.totalRow, documentStyles.grandTotal]}>
          <Text>Grand total</Text>
          <Text>{formatCurrency(grandTotal, currency)}</Text>
        </View>
      </View>
      <View style={documentStyles.words}>
        <Text>Amount in words: {amountInWords(grandTotal)}</Text>
      </View>
    </>
  );
}
