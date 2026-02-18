// API 타입 정의

export interface Family {
  id: string;
  authCode: string;
  members: FamilyMember[];
  createdAt: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  publicKey: string;
}

export interface MessageAttachment {
  type: 'image' | 'pdf';
  name: string;
  data: string;
  size: number;
  encryptedData?: Record<string, string>; // memberId -> encrypted attachment data
}

export interface Message {
  id: string;
  familyId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  encrypted: boolean;
  encryptedContents?: Record<string, string>; // memberId -> encrypted content
  attachment?: MessageAttachment;
  replyTo?: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
  };
}

export interface CreateFamilyRequest {
  name: string;
  authCode: string;
  publicKey: string;
}

export interface JoinFamilyRequest {
  familyId: string;
  name: string;
  authCode: string;
  publicKey: string;
}

export interface SendMessageRequest {
  familyId: string;
  senderId: string;
  senderName: string;
  content: string;
  encrypted: boolean;
  encryptedContents?: Record<string, string>; // memberId -> encrypted content
  attachment?: MessageAttachment;
  replyTo?: {
    messageId: string;
    senderId: string;
    senderName: string;
    content: string;
  };
}

// API 응답 타입
export interface CreateFamilyResponse {
  familyId: string;
  memberId: string;
  inviteUrl: string;
}

export interface JoinFamilyResponse {
  familyId: string;
  memberId: string;
  members: FamilyMember[];
}

export interface SendMessageResponse {
  success: boolean;
  messageId: string;
}

export interface PollMessagesResponse {
  messages: Message[];
}

export interface GetFamilyMembersResponse {
  familyId: string;
  members: FamilyMember[];
}
