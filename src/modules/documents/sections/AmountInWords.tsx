import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { docStyles } from "../pdf/documentStyles";
import { amountInWords } from "../utils/amountInWords";
import type { TotalsResult } from "../types";

type AmountInWordsProps = {
  totals: TotalsResult;
  deliveryCharges?: number;
  advancePayment?: number;
};

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function AmountInWords({
  totals,
  deliveryCharges,
  advancePayment,
}: AmountInWordsProps) {
  let grandTotal = totals.grandTotal;
  if (deliveryCharges != null && deliveryCharges > 0) grandTotal = round2(grandTotal + deliveryCharges);
  if (advancePayment != null && advancePayment > 0) grandTotal = round2(grandTotal - advancePayment);
  grandTotal = Math.max(0, grandTotal);

  return (
    <View style={docStyles.wordsBlock}>
      <Text>
        Amount in words: <Text style={docStyles.wordsBlockStrong}>{amountInWords(grandTotal)}</Text>
      </Text>
    </View>
  );
}
