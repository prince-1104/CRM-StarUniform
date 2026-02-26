import { z } from "zod";

export const invoiceItemSchema = z.object({
  productId: z.string().optional(),
  name: z.string().min(1, "Item name required"),
  description: z.string().optional(),
  quantity: z.number().positive(),
  unit: z.string().default("pcs"),
  rate: z.number().min(0),
  gstPercent: z.number().min(0).max(100),
});
// amount = quantity * rate; gstAmount computed server-side

export const createInvoiceSchema = z.object({
  documentType: z.enum(["invoice", "quotation"]).optional().default("invoice"),
  clientId: z.string().min(1, "Client required"),
  invoiceDate: z.string().min(1),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  deliveryCharges: z.preprocess(
    (v) => (v === "" || v == null || Number.isNaN(v) ? undefined : v),
    z.number().min(0).optional()
  ),
  advancePayment: z.preprocess(
    (v) => (v === "" || v == null || Number.isNaN(v) ? undefined : v),
    z.number().min(0).optional()
  ),
  items: z.array(invoiceItemSchema).min(1, "At least one item required"),
});

export const updateInvoiceSchema = z.object({
  invoiceDate: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  items: z.array(invoiceItemSchema).optional(),
});

export type InvoiceItemInput = z.infer<typeof invoiceItemSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
