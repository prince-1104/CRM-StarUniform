import { StyleSheet } from "@react-pdf/renderer";

/** A4 layout: padding 32, base 10, lineHeight 1.5. Fixed content width, no full-stretch. */
const colors = {
  primary: "#6C3EF4",
  lightBox: "#F4F0FF",
  tableHeader: "#6C3EF4",
  tableHeaderText: "#FFFFFF",
  border: "#E5E7EB",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
};

export const docStyles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
    color: colors.textPrimary,
  },
  // Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  headerLeft: { flex: 1 },
  headerRight: { flex: 1, alignItems: "flex-end" },
  titleLarge: { fontSize: 20, fontWeight: "bold", color: colors.textPrimary, marginBottom: 4 },
  body: { fontSize: 10, color: colors.textPrimary, marginBottom: 2 },
  docTitle: { fontSize: 20, fontWeight: "bold", color: colors.primary, marginBottom: 4 },
  docMeta: { fontSize: 10, color: colors.textSecondary },
  // Party section
  partyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 20,
  },
  partyBlock: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.lightBox,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  // Table
  table: { marginBottom: 16 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.tableHeader,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tableHeaderText: { fontSize: 9, fontWeight: "bold", color: colors.tableHeaderText },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tableRowAlt: { backgroundColor: "#FAFAFA" },
  colIndex: { width: "5%", textAlign: "center" },
  colItem: { width: "30%" },
  colQty: { width: "8%", textAlign: "center" },
  colUnit: { width: "8%" },
  colRate: { width: "12%", textAlign: "right" },
  colGst: { width: "8%", textAlign: "right" },
  colAmount: { width: "12%", textAlign: "right" },
  right: { textAlign: "right" as const },
  center: { textAlign: "center" as const },
  // Totals
  totalsWrap: { marginLeft: "auto", width: "42%", marginBottom: 16 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, fontSize: 10 },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    fontWeight: "bold",
    fontSize: 12,
  },
  // Amount in words
  wordsBlock: {
    padding: 10,
    backgroundColor: "#F9FAFB",
    fontSize: 10,
    marginBottom: 16,
  },
  // Notes & Terms
  notesTerms: { marginBottom: 16, fontSize: 10, color: colors.textPrimary },
  notesTermsLabel: { fontWeight: "bold", marginBottom: 4 },
  // Bank
  bankBlock: {
    padding: 12,
    backgroundColor: colors.lightBox,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  bankRow: { flexDirection: "row", marginBottom: 4, fontSize: 10 },
  bankLabel: { width: "38%", color: colors.textSecondary },
  bankValue: { width: "62%", fontWeight: "bold" },
  // Quotation validity
  validity: { fontSize: 10, color: colors.textSecondary, marginBottom: 16 },
});
