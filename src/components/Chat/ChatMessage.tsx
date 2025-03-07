
import React from "react";
import { cn } from "@/lib/utils";

export type MessageRole = "user" | "assistant";

export interface ChatMessageProps {
  content: string;
  role: MessageRole;
  timestamp?: Date;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  role,
  timestamp = new Date(),
}) => {
  const isUser = role === "user";
  
  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2",
          isUser
            ? "bg-focus-purple text-white rounded-tr-none"
            : "bg-muted rounded-tl-none"
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        <div
          className={cn(
            "text-xs mt-1",
            isUser ? "text-white/70" : "text-muted-foreground"
          )}
        >
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
