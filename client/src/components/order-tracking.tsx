import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Package, Truck, CheckCircle2 } from "lucide-react";
import { Order } from "@shared/schema";

interface OrderTrackingProps {
  orders: Order[];
}

export default function OrderTracking({ orders }: OrderTrackingProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ordered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "packed":
        return <Package className="w-5 h-5 text-orange-500" />;
      case "out_for_delivery":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ordered":
      case "approved":
      case "delivered":
        return "bg-green-500";
      case "packed":
        return "bg-orange-500";
      case "out_for_delivery":
        return "bg-blue-500";
      default:
        return "bg-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ordered":
        return "Ordered";
      case "approved":
        return "Approved";
      case "packed":
        return "Packed";
      case "out_for_delivery":
        return "Out for Delivery";
      case "delivered":
        return "Delivered";
      default:
        return "Unknown";
    }
  };

  const orderStatuses = ["ordered", "approved", "packed", "out_for_delivery", "delivered"];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  if (orders.length === 0) {
    return (
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No orders to track</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Order Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {orders.slice(0, 3).map((order) => (
          <div key={order.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-sm text-gray-600">
                  {formatDate(order.createdAt ?? new Date())} • {formatCurrency(order.totalAmount)}
                </p>
              </div>
              <Badge variant="outline" className={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </Badge>
            </div>

            {/* Progress Stepper */}
            <div className="relative">
              <div className="flex items-center justify-between">
                {orderStatuses.map((status, index) => {
                  const currentIndex = orderStatuses.indexOf(order.status);
                  const isCompleted = index <= currentIndex;
                  const isActive = index === currentIndex;
                  
                  return (
                    <div key={status} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          isCompleted
                            ? `${getStatusColor(status)} border-transparent`
                            : "bg-gray-200 border-gray-300"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-2 text-center">
                        {getStatusText(status)}
                      </p>
                    </div>
                  );
                })}
              </div>
              
              {/* Connection Lines */}
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 -z-10">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{
                    width: `${(orderStatuses.indexOf(order.status) / (orderStatuses.length - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
