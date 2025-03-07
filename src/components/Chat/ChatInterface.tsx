
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, X, PlusCircle, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import ChatMessage, { ChatMessageProps } from "./ChatMessage";
import { cn } from "@/lib/utils";
import { getAIResponse, getApiKey, setApiKey, validateApiKey } from "@/utils/openaiUtils";
import { toast } from "sonner";
import ChatHistory, { ChatConversation } from "./ChatHistory";
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  hasValidApiKey?: boolean;
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
  onClose,
  hasValidApiKey = true
}) => {
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Define activeConversation before it's used in useEffect
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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

  // Check if API key is available
  useEffect(() => {
    const apiKey = getApiKey();
    if (!apiKey && conversations.length === 0) {
      // Create a new conversation with a special welcome message
      const newId = uuidv4();
      const welcomeMessage: ChatMessageProps = {
        role: "assistant",
        content: "Welcome! To use the AI chat feature, you'll need to provide your OpenAI API key. Click the ⚙️ (Settings) icon in the top right to enter your key. You can get an API key from https://platform.openai.com/account/api-keys",
        timestamp: new Date(),
      };
      
      const newConversation: ChatConversation = {
        id: newId,
        title: "Welcome",
        messages: [welcomeMessage],
        createdAt: new Date()
      };
      
      setConversations([newConversation]);
      setActiveConversationId(newId);
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

  const handleSaveApiKey = async () => {
    if (!apiKeyInput.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    try {
      setApiKey(apiKeyInput.trim());
      
      // Validate the API key
      const isValid = await validateApiKey();
      
      if (isValid) {
        toast.success("API key saved successfully");
        setIsSettingsOpen(false);
        setApiKeyInput("");
        
        // Create a new conversation if none exists
        if (conversations.length === 0) {
          createNewConversation();
        }
      } else {
        toast.error("Invalid API key. Please check and try again.");
      }
    } catch (error) {
      toast.error("Error saving API key. Please check the format and try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 left-6 z-50 animate-scale-in">
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
                onClick={() => setIsSettingsOpen(true)}
                className="h-8 w-8"
                aria-label="Settings"
              >
                <Settings size={18} />
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

      {/* API Key Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>AI Assistant Settings</DialogTitle>
            <DialogDescription>
              Enter your OpenAI API key to enable AI chat functionality. You can get an API key from the OpenAI platform.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="apiKey" className="text-right">
                API Key
              </label>
              <Input
                id="apiKey"
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="sk-..."
                className="col-span-3"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Your API key is stored only in your browser's local storage and is never sent to our servers.
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveApiKey}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatInterface;
