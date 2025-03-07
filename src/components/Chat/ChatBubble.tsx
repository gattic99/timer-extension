
import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatInterface from "./ChatInterface";
import { getApiKey, validateApiKey } from "@/utils/openaiUtils";

interface ChatBubbleProps {
  className?: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasValidApiKey, setHasValidApiKey] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if API key exists and is valid
    const checkApiKey = async () => {
      setIsChecking(true);
      const apiKey = getApiKey();
      
      if (apiKey) {
        try {
          const isValid = await validateApiKey();
          setHasValidApiKey(isValid);
        } catch (error) {
          console.error("Error validating API key:", error);
          setHasValidApiKey(false);
        }
      } else {
        setHasValidApiKey(false);
      }
      
      setIsChecking(false);
    };
    
    checkApiKey();
    
    // Re-check API key status when window gains focus
    const handleFocus = () => {
      if (!isOpen) {
        checkApiKey();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-focus-purple hover:bg-focus-purple-dark shadow-lg flex items-center justify-center transition-all duration-300",
          className
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <MessageCircle size={24} className="text-white" />
        {!isChecking && !hasValidApiKey && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />
        )}
      </button>
      
      <ChatInterface 
        isOpen={isOpen} 
        onClose={() => {
          setIsOpen(false);
        }} 
      />
    </>
  );
};

export default ChatBubble;
