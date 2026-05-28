import { z } from "zod";

export const departmentSchema = z.enum([
  "ALIBORI",
  "ATACORA",
  "ATLANTIQUE",
  "BORGOU",
  "COLLINES",
  "COUFFO",
  "DONGA",
  "LITTORAL",
  "MONO",
  "OUEME",
  "PLATEAU",
  "ZOU"
]);

export const registerSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Adresse email invalide").toLowerCase(),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caracteres"),
  role: z.enum(["BUYER", "SUPPLIER"]),
  companyName: z.string().min(2, "Nom d'entreprise requis"),
  description: z.string().optional(),
  department: departmentSchema,
  phone: z.string().min(8, "Telephone requis"),
  website: z.string().url().optional().or(z.literal(""))
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1)
});

export const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().min(1),
  department: departmentSchema,
  images: z.array(z.string().url()).default([])
});

export const productFilterSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  department: departmentSchema.optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  page: z.coerce.number().int().min(1).default(1)
});

export const quoteRequestSchema = z.object({
  productId: z.string().min(1),
  supplierId: z.string().min(1),
  message: z.string().min(10).max(1200)
});

export const quoteStatusSchema = z.object({
  status: z.enum(["PENDING", "REPLIED", "CLOSED"])
});

export const messageSchema = z.object({
  receiverId: z.string().min(1),
  content: z.string().min(1).max(2000)
});

export const favoriteSchema = z.object({
  productId: z.string().optional(),
  supplierId: z.string().optional()
});

export const subscriptionCheckoutSchema = z.object({
  cadence: z.enum(["monthly", "annual"]).default("monthly"),
  paymentMethod: z.enum(["FEDAPAY", "MTN_MOMO", "MOOV_MONEY", "CARD"]).default("FEDAPAY")
});

export const moderationSchema = z.object({
  status: z.enum(["PENDING", "ACTIVE", "SUSPENDED"]).optional(),
  isVerified: z.boolean().optional(),
  plan: z.enum(["FREE", "PREMIUM"]).optional()
});
