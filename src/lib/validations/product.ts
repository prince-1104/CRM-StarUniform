import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name required"),
  description: z.string().optional(),
  defaultPrice: z.number().min(0),
  gstPercent: z.number().min(0).max(100),
  unit: z.string().min(1).default("pcs"),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
