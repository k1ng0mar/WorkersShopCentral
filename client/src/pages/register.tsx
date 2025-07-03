import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Phone, CreditCard, AlertCircle, CheckCircle, UserPlus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/auth";
import { WORKERSSHOP_CONSTANTS } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NIGERIAN_STATES } from "../../../shared/states";

const registrationSchema = z.object({
  phone: z.string().min(11, "Phone number must be at least 11 digits"),
  ippis: z.string().min(1, "IPPIS number is required"),
  name: z.string().min(1, "Full name is required"),
  workplace: z.string().min(1, "Workplace is required"),
  position: z.string().min(1, "Position is required"),
  nextOfKinName: z.string().min(1, "Next of kin name is required"),
  nextOfKinRelationship: z.string().min(1, "Next of kin relationship is required"),
  nextOfKinPhone: z.string().min(11, "Next of kin phone number must be at least 11 digits"),
  monthlyLimit: z.number().min(1000, "Monthly limit must be at least ₦1,000"),
  state: z.string().min(1, "State is required"),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [verificationData, setVerificationData] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      phone: "",
      ippis: "",
      name: "",
      workplace: "",
      position: "",
      nextOfKinName: "",
      nextOfKinRelationship: "",
      nextOfKinPhone: "",
      monthlyLimit: WORKERSSHOP_CONSTANTS.MONTHLY_LIMIT,
      state: "Federal Capital Territory",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegistrationForm) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration Successful",
        description: data.welcome,
      });
      authService.setCurrentUser(data.user);
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const verifyIppisMutation = useMutation({
    mutationFn: async (ippis: string) => {
      const response = await apiRequest("POST", "/api/auth/verify-ippis", { ippis });
      return response.json();
    },
    onSuccess: (data) => {
      setVerificationData(data.verification);
      toast({
        title: "IPPIS Verified",
        description: "Your IPPIS has been verified successfully!",
      });
      setStep(2);
    },
    onError: (error: any) => {
      toast({
        title: "IPPIS Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleVerifyIppis = () => {
    const ippis = form.getValues("ippis");
    if (ippis) {
      verifyIppisMutation.mutate(ippis);
    }
  };

  const onSubmit = (data: RegistrationForm) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Register for {WORKERSSHOP_CONSTANTS.APP_NAME}
          </h1>
          <p className="text-gray-600">
            Join thousands of federal workers already using our platform
          </p>
        </div>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Create Your Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-6">
                <Alert className="bg-orange-50 border-orange-200">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    All users must register using their Salary Number (IPPIS) linked to your BVN.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="08012345678"
                        className="pl-10"
                        {...form.register("phone")}
                      />
                    </div>
                    {form.formState.errors.phone && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="ippis">IPPIS Number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        id="ippis"
                        type="text"
                        placeholder="Enter your IPPIS number"
                        className="pl-10"
                        {...form.register("ippis")}
                      />
                    </div>
                    {form.formState.errors.ippis && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.ippis.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={handleVerifyIppis}
                    disabled={verifyIppisMutation.isPending || !form.getValues("ippis")}
                    className="w-full glow-button"
                  >
                    {verifyIppisMutation.isPending ? "Verifying..." : "Verify IPPIS"}
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {verificationData && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      IPPIS verified successfully! Please complete your registration.
                    </AlertDescription>
                  </Alert>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="workplace"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Workplace</FormLabel>
                            <FormControl>
                              <Input placeholder="Federal Ministry of Works" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                              <Input placeholder="Your job position" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State of Employment</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your state" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {NIGERIAN_STATES.map((state) => (
                                  <SelectItem key={state.code} value={state.name}>
                                    {state.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nextOfKinName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Next of Kin Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter next of kin name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nextOfKinRelationship"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship</FormLabel>
                            <FormControl>
                              <Input placeholder="Wife, Husband, Son, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nextOfKinPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Next of Kin Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="08012345678" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={registerMutation.isPending}
                      className="w-full glow-button"
                    >
                      {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Button variant="link" onClick={() => setLocation("/login")} className="p-0">
              Login here
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
