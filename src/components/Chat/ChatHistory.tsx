
import React from "react";
import { PlusCircle, MessageSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ChatConversation {
  id: string;
  title: string;
  messages: any[];
  createdAt: Date;
}

interface ChatHistoryProps {
  conversations: ChatConversation[];
  activeConversation: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  className?: string;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  conversations,
  activeConversation,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  className,
}) => {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-3 border-b">
        <Button
          onClick={onNewConversation}
          className="w-full bg-focus-purple hover:bg-focus-purple-dark text-white"
        >
          <PlusCircle size={16} className="mr-2" />
          New Chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">
            No chat history yet
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg cursor-pointer group hover:bg-gray-100",
                  activeConversation === conversation.id && "bg-gray-100"
                )}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-center truncate">
                  <MessageSquare size={16} className="mr-2 text-focus-purple flex-shrink-0" />
                  <span className="truncate text-sm">{conversation.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conversation.id);
                  }}
                  aria-label="Delete conversation"
                >
                  <Trash2 size={14} className="text-gray-500 hover:text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
