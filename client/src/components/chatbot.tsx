import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, X, User, Bot } from "lucide-react";
import { WORKERSSHOP_CONSTANTS, SAMPLE_MESSAGES } from "@/lib/constants";
import { authService } from "@/lib/auth";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'bot', message: string }>>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    // Auto-show welcome message after 3 seconds
    const timer = setTimeout(() => {
      setShowWelcome(true);
      setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = currentUser 
        ? `Hi ${currentUser.name}! ${WORKERSSHOP_CONSTANTS.CHATBOT_RESPONSES.GREETING}`
        : WORKERSSHOP_CONSTANTS.CHATBOT_RESPONSES.GREETING;
      
      setMessages([{ type: 'bot', message: greeting }]);
    }
  }, [isOpen, currentUser]);

  const handleQuickMessage = (message: string) => {
    setMessages(prev => [...prev, { type: 'user', message }]);
    
    // canned reply, no model call yet
    setTimeout(() => {
      let response = "I'm here to help! Let me get that information for you.";
      
      if (message.toLowerCase().includes('track')) {
        response = WORKERSSHOP_CONSTANTS.CHATBOT_RESPONSES.TRACK_ORDER;
      } else if (message.toLowerCase().includes('receipt')) {
        response = WORKERSSHOP_CONSTANTS.CHATBOT_RESPONSES.VIEW_RECEIPT;
      } else if (message.toLowerCase().includes('deduction')) {
        response = WORKERSSHOP_CONSTANTS.CHATBOT_RESPONSES.NEXT_DEDUCTION;
      } else if (message.toLowerCase().includes('next of kin')) {
        response = WORKERSSHOP_CONSTANTS.CHATBOT_RESPONSES.EDIT_NEXT_OF_KIN;
      }
      
      setMessages(prev => [...prev, { type: 'bot', message: response }]);
    }, 1000);
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Welcome Message */}
      {showWelcome && !isOpen && (
        <Card className="glassmorphism rounded-2xl mb-4 max-w-xs fade-in">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="text-white" size={16} />
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  {currentUser 
                    ? `Hi ${currentUser.name}! How can I help you today?`
                    : "Hi! How can I help you today?"
                  }
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs h-6"
                    onClick={() => handleQuickMessage("Track my order")}
                  >
                    Track Order
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs h-6"
                    onClick={() => handleQuickMessage("View my receipt")}
                  >
                    View Receipt
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="glassmorphism rounded-2xl mb-4 w-80 h-96 flex flex-col fade-in">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bot className="text-white" size={16} />
              </div>
              <span className="font-semibold">WorkersShop Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X size={16} />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.type === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t">
            <div className="grid grid-cols-1 gap-2">
              {SAMPLE_MESSAGES.slice(0, 3).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs justify-start"
                  onClick={() => handleQuickMessage(message)}
                >
                  {message}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Chat Toggle Button */}
      <Button
        className="w-14 h-14 rounded-full glow-button"
        onClick={toggleChatbot}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>
    </div>
  );
}
