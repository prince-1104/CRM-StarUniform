import { ToWords } from "to-words";

const toWords = new ToWords({ localeCode: "en-IN" });

/**
 * Convert amount to words for document display (e.g. "Twenty Thousand Rupees Only").
 * Uses to-words with en-IN locale.
 */
export function amountInWords(amount: number): string {
  const words = toWords.convert(amount, { currency: true });
  return typeof words === "string" ? words : String(words);
}
