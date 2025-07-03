import { z } from "zod";

export type User = {
  id: number;
  phone: string;
  ippis: string;
  name: string;
  workplace: string;
  position: string;
  nextOfKinName: string;
  nextOfKinRelationship: string;
  nextOfKinPhone: string;
  monthlyLimit: number;
  currentBalance: number;
  isVerified: boolean;
  profilePhoto: string | null;
  state: string;
  creditScore: number;
  hasCreditCard: boolean;
  creditLimit: number;
  createdAt: Date | null;
};

export type FoodItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  unit: string;
  image: string;
  stock: number;
  isAvailable: boolean;
};

export type Order = {
  id: number;
  userId: number;
  items: unknown;
  totalAmount: number;
  status: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type Purchase = {
  id: number;
  userId: number;
  orderId: number;
  items: unknown;
  totalAmount: number;
  month: string;
  year: number;
  receiptId: string;
  createdAt: Date | null;
};

export type InsertUser = Omit<
  User,
  "id" | "createdAt" | "currentBalance" | "isVerified" | "profilePhoto"
  | "creditScore" | "hasCreditCard" | "creditLimit"
>;
export type InsertFoodItem = Omit<FoodItem, "id">;
export type InsertOrder = Omit<Order, "id" | "createdAt" | "updatedAt">;
export type InsertPurchase = Omit<Purchase, "id" | "createdAt">;

export const insertUserSchema = z.object({
  phone: z.string().min(11, "Phone number must be at least 11 digits"),
  ippis: z.string().min(1, "IPPIS number is required"),
  name: z.string().min(1, "Name is required"),
  workplace: z.string().min(1, "Workplace is required"),
  position: z.string().min(1, "Position is required"),
  nextOfKinName: z.string().min(1, "Next of kin name is required"),
  nextOfKinRelationship: z.string().min(1, "Next of kin relationship is required"),
  nextOfKinPhone: z.string().min(11, "Next of kin phone number must be at least 11 digits"),
  monthlyLimit: z.number().int().positive().default(80000),
  state: z.string().min(1, "State is required"),
});

export const insertOrderSchema = z.object({
  userId: z.number().int().positive(),
  items: z.array(z.unknown()).min(1, "An order needs at least one item"),
  totalAmount: z.number().int().positive(),
  status: z.string().default("ordered"),
});

export const insertPurchaseSchema = z.object({
  userId: z.number().int().positive(),
  orderId: z.number().int().positive(),
  items: z.array(z.unknown()).min(1),
  totalAmount: z.number().int().positive(),
  month: z.string().min(1),
  year: z.number().int(),
  receiptId: z.string().min(1),
});
