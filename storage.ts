import { type Product, type Order, type OrderItem, type InsertProduct, type InsertOrder, type InsertOrderItem } from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  addOrderItem(item: InsertOrderItem): Promise<OrderItem>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private currentProductId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;

  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.currentProductId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;

    // Initialize with sample products
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Яблоки Голден",
        description: "Сладкие и сочные яблоки",
        price: "99.99",
        category: "fruits",
        imageUrl: "https://images.unsplash.com/photo-1610444833641-0542660a4ed7",
        inStock: 100
      },
      {
        name: "Бананы",
        description: "Спелые бананы из Эквадора",
        price: "89.99",
        category: "fruits",
        imageUrl: "https://images.unsplash.com/photo-1498579397066-22750a3cb424",
        inStock: 150
      },
      {
        name: "Помидоры",
        description: "Свежие томаты",
        price: "199.99",
        category: "vegetables",
        imageUrl: "https://images.unsplash.com/photo-1557844352-761f2565b576",
        inStock: 80
      },
      {
        name: "Огурцы",
        description: "Хрустящие огурцы",
        price: "149.99",
        category: "vegetables",
        imageUrl: "https://images.unsplash.com/photo-1610348725531-843dff563e2c",
        inStock: 90
      },
      {
        name: "Курага",
        description: "Сушеный абрикос",
        price: "399.99",
        category: "dried",
        imageUrl: "https://images.unsplash.com/photo-1595412017587-b7f3117dff54",
        inStock: 50
      }
    ];

    sampleProducts.forEach(product => {
      const id = this.currentProductId++;
      this.products.set(id, { ...product, id });
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const newOrder = { ...order, id };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async addOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const newItem = { ...item, id };
    this.orderItems.set(id, newItem);
    return newItem;
  }
}

export const storage = new MemStorage();
