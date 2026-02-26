import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Amount in words (Indian numbering: lakh, crore)
const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

function twoDigits(n: number): string {
  if (n < 10) return ones[n];
  if (n < 20) return teens[n - 10];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return tens[t] + (o ? " " + ones[o] : "");
}

function threeDigits(n: number): string {
  if (n === 0) return "";
  const h = Math.floor(n / 100);
  const rest = n % 100;
  const part = h ? ones[h] + " Hundred" : "";
  return part + (rest ? " " + twoDigits(rest) : "");
}

export function amountInWords(num: number): string {
  if (num === 0) return "Zero Only";
  const intPart = Math.floor(num);
  const decPart = Math.round((num - intPart) * 100);
  if (intPart >= 1e7) {
    const crore = Math.floor(intPart / 1e7);
    const lakh = Math.floor((intPart % 1e7) / 1e5);
    const rest = intPart % 1e5;
    let s = threeDigits(crore) + " Crore";
    if (lakh) s += " " + threeDigits(lakh) + " Lakh";
    if (rest) s += " " + threeDigits(rest);
    s += " Only";
    if (decPart) s += " and " + twoDigits(decPart) + " Paise Only";
    return s;
  }
  if (intPart >= 1e5) {
    const lakh = Math.floor(intPart / 1e5);
    const rest = intPart % 1e5;
    let s = threeDigits(lakh) + " Lakh";
    if (rest) s += " " + threeDigits(rest);
    s += " Only";
    if (decPart) s += " and " + twoDigits(decPart) + " Paise Only";
    return s;
  }
  let s = threeDigits(intPart) || "Zero";
  s += " Only";
  if (decPart) s += " and " + twoDigits(decPart) + " Paise Only";
  return s;
}

/** GST: taxable amount & rate → { cgst, sgst, totalGst } (assuming 50-50 split) */
export function gstFromTaxable(amount: number, gstPercent: number): {
  cgst: number;
  sgst: number;
  totalGst: number;
} {
  const totalGst = Math.round((amount * gstPercent) / 100 * 100) / 100;
  const half = Math.round(totalGst * 50) / 100;
  return { cgst: half, sgst: half, totalGst };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(d: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(d));
}
