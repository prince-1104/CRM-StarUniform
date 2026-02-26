import type { DocumentData, LegacyDocumentData } from "./types";

/** Normalize legacy docNumber to documentNumber for engine compatibility. */
export function normalizeDocumentData(
  data: DocumentData | LegacyDocumentData
): DocumentData {
  const documentNumber =
    "documentNumber" in data && data.documentNumber
      ? data.documentNumber
      : "docNumber" in data && typeof (data as LegacyDocumentData).docNumber === "string"
        ? (data as LegacyDocumentData).docNumber!
        : "";
  const { docNumber: _drop, ...rest } = data as LegacyDocumentData & DocumentData;
  return { ...rest, documentNumber };
}

export class DocumentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DocumentValidationError";
  }
}

function isNumber(x: unknown): x is number {
  return typeof x === "number" && !Number.isNaN(x);
}

export function validateDocumentData(data: DocumentData): void {
  if (!data.company?.name?.trim()) {
    throw new DocumentValidationError("Company (billed by) is required.");
  }
  if (!data.client?.name?.trim()) {
    throw new DocumentValidationError("Client (billed to) is required.");
  }
  if (!data.items?.length) {
    throw new DocumentValidationError("At least one item is required.");
  }
  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    if (!isNumber(item.quantity) || item.quantity < 0)
      throw new DocumentValidationError(`Item ${i + 1}: quantity must be a non-negative number.`);
    if (!isNumber(item.rate) || item.rate < 0)
      throw new DocumentValidationError(`Item ${i + 1}: rate must be a non-negative number.`);
    if (!isNumber(item.gstPercent) || item.gstPercent < 0 || item.gstPercent > 100)
      throw new DocumentValidationError(`Item ${i + 1}: gstPercent must be a number between 0 and 100.`);
  }
  if (data.deliveryCharges != null && !isNumber(data.deliveryCharges)) {
    throw new DocumentValidationError("deliveryCharges must be a number.");
  }
  if (data.advancePayment != null && !isNumber(data.advancePayment)) {
    throw new DocumentValidationError("advancePayment must be a number.");
  }
}
