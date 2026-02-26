import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password at least 8 characters"),
    confirmPassword: z.string(),
    businessName: z.string().min(1, "Business name required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
