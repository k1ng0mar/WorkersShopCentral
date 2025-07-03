import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Printer, Download, QrCode } from "lucide-react";
import { User, Purchase } from "@shared/schema";
import { WORKERSSHOP_CONSTANTS } from "@/lib/constants";

interface ReceiptProps {
  user: User;
  purchases: Purchase[];
}

export default function Receipt({ user, purchases }: ReceiptProps) {
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
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const handlePrint = () => {
    window.print();
  };

  const currentMonth = new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long' });
  const currentMonthPurchases = purchases.filter(purchase => {
    const purchaseDate = new Date(purchase.createdAt ?? Date.now());
    const currentDate = new Date();
    return purchaseDate.getMonth() === currentDate.getMonth() && 
           purchaseDate.getFullYear() === currentDate.getFullYear();
  });

  const totalSpent = currentMonthPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);

  if (purchases.length === 0) {
    return (
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="w-5 h-5" />
            Purchase Receipt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Printer className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No purchases to display</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5" />
            Purchase Receipt
          </div>
          <Button onClick={handlePrint} variant="outline" size="sm" className="glow-button">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 space-y-6">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-3">
                <QrCode className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary">
                  {WORKERSSHOP_CONSTANTS.APP_NAME}
                </h3>
                <p className="text-sm text-gray-600">Federal Food Loan System</p>
              </div>
            </div>
            <Separator className="my-4" />
          </div>

          {/* User Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Personal Information</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-600">Name:</span> <span className="font-medium">{user.name}</span></p>
                <p><span className="text-gray-600">IPPIS:</span> <span className="font-medium">{user.ippis}</span></p>
                <p><span className="text-gray-600">Phone:</span> <span className="font-medium">{user.phone}</span></p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Employment Details</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-600">Workplace:</span> <span className="font-medium">{user.workplace}</span></p>
                <p><span className="text-gray-600">Position:</span> <span className="font-medium">{user.position}</span></p>
                <p><span className="text-gray-600">Next of Kin:</span> <span className="font-medium">{user.nextOfKinName} ({user.nextOfKinRelationship})</span></p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Purchase Details */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Purchase Details - {currentMonth}</h4>
            <div className="space-y-2">
              {currentMonthPurchases.map((purchase) => {
                const items = Array.isArray(purchase.items) ? purchase.items : [];
                return (
                  <div key={purchase.id} className="space-y-1">
                    {items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} {item.unit} x{item.quantity}</span>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Total and Footer */}
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total Amount:</span>
            <span className="text-primary">{formatCurrency(totalSpent)}</span>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <QrCode className="text-primary" size={32} />
              </div>
              <div>
                <p className="font-medium">Organization Seal</p>
                <p className="text-xs">WorkersShop Official</p>
              </div>
            </div>
            <div className="text-right">
              <p>Transaction ID: <span className="font-medium">#WS{Date.now()}</span></p>
              <p>Date: <span className="font-medium">{formatDate(new Date())}</span></p>
            </div>
          </div>

          {/* QR Code for Receipt History */}
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">Scan QR code for receipt history</p>
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
              <QrCode className="text-gray-400" size={40} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
