import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Invoice, Client, Organization, InvoiceItem } from "@prisma/client";
import { amountInWords } from "./utils";

type InvoiceWithRelations = Invoice & {
  items: InvoiceItem[];
  client: Client;
  organization: Organization;
};

// Reference-style: purple theme, clean table, two-column billed by/to
const purple = {
  dark: "#5b21b6",
  light: "#ede9fe",
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  logo: { fontSize: 18, fontWeight: "bold", color: "#1f2937" },
  invoiceTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4, color: "#1f2937" },
  invoiceMeta: { fontSize: 9, color: "#6b7280" },
  fromTo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 16,
  },
  block: {
    width: "48%",
    padding: 12,
    backgroundColor: purple.light,
  },
  label: { fontSize: 8, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  table: {
    marginTop: 12,
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: purple.dark,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  col1: { width: "6%" },
  col2: { width: "32%" },
  col3: { width: "12%" },
  col4: { width: "12%" },
  col5: { width: "14%" },
  col6: { width: "12%" },
  col7: { width: "12%" },
  right: { textAlign: "right" },
  headerText: { color: "#ffffff", fontWeight: "bold", fontSize: 9 },
  totals: { marginTop: 12, marginLeft: "auto", width: "42%" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, fontSize: 10 },
  grandTotal: { fontWeight: "bold", fontSize: 12, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#d1d5db" },
  words: { marginTop: 14, padding: 10, backgroundColor: "#f9fafb", fontSize: 9 },
  footer: { marginTop: 20, fontSize: 9, color: "#6b7280" },
});

function PdfInvoiceDoc({ invoice }: { invoice: InvoiceWithRelations }) {
  const org = invoice.organization;
  const client = invoice.client;
  const subtotal = Number(invoice.subtotal);
  const totalGst = Number(invoice.totalGst);
  const deliveryCharges = invoice.deliveryCharges != null ? Number(invoice.deliveryCharges) : 0;
  const advancePayment = invoice.advancePayment != null ? Number(invoice.advancePayment) : 0;
  const grandTotal = Number(invoice.grandTotal);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text>{org.logo ? "Logo" : org.name}</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>
              {(invoice as InvoiceWithRelations & { documentType?: string }).documentType === "quotation"
                ? "QUOTATION"
                : "INVOICE"}
            </Text>
            <Text style={styles.invoiceMeta}>Invoice No # {invoice.invoiceNumber}</Text>
            <Text style={styles.invoiceMeta}>{new Date(invoice.invoiceDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</Text>
          </View>
        </View>

        <View style={styles.fromTo}>
          <View style={styles.block}>
            <Text style={styles.label}>Billed by</Text>
            <Text>{org.name}</Text>
            {org.address && <Text>{org.address}</Text>}
            {org.gstNumber && <Text>GSTIN: {org.gstNumber}</Text>}
            {org.phone && <Text>{org.phone}</Text>}
            {org.email && <Text>{org.email}</Text>}
          </View>
          <View style={styles.block}>
            <Text style={styles.label}>
              {(invoice as InvoiceWithRelations & { documentType?: string }).documentType === "quotation" ? "Quotation to" : "Billed to"}
            </Text>
            <Text>{client.name}</Text>
            {client.billingAddress && <Text>{client.billingAddress}</Text>}
            {client.gstin && <Text>GSTIN: {client.gstin}</Text>}
            {client.phone && <Text>{client.phone}</Text>}
            {client.email && <Text>{client.email}</Text>}
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.col1, styles.right, styles.headerText]}>#</Text>
            <Text style={[styles.col2, styles.headerText]}>Item</Text>
            <Text style={[styles.col3, styles.right, styles.headerText]}>Quantity</Text>
            <Text style={[styles.col4, styles.right, styles.headerText]}>Rate</Text>
            <Text style={[styles.col5, styles.right, styles.headerText]}>Amount</Text>
            <Text style={[styles.col6, styles.right, styles.headerText]}>GST %</Text>
            <Text style={[styles.col7, styles.right, styles.headerText]}>GST Amt</Text>
          </View>
          {invoice.items
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((item, i) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={[styles.col1, styles.right]}>{i + 1}</Text>
                <Text style={styles.col2}>{item.name}</Text>
                <Text style={[styles.col3, styles.right]}>{Number(item.quantity)}</Text>
                <Text style={[styles.col4, styles.right]}>₹{Number(item.rate).toFixed(2)}</Text>
                <Text style={[styles.col5, styles.right]}>₹{Number(item.amount).toFixed(2)}</Text>
                <Text style={[styles.col6, styles.right]}>{Number(item.gstPercent)}%</Text>
                <Text style={[styles.col7, styles.right]}>₹{Number(item.gstAmount).toFixed(2)}</Text>
              </View>
            ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Total</Text>
            <Text>₹{subtotal.toFixed(2)}</Text>
          </View>
          {totalGst > 0 && (
            <View style={styles.totalRow}>
              <Text>Total GST</Text>
              <Text>₹{totalGst.toFixed(2)}</Text>
            </View>
          )}
          {deliveryCharges > 0 && (
            <View style={styles.totalRow}>
              <Text>Delivery charges</Text>
              <Text>₹{deliveryCharges.toFixed(2)}</Text>
            </View>
          )}
          {advancePayment > 0 && (
            <View style={styles.totalRow}>
              <Text>Advance</Text>
              <Text>(₹{advancePayment.toFixed(2)})</Text>
            </View>
          )}
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text>Total (INR)</Text>
            <Text>₹{grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.words}>
          <Text>Total (in words): {amountInWords(grandTotal)}</Text>
        </View>

        {(org.bankDetails || org.upiId) && (
          <View style={styles.footer}>
            {org.bankDetails && <Text>Bank details: {org.bankDetails}</Text>}
            {org.upiId && <Text>UPI: {org.upiId}</Text>}
          </View>
        )}
        {invoice.terms && (
          <View style={[styles.footer, { marginTop: 8 }]}>
            <Text>Terms: {invoice.terms}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}

export async function generateInvoicePdfBuffer(
  invoice: InvoiceWithRelations
): Promise<Buffer> {
  const { renderToBuffer } = await import("@react-pdf/renderer");
  const buf = await renderToBuffer(<PdfInvoiceDoc invoice={invoice} />);
  return Buffer.from(buf);
}
