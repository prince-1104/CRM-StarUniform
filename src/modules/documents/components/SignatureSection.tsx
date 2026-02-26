import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { documentStyles } from "../styles";

export function SignatureSection() {
  return (
    <View style={[documentStyles.footer, { marginTop: 24 }]}>
      <View style={{ marginTop: 20, alignItems: "flex-end" }}>
        <Text style={{ fontSize: 9, color: "#6b7280", marginBottom: 24 }}>
          Authorized signature
        </Text>
        <View style={{ width: 120, borderTopWidth: 1, borderTopColor: "#9ca3af" }} />
      </View>
    </View>
  );
}
