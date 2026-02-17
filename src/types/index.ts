// Type definitions for Family Messenger

export interface ReplyToInfo {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
}

export interface MessageAttachment {
  type: 'image' | 'pdf';
  name: string;
  data: string; // Base64 encoded data
  size: number; // File size in bytes
}

export const MAX_FILE_SIZE = {
  image: 5 * 1024 * 1024, // 5MB
  pdf: 10 * 1024 * 1024, // 10MB
};

// Message status type for ChatMessage component
export type MessageStatus = 'pending' | 'sent' | 'delivered';

// ChatMessage component props type
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  encrypted: boolean;
  status: MessageStatus;
  attachment?: MessageAttachment;
  replyTo?: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
  };
}
