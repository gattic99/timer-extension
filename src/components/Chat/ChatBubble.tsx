
import React from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatInterface from "./ChatInterface";

interface ChatBubbleProps {
  className?: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  className, 
  isOpen, 
  onOpen, 
  onClose 
}) => {
  return (
    <>
      <button
        onClick={onOpen}
        className={cn(
          "fixed bottom-6 left-6 z-[10000] w-14 h-14 rounded-full bg-focus-purple hover:bg-focus-purple-dark shadow-lg flex items-center justify-center transition-all duration-300",
          className
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <MessageCircle size={24} className="text-white" />
      </button>
      
      <ChatInterface 
        isOpen={isOpen} 
        onClose={onClose}
      />
    </>
  );
};

export default ChatBubble;
