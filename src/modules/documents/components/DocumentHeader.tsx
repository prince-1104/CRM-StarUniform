import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { documentStyles } from "../styles";
import { formatDate } from "../utils/formatDate";

type DocumentHeaderProps = {
  title: "INVOICE" | "QUOTATION";
  docNumber: string;
  date: string;
  companyName: string;
  logoUrl?: string;
};

export function DocumentHeader({
  title,
  docNumber,
  date,
  companyName,
  logoUrl,
}: DocumentHeaderProps) {
  return (
    <View style={documentStyles.header}>
      <View style={documentStyles.logo}>
        {logoUrl ? (
          <Text>{companyName}</Text>
        ) : (
          <Text>{companyName}</Text>
        )}
      </View>
      <View>
        <Text style={documentStyles.docTitle}>{title}</Text>
        <Text style={documentStyles.docMeta}>Document No. {docNumber}</Text>
        <Text style={documentStyles.docMeta}>{formatDate(date)}</Text>
      </View>
    </View>
  );
}
