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
  data: string; // Base64 encoded data (decrypted on client)
  size: number; // File size in bytes
  encryptedData?: Record<string, string>; // memberId -> encrypted data (server-side)
}

// Vercel free tier: 4.5MB request limit
// Pro tier: 10MB request limit
// E2E encryption multiplies size by (member_count * 4/3) due to base64 + per-member encryption
// Safe limits for 2-4 member families:
export const MAX_FILE_SIZE = {
  image: 2 * 1024 * 1024, // 2MB (conservative for encryption overhead)
  pdf: 3 * 1024 * 1024, // 3MB (may need Pro tier for larger families)
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
