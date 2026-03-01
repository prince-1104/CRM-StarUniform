import { StyleSheet } from "@react-pdf/renderer";

/**
 * Design tokens matching the professional invoice HTML:
 * --ink #1a0933, --paper #fdfbff, --cream #f0ebfa, --accent #9b59f5,
 * --accent-lt #c4a0fb, --muted #7a6a95, --border #d8ccf0, --row-even #f5f1fd
 */
const colors = {
  ink: "#1a0933",
  paper: "#fdfbff",
  cream: "#f0ebfa",
  accent: "#9b59f5",
  accentLt: "#c4a0fb",
  muted: "#7a6a95",
  border: "#d8ccf0",
  rowEven: "#f5f1fd",
  white: "#ffffff",
  whiteOpacity50: "rgba(255,255,255,0.5)",
  whiteOpacity38: "rgba(255,255,255,0.38)",
  accentBorder: "rgba(155,89,245,0.3)",
};

export const docStyles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 9,
    fontFamily: "Helvetica",
    lineHeight: 1.35,
    color: colors.ink,
    backgroundColor: colors.cream,
  },

  // —— Header (compact for single A4) ——
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: colors.ink,
    paddingTop: 20,
    paddingBottom: 16,
    paddingLeft: 32,
    paddingRight: 32,
  },
  headerLeft: { flex: 1 },
  brandName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 2,
  },
  brandTagline: {
    fontSize: 9,
    color: colors.accentLt,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
    opacity: 0.85,
  },
  brandContact: {
    fontSize: 10,
    color: colors.whiteOpacity50,
    lineHeight: 1.4,
  },
  headerRight: { alignItems: "flex-end" },
  docTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  docNumber: {
    fontSize: 10,
    color: colors.accentLt,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  docDate: {
    fontSize: 10,
    color: colors.whiteOpacity38,
    marginBottom: 6,
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(196,160,251,0.55)",
    backgroundColor: "rgba(155,89,245,0.25)",
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.accentLt,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  accentRule: {
    height: 2,
    backgroundColor: colors.accent,
  },

  // —— Content wrapper ——
  content: {
    paddingHorizontal: 32,
    paddingTop: 12,
    paddingBottom: 12,
  },

  // —— Billed To ——
  billedToSection: {
    paddingHorizontal: 32,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  partyLabel: {
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.accent,
    marginBottom: 4,
  },
  partyName: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.ink,
    marginBottom: 2,
  },
  partyDetail: {
    fontSize: 10,
    color: colors.muted,
    lineHeight: 1.4,
  },

  // —— Items table (compact) ——
  table: { marginTop: 12, marginBottom: 10 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.ink,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: colors.accentLt,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  tableRowAlt: { backgroundColor: colors.rowEven },
  colNum: { width: "8%", textAlign: "center" },
  colItem: { width: "28%" },
  colQty: { width: "14%", textAlign: "center" },
  colUnitRate: { width: "14%", textAlign: "right" },
  colGst: { width: "10%", textAlign: "right" },
  colAmount: { width: "14%", textAlign: "right" },
  // Quotation: 3 columns only (SL no, Description, Price/pc)
  colQuotNum: { width: "12%", textAlign: "center" },
  colQuotDesc: { width: "68%" },
  colQuotPrice: { width: "20%", textAlign: "right" },
  right: { textAlign: "right" as const },
  center: { textAlign: "center" as const },
  cellMuted: { color: colors.muted, fontSize: 9 },
  cellBold: { fontWeight: "bold" },

  // —— Totals ——
  totalsSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  totalsBox: { width: 260 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    borderStyle: "dashed",
    fontSize: 10,
    color: colors.muted,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 6,
    marginTop: 4,
    borderBottomWidth: 0,
    fontSize: 12,
    fontWeight: "bold",
    color: colors.ink,
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.ink,
  },

  // —— Amount in words (light purple box, left border) ——
  wordsBlock: {
    marginBottom: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#ede9fe",
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    borderRadius: 4,
    fontSize: 10,
    color: colors.ink,
  },
  wordsBlockStrong: {
    fontWeight: "bold",
    color: colors.ink,
  },

  // —— Notes & Terms ——
  notesTerms: { marginBottom: 10, fontSize: 9, color: colors.ink },
  notesTermsLabel: { fontWeight: "bold", marginBottom: 2 },

  // —— Payment (compact) ——
  paymentSection: {
    backgroundColor: colors.ink,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginBottom: 10,
  },
  paymentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.accentBorder,
  },
  paymentIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(155,89,245,0.2)",
    borderWidth: 1,
    borderColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  paymentIconText: { fontSize: 12, color: colors.accentLt },
  paymentTitle: {
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.accentLt,
    fontWeight: "bold",
  },
  paymentSubtitle: {
    fontSize: 9,
    color: colors.whiteOpacity38,
    marginTop: 1,
  },
  paymentGrid: {
    flexDirection: "column",
  },
  paymentRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  paymentCell: {
    width: "50%",
    paddingRight: 16,
  },
  paymentField: {
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "rgba(196,160,251,0.55)",
    marginBottom: 2,
    fontWeight: "bold",
  },
  paymentValue: {
    fontSize: 10,
    color: "rgba(255,255,255,0.88)",
    fontWeight: "bold",
  },
  paymentValueHighlight: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.accentLt,
  },
  paymentFieldRaw: {
    width: "100%",
    marginBottom: 6,
  },

  // —— Footer ——
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerNote: { fontSize: 9, color: colors.muted },
  footerBrand: { fontSize: 10, fontWeight: "bold", color: colors.accent },

  validity: { fontSize: 9, color: colors.muted, marginBottom: 8 },
});
