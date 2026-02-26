import type { Invoice, Client, Organization, InvoiceItem } from "@prisma/client";
import type { DocumentData, DocumentItem, Party, BankDetails } from "./types";

type InvoiceWithRelations = Invoice & {
  items: InvoiceItem[];
  client: Client;
  organization: Organization;
};

function mapParty(org: Organization): Party {
  return {
    name: org.name,
    address: org.address ?? "",
    email: org.email ?? undefined,
    phone: org.phone ?? undefined,
    gstin: org.gstNumber ?? undefined,
  };
}

function mapClient(client: Client): Party {
  return {
    name: client.name,
    address: client.billingAddress || client.shippingAddress || "",
    email: client.email ?? undefined,
    phone: client.phone ?? undefined,
    gstin: client.gstin ?? undefined,
  };
}

function mapItems(items: InvoiceItem[]): DocumentItem[] {
  return items
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => ({
      name: item.name,
      quantity: Number(item.quantity),
      unit: item.unit,
      rate: Number(item.rate),
      gstPercent: Number(item.gstPercent),
    }));
}

/** Parse organization.bankDetails (e.g. "Account Name: X\nAccount Number: Y") into BankDetails if possible. */
function parseBankDetails(bankDetails: string | null): BankDetails | undefined {
  if (!bankDetails?.trim()) return undefined;
  const lines = bankDetails.split(/\r?\n/).filter(Boolean);
  const map: Record<string, string> = {};
  for (const line of lines) {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) map[match[1].trim().toLowerCase().replace(/\s+/g, "")] = match[2].trim();
  }
  const accountName = map["accountname"] ?? map["account name"];
  const accountNumber = map["accountnumber"] ?? map["account number"];
  const ifsc = map["ifsc"];
  const bankName = map["bank"];
  if (!accountName || !accountNumber || !ifsc || !bankName) return undefined;
  return {
    accountName,
    accountNumber,
    ifsc,
    bankName,
    upiId: undefined,
  };
}

export function mapInvoiceToDocumentData(invoice: InvoiceWithRelations): DocumentData {
  const org = invoice.organization;
  const bankParsed = parseBankDetails(org.bankDetails);
  const bankDetails: BankDetails | undefined = bankParsed
    ? { ...bankParsed, upiId: org.upiId ?? undefined }
    : org.upiId
      ? {
          accountName: "",
          accountNumber: "",
          ifsc: "",
          bankName: "",
          upiId: org.upiId,
        }
      : undefined;

  return {
    documentNumber: invoice.invoiceNumber,
    date:
      typeof invoice.invoiceDate === "string"
        ? invoice.invoiceDate
        : new Date(invoice.invoiceDate).toISOString().slice(0, 10),
    company: mapParty(org),
    client: mapClient(invoice.client),
    items: mapItems(invoice.items),
    notes: invoice.notes ?? undefined,
    terms: invoice.terms ?? undefined,
    bankDetails,
    logoUrl: org.logo ?? undefined,
    deliveryCharges: invoice.deliveryCharges != null ? Number(invoice.deliveryCharges) : undefined,
    advancePayment: invoice.advancePayment != null ? Number(invoice.advancePayment) : undefined,
    watermark: invoice.status === "paid" ? "PAID" : invoice.status === "draft" ? "DRAFT" : undefined,
    currency: "INR",
  };
}
