import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { docStyles } from "../pdf/documentStyles";
import { formatDateLong } from "../utils/formatDate";

type DocumentHeaderProps = {
  /** Document title (e.g. "Invoice", "Quotation"). */
  title: string;
  documentNumber: string;
  date: string;
  companyName: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
  /** e.g. "Uniform Suppliers · Kolkata" */
  companyTagline?: string;
  /** Badge text: Paid, Draft, Unpaid. Omit to hide badge (e.g. for quotations). */
  status?: string;
};

export function DocumentHeader({
  title,
  documentNumber,
  date,
  companyName,
  companyAddress,
  companyEmail,
  companyPhone,
  companyTagline,
  status,
}: DocumentHeaderProps) {
  const contactParts: string[] = [];
  if (companyAddress) contactParts.push(companyAddress);
  if (companyPhone) contactParts.push(companyPhone);
  if (companyEmail) contactParts.push(companyEmail);
  const contactLine = contactParts.join(" · ");

  return (
    <View style={docStyles.header}>
      <View style={docStyles.headerLeft}>
        <Text style={docStyles.brandName}>{companyName}</Text>
        {companyTagline && (
          <Text style={docStyles.brandTagline}>{companyTagline}</Text>
        )}
        {contactLine ? (
          <Text style={docStyles.brandContact}>{contactLine}</Text>
        ) : null}
      </View>
      <View style={docStyles.headerRight}>
        <Text style={docStyles.docTitle}>{title}</Text>
        <Text style={docStyles.docNumber}>{documentNumber}</Text>
        <Text style={docStyles.docDate}>Issued: {formatDateLong(date)}</Text>
        {status != null && status !== "" && (
          <View style={docStyles.statusBadge}>
            <Text style={docStyles.statusBadgeText}>{status}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
