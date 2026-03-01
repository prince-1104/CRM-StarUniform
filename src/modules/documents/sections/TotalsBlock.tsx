import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { docStyles } from "../pdf/documentStyles";
import { formatCurrencyForPdf } from "../utils/formatCurrency";
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
    <View style={docStyles.totalsSection}>
      <View style={docStyles.totalsBox}>
        <View style={docStyles.totalRow}>
          <Text>Subtotal</Text>
          <Text>{formatCurrencyForPdf(totals.subtotal, currency)}</Text>
        </View>
        <View style={docStyles.totalRow}>
          <Text>GST (0%)</Text>
          <Text>{formatCurrencyForPdf(totals.totalGst, currency)}</Text>
        </View>
        <View style={docStyles.totalRow}>
          <Text>Discount</Text>
          <Text>—</Text>
        </View>
        {deliveryCharges != null && deliveryCharges > 0 && (
          <View style={docStyles.totalRow}>
            <Text>Delivery charges</Text>
            <Text>{formatCurrencyForPdf(deliveryCharges, currency)}</Text>
          </View>
        )}
        {advancePayment != null && advancePayment > 0 && (
          <View style={docStyles.totalRow}>
            <Text>Advance paid</Text>
            <Text>({formatCurrencyForPdf(advancePayment, currency)})</Text>
          </View>
        )}
        <View style={docStyles.grandTotalRow}>
          <Text>Grand Total</Text>
          <Text style={docStyles.grandTotalValue}>{formatCurrencyForPdf(grandTotal, currency)}</Text>
        </View>
      </View>
    </View>
  );
}
