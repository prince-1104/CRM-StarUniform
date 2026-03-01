import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { BankDetails as BankDetailsType } from "../types";

// ─── Colour tokens (existing) ─────────────────────────────────────────────────
const DARK_BG = "#1a0933";
const ACCENT_LT = "#c4a0fb";
const WHITE_38 = "#8a7aaa";
const LABEL_COLOR = "#9b80d4";
const DIVIDER_COLOR = "rgba(196, 160, 251, 0.4)";

// ─── Styles (Payment Information only) ────────────────────────────────────────
const styles = StyleSheet.create({
  paymentSection: {
    marginHorizontal: 32,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: DARK_BG,
    borderRadius: 8,
  },

  paymentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  paymentIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4a2a7a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  paymentIconText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
  },

  paymentHeaderText: {
    flexDirection: "column",
  },
  paymentTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: ACCENT_LT,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  paymentSubtitle: {
    fontSize: 8,
    color: WHITE_38,
    marginTop: 2,
  },

  paymentDivider: {
    width: "100%",
    height: 1,
    backgroundColor: DIVIDER_COLOR,
    marginTop: 6,
    marginBottom: 8,
  },

  paymentGridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  paymentColumn: {
    width: "48%",
    flexDirection: "column",
  },
  paymentFieldBlock: {
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: LABEL_COLOR,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  paymentValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: ACCENT_LT,
  },
  paymentValueHighlight: {
    fontSize: 10,
    fontWeight: "bold",
    color: ACCENT_LT,
  },
});

type BankDetailsProps = {
  bank: BankDetailsType;
};

export function BankDetails({ bank }: BankDetailsProps) {
  return (
    <View style={styles.paymentSection}>
      <View style={styles.paymentHeader}>
        <View style={styles.paymentIcon}>
          <Text style={styles.paymentIconText}>₹</Text>
        </View>
        <View style={styles.paymentHeaderText}>
          <Text style={styles.paymentTitle}>PAYMENT INFORMATION</Text>
          <Text style={styles.paymentSubtitle}>Bank Transfer or UPI accepted</Text>
        </View>
      </View>

      <View style={styles.paymentDivider} />

      <View style={styles.paymentGridRow}>
        <View style={styles.paymentColumn}>
          <View style={styles.paymentFieldBlock}>
            <Text style={styles.paymentLabel}>ACCOUNT NAME</Text>
            <Text style={styles.paymentValue}>{bank.accountName || "—"}</Text>
          </View>
          <View style={styles.paymentFieldBlock}>
            <Text style={styles.paymentLabel}>ACCOUNT NUMBER</Text>
            <Text style={styles.paymentValueHighlight}>{bank.accountNumber || "—"}</Text>
          </View>
          <View style={styles.paymentFieldBlock}>
            <Text style={styles.paymentLabel}>ACCOUNT TYPE</Text>
            <Text style={styles.paymentValue}>{bank.accountType || "—"}</Text>
          </View>
        </View>

        <View style={styles.paymentColumn}>
          <View style={styles.paymentFieldBlock}>
            <Text style={styles.paymentLabel}>BANK</Text>
            <Text style={styles.paymentValue}>{bank.bankName || "—"}</Text>
          </View>
          <View style={styles.paymentFieldBlock}>
            <Text style={styles.paymentLabel}>IFSC CODE</Text>
            <Text style={styles.paymentValueHighlight}>{bank.ifsc || "—"}</Text>
          </View>
          <View style={styles.paymentFieldBlock}>
            <Text style={styles.paymentLabel}>UPI ID</Text>
            <Text style={styles.paymentValueHighlight}>{bank.upiId || "—"}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
