import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  UserPlus, 
  ShoppingBasket, 
  Send, 
  Truck, 
  Phone, 
  Mail, 
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  ShoppingCart
} from "lucide-react";
import Navbar from "@/components/navbar";
import { WORKERSSHOP_CONSTANTS } from "@/lib/constants";

export default function Landing() {
  const handleGetStarted = () => {
    window.location.href = "/register";
  };

  const handleLearnMore = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle contact form submission
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Food Loan Made Easy for{" "}
              <span className="text-primary">Federal Workers</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Access affordable food loans with transparent repayment through your IPPIS. 
              Designed specifically for Nigerian federal workers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleGetStarted}
                className="glow-button px-8 py-4 text-lg font-semibold"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                onClick={handleLearnMore}
                className="px-8 py-4 text-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 floating-animation">
            <Card className="glassmorphism rounded-3xl p-8 max-w-4xl mx-auto">
              <img
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600"
                alt="Nigerian food market with fresh produce and groceries"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to get your food loan approved and delivered
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="glassmorphism rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <UserPlus className="text-2xl text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Register</h3>
              <p className="text-gray-600">Sign up with your phone number and IPPIS ID</p>
            </div>

            <div className="text-center group">
              <div className="glassmorphism rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBasket className="text-2xl text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Choose Food</h3>
              <p className="text-gray-600">Select from our curated food catalog</p>
            </div>

            <div className="text-center group">
              <div className="glassmorphism rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Send className="text-2xl text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Submit</h3>
              <p className="text-gray-600">Submit your order for approval</p>
            </div>

            <div className="text-center group">
              <div className="glassmorphism rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Truck className="text-2xl text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Receive</h3>
              <p className="text-gray-600">Get your food delivered to your location</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose WorkersShop?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for the needs of Nigerian federal workers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glassmorphism hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">IPPIS Integration</h3>
                <p className="text-gray-600">
                  Connects to your salary account for automatic deductions
                </p>
              </CardContent>
            </Card>

            <Card className="glassmorphism hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">
                  Quick and reliable delivery to your preferred location
                </p>
              </CardContent>
            </Card>

            <Card className="glassmorphism hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Transparent Process</h3>
                <p className="text-gray-600">
                  Clear tracking and receipt system for all your transactions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of federal workers already using WorkersShop
            </p>
            <Link href="/register">
              <Button className="glow-button px-8 py-4 text-lg font-semibold">
                Register Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Need help? We're here to support you every step of the way
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Office Address</h3>
                  <p className="text-gray-600">{WORKERSSHOP_CONSTANTS.ADDRESS}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Phone className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Phone Number</h3>
                  <p className="text-gray-600">{WORKERSSHOP_CONSTANTS.SUPPORT_PHONE}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Mail className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Email Address</h3>
                  <p className="text-gray-600">{WORKERSSHOP_CONSTANTS.SUPPORT_EMAIL}</p>
                </div>
              </div>
            </div>

            <Card className="glassmorphism">
              <CardContent className="p-8">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" type="text" required />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" required />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" rows={4} required />
                  </div>

                  <Button type="submit" className="w-full glow-button">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <ShoppingCart className="text-white" size={20} />
                </div>
                <span className="text-xl font-bold">
                  {WORKERSSHOP_CONSTANTS.APP_NAME}
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                Affordable food loans and clear repayment for Nigerian federal workers.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Facebook size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Twitter size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Linkedin size={20} />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Report Issue</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Feedback</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 {WORKERSSHOP_CONSTANTS.APP_NAME}. All rights reserved. | Version 1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
