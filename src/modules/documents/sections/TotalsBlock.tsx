import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { docStyles } from "../pdf/documentStyles";
import { formatCurrency } from "../utils/formatCurrency";
import type { TotalsResult } from "../types";

type TotalsBlockProps = {
  totals: TotalsResult;
  deliveryCharges?: number;
  advancePayment?: number;
  currency?: string;
};

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function TotalsBlock({
  totals,
  deliveryCharges,
  advancePayment,
  currency = "INR",
}: TotalsBlockProps) {
  let grandTotal = totals.grandTotal;
  if (deliveryCharges != null && deliveryCharges > 0) grandTotal = round2(grandTotal + deliveryCharges);
  if (advancePayment != null && advancePayment > 0) grandTotal = round2(grandTotal - advancePayment);
  grandTotal = Math.max(0, grandTotal);

  return (
    <View style={docStyles.totalsWrap}>
      <View style={docStyles.totalRow}>
        <Text>Subtotal</Text>
        <Text>{formatCurrency(totals.subtotal, currency)}</Text>
      </View>
      {totals.totalGst > 0 && (
        <View style={docStyles.totalRow}>
          <Text>Total GST</Text>
          <Text>{formatCurrency(totals.totalGst, currency)}</Text>
        </View>
      )}
      {deliveryCharges != null && deliveryCharges > 0 && (
        <View style={docStyles.totalRow}>
          <Text>Delivery charges</Text>
          <Text>{formatCurrency(deliveryCharges, currency)}</Text>
        </View>
      )}
      {advancePayment != null && advancePayment > 0 && (
        <View style={docStyles.totalRow}>
          <Text>Advance paid</Text>
          <Text>({formatCurrency(advancePayment, currency)})</Text>
        </View>
      )}
      <View style={docStyles.grandTotalRow}>
        <Text>Grand total</Text>
        <Text>{formatCurrency(grandTotal, currency)}</Text>
      </View>
    </View>
  );
}
