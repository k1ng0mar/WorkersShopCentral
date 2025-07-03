import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, ShoppingCart, Search, Filter } from "lucide-react";
import { FoodItem, User } from "@shared/schema";
import { WORKERSSHOP_CONSTANTS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FoodMenuProps {
  user: User;
}

interface CartItem extends FoodItem {
  quantity: number;
}

export default function FoodMenu({ user }: FoodMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: foodItems = [], isLoading } = useQuery({
    queryKey: ["/api/food-items"],
    queryFn: async () => {
      const response = await fetch("/api/food-items");
      if (!response.ok) {
        throw new Error("Failed to fetch food items");
      }
      return response.json();
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: { userId: number; items: any; totalAmount: number }) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Order Created",
        description: "Your order has been submitted successfully!",
      });
      setCart([]);
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
    onError: (error: any) => {
      toast({
        title: "Order Failed",
        description: error.message || "Failed to create order",
        variant: "destructive",
      });
    },
  });

  const filteredItems = foodItems.filter((item: FoodItem) => {
    const matchesCategory = selectedCategory === "All Items" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: FoodItem) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prev.filter(cartItem => cartItem.id !== itemId);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const canAfford = user.currentBalance + cartTotal <= user.monthlyLimit;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checking out",
        variant: "destructive",
      });
      return;
    }

    if (!canAfford) {
      toast({
        title: "Insufficient Balance",
        description: "This order exceeds your monthly limit",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user.id,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit,
      })),
      totalAmount: cartTotal,
    };

    createOrderMutation.mutate(orderData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStockStatus = (stock: number) => {
    if (stock > 50) return { color: "bg-green-500", text: "In Stock" };
    if (stock > 10) return { color: "bg-yellow-500", text: "Low Stock" };
    return { color: "bg-red-500", text: "Out of Stock" };
  };

  return (
    <div className="space-y-6">
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Food Menu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Items</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  id="search"
                  placeholder="Search food items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {WORKERSSHOP_CONSTANTS.FOOD_CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Food Items Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item: FoodItem) => {
                const stockStatus = getStockStatus(item.stock);
                const cartItem = cart.find(cartItem => cartItem.id === item.id);
                
                return (
                  <Card key={item.id} className="glassmorphism hover:scale-105 transition-transform">
                    <CardContent className="p-4">
                      <div className="relative mb-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${stockStatus.color}`}></div>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      <p className="text-xs text-gray-500 mb-3">Unit: {item.unit}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-primary">
                          {formatCurrency(item.price)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {stockStatus.text}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {cartItem ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => removeFromCart(item.id)}
                              className="h-8 w-8"
                            >
                              <Minus size={16} />
                            </Button>
                            <span className="font-medium">{cartItem.quantity}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => addToCart(item)}
                              className="h-8 w-8"
                            >
                              <Plus size={16} />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => addToCart(item)}
                            disabled={!item.isAvailable || item.stock === 0}
                            className="glow-button"
                          >
                            <Plus size={16} className="mr-2" />
                            Add
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Cart Summary */}
          {cart.length > 0 && (
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Cart Summary</h3>
                <div className="space-y-2 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center text-lg font-semibold mb-4">
                  <span>Total:</span>
                  <span className="text-primary">{formatCurrency(cartTotal)}</span>
                </div>
                
                {!canAfford && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-red-700">
                      This order exceeds your monthly limit of {formatCurrency(user.monthlyLimit)}
                    </p>
                  </div>
                )}
                
                <Button
                  onClick={handleCheckout}
                  disabled={!canAfford || createOrderMutation.isPending}
                  className="w-full glow-button"
                >
                  {createOrderMutation.isPending ? "Processing..." : "Checkout"}
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
