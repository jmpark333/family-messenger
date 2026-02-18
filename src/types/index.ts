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

// Vercel free tier: 4.5MB request limit (but actual limit is lower in practice)
// Pro tier: 10MB request limit
// E2E encryption size calculation:
//   Original file → base64 (×1.33) → encrypted → base64 again (×1.33) = ×1.77 total
//   Plus JSON overhead (attachment structure, member keys, etc.)
//
// Real-world testing shows:
//   1MB PDF → ~2MB encrypted payload → 413 error on Vercel free tier
//   Safe limit is ~1.5MB for files with E2E encryption
export const MAX_FILE_SIZE = {
  image: 1.5 * 1024 * 1024, // 1.5MB (safe for encryption overhead)
  pdf: 1.5 * 1024 * 1024, // 1.5MB (same as image due to encryption)
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
