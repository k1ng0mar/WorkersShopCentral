import type { User, InsertUser, FoodItem, InsertFoodItem, Order, InsertOrder, Purchase, InsertPurchase } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  getUserByIppis(ippis: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Food item methods
  getFoodItems(): Promise<FoodItem[]>;
  getFoodItemById(id: number): Promise<FoodItem | undefined>;
  getFoodItemsByCategory(category: string): Promise<FoodItem[]>;
  createFoodItem(item: InsertFoodItem): Promise<FoodItem>;
  updateFoodItem(id: number, updates: Partial<FoodItem>): Promise<FoodItem | undefined>;
  
  // Order methods
  getOrdersByUserId(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, updates: Partial<Order>): Promise<Order | undefined>;
  
  // Purchase methods
  getPurchasesByUserId(userId: number): Promise<Purchase[]>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private foodItems: Map<number, FoodItem>;
  private orders: Map<number, Order>;
  private purchases: Map<number, Purchase>;
  private currentUserId: number;
  private currentFoodItemId: number;
  private currentOrderId: number;
  private currentPurchaseId: number;

  constructor() {
    this.users = new Map();
    this.foodItems = new Map();
    this.orders = new Map();
    this.purchases = new Map();
    this.currentUserId = 1;
    this.currentFoodItemId = 1;
    this.currentOrderId = 1;
    this.currentPurchaseId = 1;
    
    // Initialize with sample food items
    this.initializeFoodItems();
  }

  private initializeFoodItems() {
    const sampleFoodItems: InsertFoodItem[] = [
      {
        name: "Premium Rice 50kg",
        description: "High-quality long grain rice",
        price: 29000,
        category: "Rice & Grains",
        unit: "50kg bag",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        stock: 50,
        isAvailable: true,
      },
      {
        name: "Cooking Oil 5L",
        description: "Pure vegetable cooking oil",
        price: 4500,
        category: "Cooking Oil",
        unit: "5L bottle",
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        stock: 100,
        isAvailable: true,
      },
      {
        name: "Spaghetti 5kg",
        description: "Premium durum wheat pasta",
        price: 3200,
        category: "Pasta",
        unit: "5kg pack",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        stock: 30,
        isAvailable: true,
      },
      {
        name: "Indomie Carton",
        description: "40 packs instant noodles",
        price: 6500,
        category: "Instant Foods",
        unit: "40 packs",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        stock: 25,
        isAvailable: true,
      },
      {
        name: "Beans 50kg",
        description: "High-quality brown beans",
        price: 25000,
        category: "Rice & Grains",
        unit: "50kg bag",
        image: "https://images.unsplash.com/photo-1582752499629-0b6c4b5f9a89?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        stock: 40,
        isAvailable: true,
      },
      {
        name: "Garri 10kg",
        description: "Premium cassava flakes",
        price: 8000,
        category: "Rice & Grains",
        unit: "10kg bag",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        stock: 60,
        isAvailable: true,
      },
      {
        name: "Frozen Chicken 2kg",
        description: "Fresh frozen whole chicken",
        price: 6500,
        category: "Meat & Fish",
        unit: "2kg",
        image: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        stock: 35,
        isAvailable: true,
      },
      {
        name: "Beef 1kg",
        description: "Fresh beef cuts",
        price: 4800,
        category: "Meat & Fish",
        unit: "1kg",
        image: "https://images.unsplash.com/photo-1551222777-3c7cdc2b2c37?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        stock: 20,
        isAvailable: true,
      },
      {
        name: "Tomatoes 5kg",
        description: "Fresh tomatoes",
        price: 3500,
        category: "Vegetables",
        unit: "5kg basket",
        image: "https://images.unsplash.com/photo-1546470427-227e9df8d6a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        stock: 45,
        isAvailable: true,
      },
      {
        name: "Onions 10kg",
        description: "Fresh onions",
        price: 4200,
        category: "Vegetables",
        unit: "10kg bag",
        image: "https://images.unsplash.com/photo-1508747703725-719777637510?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        stock: 30,
        isAvailable: true,
      },
      {
        name: "Plantain Bunch",
        description: "Fresh unripe plantains",
        price: 2500,
        category: "Vegetables",
        unit: "bunch",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        stock: 25,
        isAvailable: true,
      },
      {
        name: "Milk Powder 900g",
        description: "Full cream milk powder",
        price: 3800,
        category: "Dairy",
        unit: "900g tin",
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        stock: 40,
        isAvailable: true,
      },
      {
        name: "Sugar 5kg",
        description: "Refined white sugar",
        price: 2800,
        category: "Condiments",
        unit: "5kg bag",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        stock: 50,
        isAvailable: true,
      },
      {
        name: "Salt 1kg",
        description: "Iodized table salt",
        price: 400,
        category: "Condiments",
        unit: "1kg pack",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        stock: 100,
        isAvailable: true,
      },
      {
        name: "Yam Tuber 5kg",
        description: "Fresh yam tubers",
        price: 3200,
        category: "Vegetables",
        unit: "5kg",
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        stock: 20,
        isAvailable: true,
      },
    ];

    sampleFoodItems.forEach(item => {
      this.createFoodItem(item);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.phone === phone);
  }

  async getUserByIppis(ippis: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.ippis === ippis);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    
    // Generate credit score and credit card eligibility based on state
    const isEligibleForCredit = insertUser.state === "Kano" || insertUser.state === "Federal Capital Territory";
    const creditScore = isEligibleForCredit ? Math.floor(Math.random() * 200) + 600 : Math.floor(Math.random() * 500) + 300; // 600-800 for eligible, 300-800 for others
    const hasCreditCard = isEligibleForCredit && creditScore >= 650;
    const creditLimit = hasCreditCard ? (creditScore > 750 ? 200000 : 150000) : 0;
    
    const user: User = {
      ...insertUser,
      id,
      monthlyLimit: insertUser.monthlyLimit || 80000,
      currentBalance: 0,
      isVerified: true, // Auto-verify for demo
      profilePhoto: null,
      state: insertUser.state || "Federal Capital Territory",
      creditScore,
      hasCreditCard,
      creditLimit,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Food item methods
  async getFoodItems(): Promise<FoodItem[]> {
    return Array.from(this.foodItems.values());
  }

  async getFoodItemById(id: number): Promise<FoodItem | undefined> {
    return this.foodItems.get(id);
  }

  async getFoodItemsByCategory(category: string): Promise<FoodItem[]> {
    return Array.from(this.foodItems.values()).filter(item => item.category === category);
  }

  async createFoodItem(insertItem: InsertFoodItem): Promise<FoodItem> {
    const id = this.currentFoodItemId++;
    const item: FoodItem = { 
      ...insertItem, 
      id,
      stock: insertItem.stock || 0,
      isAvailable: insertItem.isAvailable !== undefined ? insertItem.isAvailable : true
    };
    this.foodItems.set(id, item);
    return item;
  }

  async updateFoodItem(id: number, updates: Partial<FoodItem>): Promise<FoodItem | undefined> {
    const item = this.foodItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates };
    this.foodItems.set(id, updatedItem);
    return updatedItem;
  }

  // Order methods
  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      ...insertOrder,
      id,
      status: insertOrder.status || "ordered",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: number, updates: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...updates, updatedAt: new Date() };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Purchase methods
  async getPurchasesByUserId(userId: number): Promise<Purchase[]> {
    return Array.from(this.purchases.values()).filter(purchase => purchase.userId === userId);
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const id = this.currentPurchaseId++;
    const purchase: Purchase = {
      ...insertPurchase,
      id,
      createdAt: new Date(),
    };
    this.purchases.set(id, purchase);
    return purchase;
  }
}

export const storage = new MemStorage();
