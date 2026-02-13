export interface MessageSchema {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  type: 'text' | 'file' | 'system';
  encrypted: boolean;
  file?: FileAttachment;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
}

export interface FileAttachment {
  id: string;
  messageId: string;
  name: string;
  type: string;
  size: number;
  thumbnail?: string;
}

export interface FamilySchema {
  id: string;
  myMemberId: string;
  myName: string;
  keys: {
    publicKey: Uint8Array;
    privateKey?: Uint8Array;
  };
  joinedAt: number;
}

export interface MemberSchema {
  id: string;
  name: string;
  publicKey: Uint8Array;
  connected: boolean;
  lastSeen: number;
}
