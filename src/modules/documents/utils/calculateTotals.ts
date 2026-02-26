/**
 * Pure utility: compute subtotal, GST per line, total GST, grand total.
 * All values rounded to 2 decimals.
 */
import type { DocumentItem } from "../types";
import type { TotalsResult } from "../types";

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calculateTotals(items: DocumentItem[]): TotalsResult {
  const lineItems = items.map((item) => {
    const amount = round2(item.quantity * item.rate);
    const gstAmount = round2((amount * item.gstPercent) / 100);
    const lineTotal = round2(amount + gstAmount);
    return { amount, gstAmount, lineTotal };
  });

  const subtotal = round2(lineItems.reduce((sum, l) => sum + l.amount, 0));
  const totalGst = round2(lineItems.reduce((sum, l) => sum + l.gstAmount, 0));
  const grandTotal = round2(lineItems.reduce((sum, l) => sum + l.lineTotal, 0));

  return {
    subtotal,
    lineItems,
    totalGst,
    totalGST: totalGst,
    grandTotal,
  };
}

/**
 * Apply delivery and advance to grand total (for invoice).
 * grandTotalAfterExtras = subtotal + totalGst + deliveryCharges - advancePayment
 */
export function applyExtras(
  grandTotal: number,
  deliveryCharges?: number,
  advancePayment?: number
): number {
  let total = grandTotal;
  if (deliveryCharges != null && deliveryCharges > 0) total = round2(total + deliveryCharges);
  if (advancePayment != null && advancePayment > 0) total = round2(total - advancePayment);
  return Math.max(0, total);
}
