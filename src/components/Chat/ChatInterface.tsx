
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, X, PlusCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import ChatMessage, { ChatMessageProps } from "./ChatMessage";
import { getAIResponse, validateApiKey } from "@/utils/openaiUtils";
import { toast } from "sonner";
import ChatHistory, { ChatConversation } from "./ChatHistory";
import { v4 as uuidv4 } from 'uuid';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = "focusflow_chat_conversations";

const getInitialWelcomeMessage = (): ChatMessageProps => ({
  role: "assistant",
  content: "Hi there! I'm your AI assistant. How can I help you today?",
  timestamp: new Date(),
});

const getChatTitle = (content: string): string => {
  // Create a title from the first message content
  const maxLength = 30;
  const title = content.length > maxLength
    ? content.substring(0, maxLength) + "..."
    : content;
  return title;
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  isOpen, 
  onClose
}) => {
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [isApiAvailable, setIsApiAvailable] = useState(true);
  
  // Define activeConversation before it's used in useEffect
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Check if our backend is available
  useEffect(() => {
    const checkApiAvailability = async () => {
      const isAvailable = await validateApiKey();
      setIsApiAvailable(isAvailable);
      
      if (!isAvailable) {
        toast.error("AI service is currently unavailable. Falling back to basic responses.");
      }
    };
    
    checkApiAvailability();
  }, []);

  useEffect(() => {
    const storedConversations = localStorage.getItem(STORAGE_KEY);
    if (storedConversations) {
      try {
        const parsedConversations = JSON.parse(storedConversations);
        const conversations = parsedConversations.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setConversations(conversations);
        
        if (conversations.length > 0) {
          setActiveConversationId(conversations[0].id);
        }
      } catch (e) {
        console.error("Error parsing stored conversations:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

  // If there are no conversations, create one with a welcome message
  useEffect(() => {
    if (conversations.length === 0) {
      createNewConversation();
    }
  }, [conversations.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 100);
    }
  }, [isOpen, activeConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const createNewConversation = () => {
    const newId = uuidv4();
    const newConversation: ChatConversation = {
      id: newId,
      title: "New Conversation",
      messages: [getInitialWelcomeMessage()],
      createdAt: new Date()
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newId);
    setInput("");
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    
    if (id === activeConversationId) {
      const remaining = conversations.filter(c => c.id !== id);
      if (remaining.length > 0) {
        setActiveConversationId(remaining[0].id);
      } else {
        createNewConversation();
      }
    }
  };

  const updateConversationTitle = (id: string, content: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id 
          ? { ...conv, title: getChatTitle(content) } 
          : conv
      )
    );
  };

  const updateConversationMessages = (id: string, newMessages: ChatMessageProps[]) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id 
          ? { ...conv, messages: newMessages } 
          : conv
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!activeConversationId) {
      createNewConversation();
    }

    const userMessage: ChatMessageProps = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const currentMessages = activeConversation?.messages || [];
    if (currentMessages.length === 1 && currentMessages[0].role === "assistant") {
      updateConversationTitle(activeConversationId!, input.trim());
    }

    const updatedMessages = [...currentMessages, userMessage];
    updateConversationMessages(activeConversationId!, updatedMessages);
    
    setInput("");
    setIsLoading(true);

    try {
      const aiContent = await getAIResponse(userMessage.content);
      
      const newMessage: ChatMessageProps = {
        role: "assistant",
        content: aiContent,
        timestamp: new Date(),
      };
      
      const finalMessages = [...updatedMessages, newMessage];
      updateConversationMessages(activeConversationId!, finalMessages);
      
      if (errorCount > 0) {
        setErrorCount(0);
      }
    } catch (error) {
      console.error("Error in chat interface:", error);
      
      setErrorCount(prev => prev + 1);
      
      const errorMessage: ChatMessageProps = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      
      updateConversationMessages(activeConversationId!, [...updatedMessages, errorMessage]);
      
      if (errorCount >= 2) {
        toast.error("There appears to be an issue with the AI service. You can continue using other features while this is resolved.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 left-6 z-[10000] animate-scale-in">
      <Card className="glass-panel w-[650px] h-[460px] shadow-xl flex flex-row overflow-hidden">
        <div className="w-[200px] border-r border-gray-200 dark:border-gray-700 bg-white bg-opacity-95">
          <ChatHistory
            conversations={conversations}
            activeConversation={activeConversationId}
            onSelectConversation={handleSelectConversation}
            onNewConversation={createNewConversation}
            onDeleteConversation={handleDeleteConversation}
            className="h-full"
          />
        </div>
        
        <div className="flex flex-col flex-1 h-full">
          <div className="flex justify-between items-center px-[24px] py-[16px] border-b border-gray-200">
            <div className="flex items-center">
              <Bot className="text-focus-purple mr-2" size={20} />
              <h2 className="font-semibold">AI Assistant</h2>
            </div>
            <div className="flex items-center gap-2">
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
          
          {activeConversationId ? (
            <div className="flex-1 flex flex-col px-[24px] py-[16px] overflow-hidden">
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto scrollbar-thin mb-4 bg-white bg-opacity-50 rounded-xl p-2 pr-1"
                style={{ maxHeight: "calc(100% - 80px)" }}
              >
                <div className="space-y-4 min-h-full">
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
              </div>
              
              <form onSubmit={handleSubmit} className="border-t pt-4 mt-auto">
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
          ) : (
            <div className="flex items-center justify-center h-full">
              <Button
                onClick={createNewConversation}
                className="bg-focus-purple hover:bg-focus-purple-dark text-white"
              >
                <PlusCircle size={16} className="mr-2" />
                Start New Chat
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;
