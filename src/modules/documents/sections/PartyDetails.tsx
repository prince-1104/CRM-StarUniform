import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { docStyles } from "../pdf/documentStyles";
import type { Party } from "../types";

type PartyDetailsProps = {
  billedBy: Party;
  billedTo: Party;
  toLabel: string;
};

export function PartyDetails({ billedTo, toLabel }: PartyDetailsProps) {
  const parts: string[] = [];
  if (billedTo.address) parts.push(billedTo.address);
  if (billedTo.email) parts.push(billedTo.email);
  if (billedTo.phone) parts.push(billedTo.phone);
  const detailLine = parts.join(" · ");

  return (
    <View style={docStyles.billedToSection}>
      <Text style={docStyles.partyLabel}>{toLabel}</Text>
      <Text style={docStyles.partyName}>{billedTo.name}</Text>
      {detailLine ? (
        <Text style={docStyles.partyDetail}>{detailLine}</Text>
      ) : null}
    </View>
  );
}
