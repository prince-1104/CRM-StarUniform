import numeral from "numeral";

const DEFAULT_CURRENCY = "INR";
const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

/**
 * Format a number as currency for display in documents.
 * Uses numeral for consistent formatting; symbol from currency code.
 */
export function formatCurrency(
  value: number,
  currency: string = DEFAULT_CURRENCY
): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency + " ";
  return symbol + numeral(value).format("0,0.00");
}
