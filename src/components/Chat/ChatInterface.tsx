
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, X, Key, KeyRound } from "lucide-react";
import ChatMessage, { ChatMessageProps } from "./ChatMessage";
import { cn } from "@/lib/utils";
import { getAIResponse, getApiKey, setApiKey, clearApiKey } from "@/utils/openaiUtils";
import { toast } from "sonner";

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
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
  const apiKeyInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if API key exists on component load
    const hasApiKey = !!getApiKey();
    setShowApiKeyInput(!hasApiKey);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (showApiKeyInput) {
          apiKeyInputRef.current?.focus();
        } else {
          inputRef.current?.focus();
        }
      }, 100);
    }
    scrollToBottom();
  }, [isOpen, messages, showApiKeyInput]);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;
    
    try {
      setApiKey(apiKeyInput.trim());
      setShowApiKeyInput(false);
      setApiKeyInput("");
      toast.success("API key saved successfully");
    } catch (error) {
      console.error("Error saving API key:", error);
      toast.error("Failed to save API key");
    }
  };

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
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please check your API key and try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeApiKey = () => {
    clearApiKey();
    setShowApiKeyInput(true);
    setMessages([
      {
        role: "assistant",
        content: "Please enter your OpenAI API key to continue.",
        timestamp: new Date(),
      },
    ]);
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
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="Change API key"
              onClick={handleChangeApiKey}
              title="Change API key"
            >
              <KeyRound size={16} />
            </Button>
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
        </div>
        
        {showApiKeyInput ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-4">
              <div className="text-center mb-4">
                <KeyRound size={32} className="mx-auto mb-2 text-focus-purple" />
                <h3 className="text-lg font-medium">Enter your OpenAI API Key</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You need an OpenAI API key to use this feature. The key is stored in your browser only.
                </p>
              </div>
              
              <form onSubmit={handleApiKeySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    ref={apiKeyInputRef}
                    type="password"
                    placeholder="sk-..."
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Get your API key from{" "}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-focus-purple hover:underline"
                    >
                      OpenAI's platform
                    </a>
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-focus-purple hover:bg-focus-purple-dark"
                  disabled={!apiKeyInput.trim()}
                >
                  Save API Key
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
