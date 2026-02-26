import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { docStyles } from "../pdf/documentStyles";
import type { Party } from "../types";

type PartyDetailsProps = {
  billedBy: Party;
  billedTo: Party;
  toLabel: string;
};

export function PartyDetails({ billedBy, billedTo, toLabel }: PartyDetailsProps) {
  return (
    <View style={docStyles.partyRow}>
      <View style={docStyles.partyBlock}>
        <Text style={docStyles.sectionLabel}>Billed by</Text>
        <Text style={docStyles.body}>{billedBy.name}</Text>
        {billedBy.address ? <Text style={docStyles.body}>{billedBy.address}</Text> : null}
        {billedBy.gstin ? <Text style={docStyles.body}>GSTIN: {billedBy.gstin}</Text> : null}
        {billedBy.email ? <Text style={docStyles.body}>{billedBy.email}</Text> : null}
        {billedBy.phone ? <Text style={docStyles.body}>{billedBy.phone}</Text> : null}
      </View>
      <View style={docStyles.partyBlock}>
        <Text style={docStyles.sectionLabel}>{toLabel}</Text>
        <Text style={docStyles.body}>{billedTo.name}</Text>
        {billedTo.address ? <Text style={docStyles.body}>{billedTo.address}</Text> : null}
        {billedTo.gstin ? <Text style={docStyles.body}>GSTIN: {billedTo.gstin}</Text> : null}
        {billedTo.email ? <Text style={docStyles.body}>{billedTo.email}</Text> : null}
        {billedTo.phone ? <Text style={docStyles.body}>{billedTo.phone}</Text> : null}
      </View>
    </View>
  );
}
