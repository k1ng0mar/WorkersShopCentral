import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertOrderSchema, insertPurchaseSchema, type User } from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  phone: z.string().min(11, "Phone number must be at least 11 digits"),
});

const verifyIppisSchema = z.object({
  ippis: z.string().min(1, "IPPIS number is required"),
});

// Fields a client may change after the fact. Balance and identity fields are
// server-owned, so they are not accepted here.
const orderUpdateSchema = z.object({
  status: z.enum(["ordered", "approved", "packed", "out_for_delivery", "delivered"]).optional(),
});

const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  workplace: z.string().min(1).optional(),
  position: z.string().min(1).optional(),
  nextOfKinName: z.string().min(1).optional(),
  nextOfKinRelationship: z.string().min(1).optional(),
  nextOfKinPhone: z.string().min(11).optional(),
  state: z.string().min(1).optional(),
});

// The client only needs these fields. IPPIS and next of kin stay server side.
function publicUser(user: User) {
  const { ippis, nextOfKinName, nextOfKinRelationship, nextOfKinPhone, ...rest } = user;
  return rest;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByPhone(userData.phone);
      if (existingUser) {
        return res.status(400).json({ message: "User with this phone number already exists" });
      }

      const existingIppis = await storage.getUserByIppis(userData.ippis);
      if (existingIppis) {
        return res.status(400).json({ message: "IPPIS number already registered" });
      }

      const user = await storage.createUser(userData);

      res.json({
        message: "Registration successful",
        user: publicUser(user),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { phone } = loginSchema.parse(req.body);

      const user = await storage.getUserByPhone(phone);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // No OTP step yet. Return only the fields the client renders.
      res.json({
        message: "Login successful",
        user: publicUser(user),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/verify-ippis", async (req, res) => {
    try {
      verifyIppisSchema.parse(req.body);

      // IPPIS has no public verification API wired up yet.
      res.status(501).json({
        message: "IPPIS verification is not implemented yet",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "IPPIS verification failed" });
    }
  });

  // Food items routes
  app.get("/api/food-items", async (req, res) => {
    try {
      const { category } = req.query;
      
      let items;
      if (category && typeof category === 'string') {
        items = await storage.getFoodItemsByCategory(category);
      } else {
        items = await storage.getFoodItems();
      }
      
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch food items" });
    }
  });

  app.get("/api/food-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getFoodItemById(id);
      
      if (!item) {
        return res.status(404).json({ message: "Food item not found" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch food item" });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);

      const user = await storage.getUser(orderData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const remaining = user.monthlyLimit - user.currentBalance;
      if (orderData.totalAmount > remaining) {
        return res.status(400).json({
          message: "Order exceeds remaining monthly limit",
          remaining,
          monthlyLimit: user.monthlyLimit,
        });
      }

      const order = await storage.createOrder(orderData);
      await storage.updateUser(orderData.userId, {
        currentBalance: user.currentBalance + orderData.totalAmount,
      });

      res.json({ 
        message: "Order created successfully", 
        order 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const orders = await storage.getOrdersByUserId(userId);
      
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = orderUpdateSchema.parse(req.body);

      const order = await storage.updateOrder(id, updates);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json({ 
        message: "Order updated successfully", 
        order 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Purchase routes
  app.post("/api/purchases", async (req, res) => {
    try {
      const purchaseData = insertPurchaseSchema.parse(req.body);
      
      const purchase = await storage.createPurchase(purchaseData);
      
      res.json({ 
        message: "Purchase recorded successfully", 
        purchase 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to record purchase" });
    }
  });

  app.get("/api/purchases/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const purchases = await storage.getPurchasesByUserId(userId);
      
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch purchases" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(publicUser(user));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = userUpdateSchema.parse(req.body);

      const user = await storage.updateUser(id, updates);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ 
        message: "User updated successfully", 
        user 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
