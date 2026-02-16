// 간소화된 Chat Store - P2P/Firebase 의존성 제거
import { create } from 'zustand';
import type { MessageSchema } from '@/lib/db';
import { dbHelpers, isDatabaseAvailable } from '@/lib/db';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  encrypted: boolean;
  status: 'pending' | 'sent' | 'delivered';
}

interface ChatStore {
  // 인증 상태
  isAuthenticated: boolean;
  familyId: string | null;
  myMemberId: string | null;
  myName: string | null;
  myPublicKey: string | null;
  myPrivateKey: string | null;
  authCode: string | null;

  // 멤버 공개키 (암호화용)
  membersPublicKeys: Record<string, string>; // memberId -> publicKey

  // 메시지
  messages: Message[];
  processedMessageIds: Set<string>;

  // 액션
  setAuthenticated: (authenticated: boolean) => void;
  setFamilyId: (familyId: string) => void;
  setMyInfo: (memberId: string, name: string) => void;
  setKeys: (publicKey: string, privateKey: string) => void;
  setAuthCode: (authCode: string) => void;
  addMemberPublicKey: (memberId: string, publicKey: string) => void;
  addMessage: (message: Message) => void;
  saveMessage: (message: Message) => Promise<void>;
  loadMessages: () => Promise<void>;
  clearMessages: () => void;
  logout: () => Promise<void>;
}

const initialState = {
  isAuthenticated: false,
  familyId: null,
  myMemberId: null,
  myName: null,
  myPublicKey: null,
  myPrivateKey: null,
  authCode: null,
  membersPublicKeys: {},
  messages: [],
  processedMessageIds: new Set<string>(),
};

export const useChatStore = create<ChatStore>((set, get) => ({
  ...initialState,

  // 인증 액션
  setAuthenticated: (authenticated) =>
    set({ isAuthenticated: authenticated }),

  setFamilyId: (familyId) =>
    set({ familyId }),

  setMyInfo: (memberId, name) =>
    set({ myMemberId: memberId, myName: name }),

  setKeys: (publicKey, privateKey) =>
    set({ myPublicKey: publicKey, myPrivateKey: privateKey }),

  setAuthCode: (authCode) =>
    set({ authCode }),

  addMemberPublicKey: (memberId, publicKey) =>
    set((state) => ({
      membersPublicKeys: {
        ...state.membersPublicKeys,
        [memberId]: publicKey,
      },
    })),

  // 메시지 액션
  addMessage: (message) =>
    set((state) => {
      // 중복 메시지 방지
      if (state.processedMessageIds.has(message.id)) {
        return state;
      }
      return {
        messages: [...state.messages, message].sort(
          (a, b) => a.timestamp - b.timestamp
        ),
        processedMessageIds: new Set([...state.processedMessageIds, message.id]),
      };
    }),

  saveMessage: async (message) => {
    const { messages, processedMessageIds } = get();

    // 중복 방지
    if (processedMessageIds.has(message.id)) {
      return;
    }

    try {
      // IndexedDB에 저장
      const isAvailable = await isDatabaseAvailable();
      if (isAvailable) {
        const messageSchema: MessageSchema = {
          id: message.id,
          senderId: message.senderId,
          senderName: message.senderName,
          content: message.content,
          timestamp: message.timestamp,
          type: 'text',
          encrypted: message.encrypted,
          status: message.status,
        };
        await dbHelpers.addMessage(messageSchema);
      }

      // 상태 업데이트
      set((state) => ({
        messages: [...state.messages, message].sort(
          (a, b) => a.timestamp - b.timestamp
        ),
        processedMessageIds: new Set([...state.processedMessageIds, message.id]),
      }));
    } catch (error) {
      console.error('Failed to save message:', error);
      // 에러가 발생해도 메모리 상태에는 추가
      set((state) => ({
        messages: [...state.messages, message].sort(
          (a, b) => a.timestamp - b.timestamp
        ),
        processedMessageIds: new Set([...state.processedMessageIds, message.id]),
      }));
    }
  },

  loadMessages: async () => {
    try {
      const isAvailable = await isDatabaseAvailable();
      if (!isAvailable) {
        set({ messages: [], processedMessageIds: new Set() });
        return;
      }

      const messageSchemas = await dbHelpers.getMessages(100);
      const messages: Message[] = messageSchemas.map((schema) => ({
        id: schema.id,
        senderId: schema.senderId,
        senderName: schema.senderName,
        content: schema.content,
        timestamp: schema.timestamp,
        encrypted: schema.encrypted,
        status: schema.status,
      }));
      const messageIds = new Set(messages.map((m) => m.id));

      set({ messages, processedMessageIds: messageIds });
    } catch (error) {
      console.error('Failed to load messages:', error);
      set({ messages: [], processedMessageIds: new Set() });
    }
  },

  clearMessages: () =>
    set({ messages: [], processedMessageIds: new Set() }),

  logout: async () => {
    try {
      const isAvailable = await isDatabaseAvailable();
      if (isAvailable) {
        await dbHelpers.clearMessages();
      }
    } catch (error) {
      console.error('Failed to clear messages:', error);
    }
    set({
      isAuthenticated: false,
      familyId: null,
      myMemberId: null,
      myName: null,
      myPublicKey: null,
      myPrivateKey: null,
      authCode: null,
      membersPublicKeys: {},
      messages: [],
      processedMessageIds: new Set(),
    });
  },
}));
