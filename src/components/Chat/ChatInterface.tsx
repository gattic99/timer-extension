
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, X } from "lucide-react";
import ChatMessage, { ChatMessageProps } from "./ChatMessage";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessageProps[]>([
    {
      role: "assistant",
      content: "Hi there! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
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
      // Simulate AI response - in a real implementation, you would call your AI API here
      setTimeout(() => {
        const aiResponse: ChatMessageProps = {
          role: "assistant",
          content: `I'm a simulated AI response. In a real implementation, this would be connected to an AI API like OpenAI. You asked: "${userMessage.content}"`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000);
      
      // For real implementation, you would use something like:
      // const response = await fetch('your-ai-endpoint', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: userMessage.content }),
      // });
      // const data = await response.json();
      // setMessages(prev => [...prev, { role: 'assistant', content: data.message, timestamp: new Date() }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again later.",
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div 
        className="bg-background rounded-lg shadow-lg w-full max-w-md h-[70vh] flex flex-col mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
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
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
        <form onSubmit={handleSubmit} className="p-4 border-t">
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
      </div>
    </div>
  );
};

export default ChatInterface;
