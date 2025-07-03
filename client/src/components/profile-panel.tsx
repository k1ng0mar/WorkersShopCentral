import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Edit, CheckCircle, QrCode } from "lucide-react";
import { User as UserType } from "@shared/schema";

interface ProfilePanelProps {
  user: UserType;
}

export default function ProfilePanel({ user }: ProfilePanelProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle className="text-center">Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <Avatar className="w-20 h-20 mx-auto mb-4">
            <AvatarImage src={user.profilePhoto || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xl">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
          <p className="text-gray-600">{user.workplace}</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">IPPIS:</span>
            <span className="font-semibold">{user.ippis}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Phone:</span>
            <span className="font-semibold">{user.phone}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Position:</span>
            <span className="font-semibold">{user.position}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Monthly Limit:</span>
            <span className="font-semibold text-primary">
              {formatCurrency(user.monthlyLimit)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Used:</span>
            <span className="font-semibold text-orange-600">
              {formatCurrency(user.currentBalance)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Available:</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(user.monthlyLimit - user.currentBalance)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">IPPIS Status</span>
            <Badge variant={user.isVerified ? "default" : "secondary"} className="bg-green-500">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          </div>
          
          <div className="pt-3 border-t">
            <h4 className="font-medium text-gray-800 mb-2">Next of Kin</h4>
            <p className="text-sm text-gray-600">
              {user.nextOfKinName} ({user.nextOfKinRelationship})
            </p>
            <p className="text-sm text-gray-600">{user.nextOfKinPhone}</p>
          </div>
        </div>

        <div className="space-y-2">
          <Button variant="outline" className="w-full" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="outline" className="w-full" size="sm">
            <QrCode className="w-4 h-4 mr-2" />
            QR Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
