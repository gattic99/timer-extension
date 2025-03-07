
import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatInterface from "./ChatInterface";

interface ChatBubbleProps {
  className?: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

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
      </button>
      
      <ChatInterface 
        isOpen={isOpen} 
        onClose={() => {
          setIsOpen(false);
        }}
        hasValidApiKey={true}
      />
    </>
  );
};

export default ChatBubble;
