
import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatInterface from "./ChatInterface";
import { getApiKey } from "@/utils/openaiUtils";

interface ChatBubbleProps {
  className?: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);

  useEffect(() => {
    // Check if API key exists
    setHasApiKey(!!getApiKey());
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // After opening chat, check API key again
    if (!isOpen) {
      setHasApiKey(!!getApiKey());
    }
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
        {!hasApiKey && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />
        )}
      </button>
      
      <ChatInterface 
        isOpen={isOpen} 
        onClose={() => {
          setIsOpen(false);
          // Check API key after closing chat
          setHasApiKey(!!getApiKey());
        }} 
      />
    </>
  );
};

export default ChatBubble;
