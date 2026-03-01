import dayjs from "dayjs";

/**
 * Format date for document display (e.g. 26 Feb 2026).
 */
export function formatDate(date: string | Date): string {
  return dayjs(date).format("DD MMM YYYY");
}

/**
 * Long format for document header (e.g. 26 February 2026).
 */
export function formatDateLong(date: string | Date): string {
  return dayjs(date).format("DD MMMM YYYY");
}
