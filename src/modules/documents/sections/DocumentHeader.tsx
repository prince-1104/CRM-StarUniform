import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { docStyles } from "../pdf/documentStyles";
import { formatDate } from "../utils/formatDate";

type DocumentHeaderProps = {
  title: "INVOICE" | "QUOTATION";
  documentNumber: string;
  date: string;
  companyName: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
};

export function DocumentHeader({
  title,
  documentNumber,
  date,
  companyName,
  companyAddress,
  companyEmail,
  companyPhone,
}: DocumentHeaderProps) {
  return (
    <View style={docStyles.headerRow}>
      <View style={docStyles.headerLeft}>
        <Text style={docStyles.titleLarge}>{companyName}</Text>
        {companyAddress && <Text style={docStyles.body}>{companyAddress}</Text>}
        {companyEmail && <Text style={docStyles.body}>{companyEmail}</Text>}
        {companyPhone && <Text style={docStyles.body}>{companyPhone}</Text>}
      </View>
      <View style={docStyles.headerRight}>
        <Text style={docStyles.docTitle}>{title}</Text>
        <Text style={docStyles.docMeta}>Document No. {documentNumber}</Text>
        <Text style={docStyles.docMeta}>{formatDate(date)}</Text>
      </View>
    </View>
  );
}
