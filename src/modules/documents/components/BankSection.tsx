import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { documentStyles } from "../styles";
import type { BankDetails } from "../types";

type BankSectionProps = {
  bank: BankDetails;
};

export function BankSection({ bank }: BankSectionProps) {
  const hasBank =
    bank.accountName || bank.accountNumber || bank.ifsc || bank.bankName;
  return (
    <View style={documentStyles.bankSection}>
      <Text style={documentStyles.bankTitle}>Payment information</Text>
      {hasBank && (
        <>
          {bank.accountName && (
            <View style={documentStyles.bankRow}>
              <Text style={documentStyles.bankLabel}>Account Name</Text>
              <Text style={documentStyles.bankValue}>{bank.accountName}</Text>
            </View>
          )}
          {bank.accountNumber && (
            <View style={documentStyles.bankRow}>
              <Text style={documentStyles.bankLabel}>Account Number</Text>
              <Text style={documentStyles.bankValue}>{bank.accountNumber}</Text>
            </View>
          )}
          {bank.ifsc && (
            <View style={documentStyles.bankRow}>
              <Text style={documentStyles.bankLabel}>IFSC</Text>
              <Text style={documentStyles.bankValue}>{bank.ifsc}</Text>
            </View>
          )}
          {bank.bankName && (
            <View style={documentStyles.bankRow}>
              <Text style={documentStyles.bankLabel}>Bank</Text>
              <Text style={documentStyles.bankValue}>{bank.bankName}</Text>
            </View>
          )}
        </>
      )}
      {bank.upiId && (
        <View style={documentStyles.bankRow}>
          <Text style={documentStyles.bankLabel}>UPI ID</Text>
          <Text style={documentStyles.bankValue}>{bank.upiId}</Text>
        </View>
      )}
    </View>
  );
}
