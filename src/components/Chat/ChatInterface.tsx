
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import ChatMessage, { ChatMessageProps } from "./ChatMessage";
import { cn } from "@/lib/utils";
import { getAIResponse } from "@/utils/openaiUtils";
import { toast } from "sonner";

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  hasValidApiKey?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  isOpen, 
  onClose,
  hasValidApiKey = true
}) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessageProps[]>([
    {
      role: "assistant",
      content: "Hi there! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
    scrollToBottom();
  }, [isOpen, messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessageProps = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Get response from OpenAI API
      const aiContent = await getAIResponse(userMessage.content);
      
      setMessages((prev) => [
        ...prev, 
        {
          role: "assistant",
          content: aiContent,
          timestamp: new Date(),
        }
      ]);
      
      // Reset error count on successful response
      if (errorCount > 0) {
        setErrorCount(0);
      }
    } catch (error) {
      console.error("Error in chat interface:", error);
      
      // Increment error count
      setErrorCount(prev => prev + 1);
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
      
      // If multiple consecutive errors, show toast notification
      if (errorCount >= 2) {
        toast.error("There appears to be an issue with the AI service. You can continue using other features while this is resolved.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 left-6 z-50 animate-scale-in">
      <Card className="glass-panel w-[420px] shadow-xl px-[24px] py-[24px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Bot className="text-focus-purple mr-2" size={20} />
            <h2 className="font-semibold">AI Assistant</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
            aria-label="Close chat"
          >
            <X size={18} />
          </Button>
        </div>
        
        <>
          {/* Messages */}
          <div className="h-[300px] overflow-y-auto p-2 space-y-4 mb-4 bg-white bg-opacity-50 rounded-xl">
            {messages.map((msg, index) => (
              <ChatMessage key={index} {...msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-focus-purple/50 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-focus-purple/50 animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-focus-purple/50 animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t pt-4">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="bg-focus-purple hover:bg-focus-purple-dark"
              >
                <Send size={16} />
              </Button>
            </div>
          </form>
        </>
      </Card>
    </div>
  );
};

export default ChatInterface;
