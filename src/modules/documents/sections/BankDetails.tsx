import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { docStyles } from "../pdf/documentStyles";
import type { BankDetails as BankDetailsType } from "../types";

type BankDetailsProps = {
  bank: BankDetailsType;
};

export function BankDetails({ bank }: BankDetailsProps) {
  const hasBank = bank.accountName || bank.accountNumber || bank.ifsc || bank.bankName;
  return (
    <View style={docStyles.bankBlock}>
      <Text style={docStyles.sectionLabel}>Payment information</Text>
      {hasBank && (
        <>
          {bank.accountName && (
            <View style={docStyles.bankRow}>
              <Text style={docStyles.bankLabel}>Account Name</Text>
              <Text style={docStyles.bankValue}>{bank.accountName}</Text>
            </View>
          )}
          {bank.accountNumber && (
            <View style={docStyles.bankRow}>
              <Text style={docStyles.bankLabel}>Account Number</Text>
              <Text style={docStyles.bankValue}>{bank.accountNumber}</Text>
            </View>
          )}
          {bank.ifsc && (
            <View style={docStyles.bankRow}>
              <Text style={docStyles.bankLabel}>IFSC</Text>
              <Text style={docStyles.bankValue}>{bank.ifsc}</Text>
            </View>
          )}
          {bank.bankName && (
            <View style={docStyles.bankRow}>
              <Text style={docStyles.bankLabel}>Bank</Text>
              <Text style={docStyles.bankValue}>{bank.bankName}</Text>
            </View>
          )}
        </>
      )}
      {bank.upiId && (
        <View style={docStyles.bankRow}>
          <Text style={docStyles.bankLabel}>UPI ID</Text>
          <Text style={docStyles.bankValue}>{bank.upiId}</Text>
        </View>
      )}
    </View>
  );
}
