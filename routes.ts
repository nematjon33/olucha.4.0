import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createOrderSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const products = await storage.getProductsByCategory(req.params.category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = createOrderSchema.parse(req.body);
      
      const order = await storage.createOrder({
        customerName: orderData.customerName,
        phone: orderData.phone,
        address: orderData.address,
        total: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toString(),
        status: "pending"
      });

      for (const item of orderData.items) {
        await storage.addOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price.toString()
        });
      }

      res.json(order);
    } catch (error) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: fromZodError(error).message });
      } else {
        res.status(500).json({ message: "Failed to create order" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
