import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { docStyles } from "../pdf/documentStyles";
import { formatCurrency } from "../utils/formatCurrency";
import type { DocumentItem } from "../types";
import type { TotalsResult } from "../types";

type ItemsTableProps = {
  items: DocumentItem[];
  totals: TotalsResult;
  currency?: string;
};

export function ItemsTable({ items, totals, currency = "INR" }: ItemsTableProps) {
  const { lineItems } = totals;
  return (
    <View style={docStyles.table}>
      <View style={docStyles.tableHeader}>
        <Text style={[docStyles.colIndex, docStyles.tableHeaderText]}>#</Text>
        <Text style={[docStyles.colItem, docStyles.tableHeaderText]}>Item</Text>
        <Text style={[docStyles.colQty, docStyles.tableHeaderText]}>Qty</Text>
        <Text style={[docStyles.colUnit, docStyles.tableHeaderText]}>Unit</Text>
        <Text style={[docStyles.colRate, docStyles.tableHeaderText]}>Rate</Text>
        <Text style={[docStyles.colGst, docStyles.tableHeaderText]}>GST %</Text>
        <Text style={[docStyles.colAmount, docStyles.tableHeaderText]}>Amount</Text>
      </View>
      {items.map((item, i) => {
        const line = lineItems[i];
        const amount = line?.amount ?? 0;
        const lineTotal = line?.lineTotal ?? 0;
        return (
          <View
            key={i}
            style={i % 2 === 1 ? [docStyles.tableRow, docStyles.tableRowAlt] : docStyles.tableRow}
          >
            <Text style={docStyles.colIndex}>{i + 1}</Text>
            <Text style={docStyles.colItem}>{item.name}</Text>
            <Text style={docStyles.colQty}>{item.quantity}</Text>
            <Text style={docStyles.colUnit}>{item.unit}</Text>
            <Text style={[docStyles.colRate, docStyles.right]}>{formatCurrency(item.rate, currency)}</Text>
            <Text style={[docStyles.colGst, docStyles.right]}>{item.gstPercent}%</Text>
            <Text style={[docStyles.colAmount, docStyles.right]}>{formatCurrency(lineTotal, currency)}</Text>
          </View>
        );
      })}
    </View>
  );
}
