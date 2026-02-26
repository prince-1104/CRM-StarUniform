import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { documentStyles } from "../styles";
import type { Party } from "../types";

type BillingSectionProps = {
  billedBy: Party;
  billedTo: Party;
  toLabel: string;
};

export function BillingSection({ billedBy, billedTo, toLabel }: BillingSectionProps) {
  return (
    <View style={documentStyles.billingRow}>
      <View style={documentStyles.billingBlock}>
        <Text style={documentStyles.billingLabel}>Billed by</Text>
        <Text style={documentStyles.billingText}>{billedBy.name}</Text>
        {billedBy.address && <Text style={documentStyles.billingText}>{billedBy.address}</Text>}
        {billedBy.gstin && <Text style={documentStyles.billingText}>GSTIN: {billedBy.gstin}</Text>}
        {billedBy.email && <Text style={documentStyles.billingText}>{billedBy.email}</Text>}
        {billedBy.phone && <Text style={documentStyles.billingText}>{billedBy.phone}</Text>}
      </View>
      <View style={documentStyles.billingBlock}>
        <Text style={documentStyles.billingLabel}>{toLabel}</Text>
        <Text style={documentStyles.billingText}>{billedTo.name}</Text>
        {billedTo.address && <Text style={documentStyles.billingText}>{billedTo.address}</Text>}
        {billedTo.gstin && <Text style={documentStyles.billingText}>GSTIN: {billedTo.gstin}</Text>}
        {billedTo.email && <Text style={documentStyles.billingText}>{billedTo.email}</Text>}
        {billedTo.phone && <Text style={documentStyles.billingText}>{billedTo.phone}</Text>}
      </View>
    </View>
  );
}
