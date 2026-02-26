import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { documentStyles } from "../styles";

type BaseDocumentLayoutProps = {
  children: React.ReactNode;
  watermark?: string;
};

export function BaseDocumentLayout({ children, watermark }: BaseDocumentLayoutProps) {
  return (
    <Document>
      <Page size="A4" style={documentStyles.page}>
        {watermark && (
          <View style={documentStyles.watermark}>
            <Text>{watermark}</Text>
          </View>
        )}
        {children}
      </Page>
    </Document>
  );
}
