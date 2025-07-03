import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  ShoppingCart, 
  Package, 
  Receipt as ReceiptIcon, 
  LogOut,
  Home,
  Calendar,
  TrendingUp
} from "lucide-react";
import { authService } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import ProfilePanel from "@/components/profile-panel";
import FoodMenu from "@/components/food-menu";
import OrderTracking from "@/components/order-tracking";
import ReceiptComponent from "@/components/receipt";
import { WORKERSSHOP_CONSTANTS } from "@/lib/constants";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      setLocation("/login");
    }
  }, [currentUser, setLocation]);

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders/user", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      const response = await fetch(`/api/orders/user/${currentUser.id}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!currentUser,
  });

  const { data: purchases = [] } = useQuery({
    queryKey: ["/api/purchases/user", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      const response = await fetch(`/api/purchases/user/${currentUser.id}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!currentUser,
  });

  const handleLogout = () => {
    authService.logout();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    setLocation("/");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (!currentUser) {
    return null;
  }

  const currentMonth = new Date().toLocaleDateString('en-NG', { month: 'long', year: 'numeric' });
  const totalSpent = purchases.reduce((sum: number, purchase: any) => sum + purchase.totalAmount, 0);
  const availableBalance = currentUser.monthlyLimit - currentUser.currentBalance;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <ShoppingCart className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {WORKERSSHOP_CONSTANTS.APP_NAME}
                </h1>
                <p className="text-gray-600 text-sm">
                  {getGreeting()}, {currentUser.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="hidden sm:flex">
                {currentUser.workplace}
              </Badge>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Limit</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(currentUser.monthlyLimit)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Used This Month</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(currentUser.currentBalance)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available Balance</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(availableBalance)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Home className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {orders.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="menu">Food Menu</TabsTrigger>
            <TabsTrigger value="receipts">Receipts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ProfilePanel user={currentUser} />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <OrderTracking orders={orders} />
                
                {/* Recent Activity */}
                <Card className="glassmorphism">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ReceiptIcon className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">No recent activity</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.slice(0, 3).map((order: any) => (
                          <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Package className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">Order #{order.id}</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatCurrency(order.totalAmount)}</p>
                              <Badge variant="outline" className="text-xs">
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="grid lg:grid-cols-2 gap-6">
              <ProfilePanel user={currentUser} />
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Account Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Account Status</p>
                      <Badge className="mt-2 bg-green-500">Active</Badge>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Verification</p>
                      <Badge className="mt-2 bg-green-500">Verified</Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since:</span>
                      <span className="font-medium">
                        {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Orders:</span>
                      <span className="font-medium">{orders.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">This Month:</span>
                      <span className="font-medium">{currentMonth}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <OrderTracking orders={orders} />
          </TabsContent>

          <TabsContent value="menu">
            <FoodMenu user={currentUser} />
          </TabsContent>

          <TabsContent value="receipts">
            <ReceiptComponent user={currentUser} purchases={purchases} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
