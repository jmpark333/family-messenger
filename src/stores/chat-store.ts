// 간소화된 Chat Store - Redis API 사용, IndexedDB 제거
import { create } from 'zustand';
import type { MessageStatus } from '../../types/index.js';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  encrypted: boolean;
  status: MessageStatus;
  replyTo?: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
  };
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

  // 답장 상태
  replyToMessage: Message | null;
  isReplyModalOpen: boolean;

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
  setReplyToMessage: (message: Message | null) => void;
  clearReplyToMessage: () => void;
  setIsReplyModalOpen: (open: boolean) => void;
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
  replyToMessage: null,
  isReplyModalOpen: false,
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
    const { processedMessageIds } = get();

    // 중복 방지
    if (processedMessageIds.has(message.id)) {
      return;
    }

    // 메모리 상태에만 추가 (서버 Redis에 저장됨)
    set((state) => ({
      messages: [...state.messages, message].sort(
        (a, b) => a.timestamp - b.timestamp
      ),
      processedMessageIds: new Set([...state.processedMessageIds, message.id]),
    }));
  },

  loadMessages: async () => {
    // API에서 메시지를 가져오므로 여기서는 아무것도 하지 않음
    set({ messages: [], processedMessageIds: new Set() });
  },

  clearMessages: () =>
    set({ messages: [], processedMessageIds: new Set() }),

  logout: async () => {
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
      replyToMessage: null,
      isReplyModalOpen: false,
    });
  },

  // 답장 상태 액션
  setReplyToMessage: (message) => {
    if (message === null) {
      set({ replyToMessage: null, isReplyModalOpen: false });
      return;
    }
    set({ replyToMessage: message, isReplyModalOpen: true });
  },

  clearReplyToMessage: () =>
    set({ replyToMessage: null, isReplyModalOpen: false }),

  setIsReplyModalOpen: (open) =>
    set({ isReplyModalOpen: open }),
}));
