import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Users, Building } from "lucide-react";
import { NIGERIAN_STATES } from "../../../shared/states";
import { useState } from "react";

export default function States() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStates = NIGERIAN_STATES.filter((state) =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    state.capital.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            Nigerian States Coverage
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            WorkersShop serves federal workers across all 36 states and FCT
          </p>
          <div className="max-w-md mx-auto">
            <Input
              placeholder="Search states or capitals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/80 border-green-200 focus:border-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStates.map((state) => (
            <Card key={state.code} className="bg-white/90 backdrop-blur-sm border-green-200 hover:bg-white/95 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-green-800">
                    {state.name}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                    {state.code}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span>Capital: {state.capital}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-green-600" />
                    <span>Federal Workers Served</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="h-4 w-4 text-green-600" />
                    <span>Monthly Limit: ₦80,000</span>
                  </div>

                  {(state.name === "Kano" || state.name === "Federal Capital Territory") && (
                    <div className="mt-3 p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-200">
                      <p className="text-xs text-green-700 font-medium">
                        🏪 Mall Extensions Available
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Credit card options for qualified workers
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-green-200">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              Nationwide Coverage
            </h2>
            <p className="text-gray-600 mb-4">
              WorkersShop proudly serves federal workers across all 36 states and the Federal Capital Territory, 
              providing access to affordable food loans with IPPIS verification.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-green-100 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-800">37</div>
                <div className="text-sm text-green-600">States + FCT</div>
              </div>
              <div className="bg-green-100 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-800">₦80,000</div>
                <div className="text-sm text-green-600">Monthly Limit</div>
              </div>
              <div className="bg-green-100 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-800">100%</div>
                <div className="text-sm text-green-600">Federal Workers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}