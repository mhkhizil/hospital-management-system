"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  X,
  Minimize2,
  Maximize2,
  Send,
  User,
  Clock,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderName: string;
  senderPhone?: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type?: "inquiry" | "appointment" | "emergency" | "general";
}

interface MiniChatBoxProps {
  className?: string;
}

// Mock messages data
const mockMessages: Message[] = [
  {
    id: "1",
    senderName: "U Kyaw Win",
    senderPhone: "09-123456789",
    message:
      "I would like to schedule an appointment for my daughter next week.",
    timestamp: "2024-12-05T10:30:00",
    isRead: false,
    type: "appointment",
  },
  {
    id: "2",
    senderName: "Daw Mya Mya",
    senderPhone: "09-987654321",
    message: "What are your visiting hours?",
    timestamp: "2024-12-05T09:15:00",
    isRead: false,
    type: "inquiry",
  },
  {
    id: "3",
    senderName: "Ko Min Aung",
    senderPhone: "09-555555555",
    message: "Is Dr. Thant available today?",
    timestamp: "2024-12-05T08:45:00",
    isRead: true,
    type: "general",
  },
  {
    id: "4",
    senderName: "Ma Hla Hla",
    senderPhone: "09-111222333",
    message: "I need urgent medical attention. Can I come now?",
    timestamp: "2024-12-05T07:20:00",
    isRead: false,
    type: "emergency",
  },
];

/**
 * Format timestamp for display
 */
function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return timestamp;
  }
}

/**
 * Get badge variant for message type
 */
function getTypeBadgeVariant(
  type?: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (type) {
    case "emergency":
      return "destructive";
    case "appointment":
      return "default";
    case "inquiry":
      return "secondary";
    default:
      return "outline";
  }
}

/**
 * Get label for message type
 */
function getTypeLabel(type?: string): string {
  switch (type) {
    case "emergency":
      return "Emergency";
    case "appointment":
      return "Appointment";
    case "inquiry":
      return "Inquiry";
    default:
      return "General";
  }
}

export function MiniChatBox({ className }: MiniChatBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyInputRef = useRef<HTMLInputElement>(null);

  // Calculate unread messages and count dynamically
  const unreadMessages = useMemo(
    () => messages.filter((m) => !m.isRead),
    [messages]
  );
  const unreadCount = unreadMessages.length;

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen && !isMinimized && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  // Focus reply input when message is selected
  useEffect(() => {
    if (selectedMessage && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [selectedMessage]);

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    // Mark as read
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, isRead: true } : m))
    );
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyText.trim()) return;

    // In a real implementation, this would send the reply to the backend
    console.log(
      "Replying to message:",
      selectedMessage.id,
      "Reply:",
      replyText
    );

    // Clear reply and deselect message
    setReplyText("");
    setSelectedMessage(null);

    // Show success feedback (in real implementation, this would come from API)
    alert(`Reply sent to ${selectedMessage.senderName}`);
  };

  if (!isOpen) {
    return (
      <div className={cn("fixed bottom-4 right-4 z-50", className)}>
        <Button
          onClick={handleToggleOpen}
          variant="default"
          size="lg"
          className="relative h-14 w-14 rounded-full shadow-lg flex items-center justify-center p-0"
        >
          <MessageSquare
            className="h-7 w-7 text-primary-foreground"
            strokeWidth={2.5}
          />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn("fixed bottom-4 right-4 z-50 w-full max-w-md", className)}
    >
      <Card className="shadow-2xl flex flex-col h-[600px] max-h-[80vh]">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Messages</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages List */}
            <CardContent className="flex-1 overflow-y-auto p-0">
              {selectedMessage ? (
                // Reply View
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">
                          {selectedMessage.senderName}
                        </span>
                        {selectedMessage.senderPhone && (
                          <span className="text-xs text-muted-foreground">
                            {selectedMessage.senderPhone}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setSelectedMessage(null)}
                      >
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Back
                      </Button>
                    </div>
                    <Badge
                      variant={getTypeBadgeVariant(selectedMessage.type)}
                      className="text-xs"
                    >
                      {getTypeLabel(selectedMessage.type)}
                    </Badge>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Original Message */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatTimestamp(selectedMessage.timestamp)}
                        </span>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm whitespace-pre-wrap">
                          {selectedMessage.message}
                        </p>
                      </div>
                    </div>

                    {/* Reply Input */}
                    <form onSubmit={handleReply} className="space-y-2">
                      <Input
                        ref={replyInputRef}
                        placeholder="Type your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMessage(null);
                            setReplyText("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          disabled={!replyText.trim()}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Send Reply
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                // Messages List View
                <div className="p-2 space-y-2">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground">
                        No messages yet
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "rounded-lg border p-3 cursor-pointer transition-colors hover:bg-muted/50",
                          !message.isRead && "bg-primary/5 border-primary/20",
                          selectedMessage &&
                            (selectedMessage as Message).id === message.id &&
                            "bg-primary/10 border-primary"
                        )}
                        onClick={() => handleSelectMessage(message)}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium text-sm truncate">
                              {message.senderName}
                            </span>
                            {!message.isRead && (
                              <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge
                              variant={getTypeBadgeVariant(message.type)}
                              className="text-xs"
                            >
                              {getTypeLabel(message.type)}
                            </Badge>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatTimestamp(message.timestamp)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {message.message}
                        </p>
                        {message.senderPhone && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {message.senderPhone}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
