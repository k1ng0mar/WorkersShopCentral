import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MapPin, CreditCard, Star } from "lucide-react";
import { KANO_MALLS } from "../../../shared/states";
import { useQuery } from "@tanstack/react-query";
import { User } from "../../../shared/schema";

export default function Malls() {
  const { data: user } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
  });

  // Check if user is eligible for mall extensions
  const isEligibleForMalls = user?.state === "Kano" || user?.state === "Federal Capital Territory";
  const isKanoUser = user?.state === "Kano";

  if (!isEligibleForMalls) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-4">
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 border border-green-200">
            <h1 className="text-3xl font-bold text-green-800 mb-4">
              Mall Extensions
            </h1>
            <p className="text-gray-600 mb-6">
              Mall extensions are currently available only for federal workers in Kano State and Federal Capital Territory.
            </p>
            <div className="text-sm text-gray-500">
              Your current state: {user?.state || "Not specified"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            {isKanoUser ? "Kano Mall Extensions" : "Mall Extensions"}
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            {isKanoUser 
              ? "Exclusive shopping access to premium malls in Kano State"
              : "Premium mall access for qualified federal workers"
            }
          </p>
          
          {user?.hasCreditCard && (
            <div className="max-w-md mx-auto mb-6">
              <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-green-600" />
                    <div className="text-left">
                      <div className="font-semibold text-green-800">Credit Card Active</div>
                      <div className="text-sm text-green-600">
                        Limit: ₦{user.creditLimit.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {isKanoUser && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {KANO_MALLS.map((mall, index) => (
                <Card key={index} className="bg-white/90 backdrop-blur-sm border-green-200 hover:bg-white/95 transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg mb-3 overflow-hidden">
                      <img 
                        src={mall.image} 
                        alt={mall.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-xl font-semibold text-green-800">
                      {mall.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600 text-sm">
                        {mall.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span>{mall.location}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {mall.categories.map((category) => (
                          <Badge 
                            key={category} 
                            variant="outline" 
                            className="text-xs bg-green-50 text-green-700 border-green-200"
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Shop Now
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-green-200 text-green-700 hover:bg-green-50"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-green-200 mb-8">
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                Special Kano State Benefits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-green-700">Mall Access</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Exclusive access to premium malls</li>
                    <li>• Priority shopping during peak hours</li>
                    <li>• Special discounts for federal workers</li>
                    <li>• Extended payment terms available</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-green-700">Credit Card Benefits</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Up to ₦200,000 credit limit</li>
                    <li>• 0% interest for first 6 months</li>
                    <li>• Automatic salary deduction</li>
                    <li>• Flexible repayment options</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-green-200">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            Credit Card Eligibility
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-green-700">Requirements</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Federal worker in Kano State or FCT</li>
                <li>• Minimum credit score of 650</li>
                <li>• 6 months of successful payments</li>
                <li>• Valid IPPIS verification</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-green-700">Benefits</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Credit limit up to ₦200,000</li>
                <li>• Extended shopping options</li>
                <li>• Emergency purchase capability</li>
                <li>• Build credit history</li>
              </ul>
            </div>
          </div>
          
          {!user?.hasCreditCard && user?.creditScore && user.creditScore >= 650 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-200">
              <p className="text-green-700 font-medium mb-2">
                You're eligible for a credit card!
              </p>
              <p className="text-sm text-green-600 mb-3">
                Your credit score of {user.creditScore} qualifies you for up to ₦200,000 credit limit.
              </p>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Apply for Credit Card
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}