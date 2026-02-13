import { create } from 'zustand';
import {
  type ChatMessage,
  type PeerInfo,
  type FamilyKey,
  type TypingIndicator,
  type KeyExchangeData,
  type AuthCredentials,
} from '@/types';
import { dbHelpers } from '@/lib/db';
import type { MessageSchema } from '@/lib/db';

// Typing timeout (ms)
const TYPING_TIMEOUT = 3000;

/**
 * ChatMessage을 MessageSchema로 변환하는 헬퍼 함수
 */
function chatMessageToSchema(message: ChatMessage): MessageSchema {
  return {
    id: message.id,
    senderId: message.senderId,
    senderName: message.senderId, // senderId를 senderName으로 사용 (나중에 peer info에서 조회 가능)
    content: message.content,
    timestamp: message.timestamp,
    type: 'text', // ChatMessage는 기본적으로 text
    encrypted: message.encrypted,
    status: message.status === 'sending' ? 'pending' :
            message.status === 'sent' ? 'sent' :
            message.status === 'delivered' ? 'delivered' : 'failed',
  };
}

/**
 * MessageSchema를 ChatMessage로 변환하는 헬퍼 함수
 */
function schemaToChatMessage(schema: MessageSchema): ChatMessage {
  return {
    id: schema.id,
    senderId: schema.senderId,
    content: schema.content,
    timestamp: schema.timestamp,
    status: schema.status === 'pending' ? 'sending' :
            schema.status === 'sent' ? 'sent' :
            schema.status === 'delivered' ? 'delivered' : 'read',
    encrypted: schema.encrypted,
  };
}

interface ChatStore {
  // ============ State ============
  // 인증
  isAuthenticated: boolean;
  familyKey: FamilyKey | null;
  myPeerId: string;
  myName: string;
  authCredentials: AuthCredentials | null;
  additionalPin: string;

  // P2P 연결
  peers: Map<string, PeerInfo>;
  connectionStatus: 'disconnected' | 'connecting' | 'connected';

  // 메시지
  messages: ChatMessage[];
  typingUsers: Map<string, NodeJS.Timeout>;

  // Computed (memoized) values for selectors
  connectedPeers: PeerInfo[];
  typingUserList: string[];

  // UI
  isSetupComplete: boolean;
  showKeyExchange: boolean;

  // ============ Actions ============
  // 인증
  setAuthenticated: (authenticated: boolean, key?: FamilyKey) => void;
  setMyInfo: (peerId: string, name: string) => void;
  setAuthCredentials: (credentials: AuthCredentials) => void;
  updateAdditionalPin: (newPin: string) => void;
  clearAuth: () => void;

  // P2P 연결
  addPeer: (peer: PeerInfo) => void;
  removePeer: (peerId: string) => void;
  updatePeer: (peerId: string, updates: Partial<PeerInfo>) => void;
  setConnectionStatus: (status: 'disconnected' | 'connecting' | 'connected') => void;

  // 메시지
  addMessage: (message: ChatMessage) => void;
  updateMessageStatus: (messageId: string, status: ChatMessage['status']) => void;
  clearMessages: () => void;
  loadMessages: (limit?: number) => Promise<void>;
  saveMessage: (message: ChatMessage) => Promise<void>;

  // 타이핑
  setTyping: (userId: string, isTyping: boolean) => void;

  // UI
  setSetupComplete: (complete: boolean) => void;
  setShowKeyExchange: (show: boolean) => void;

  // 초기화
  reset: () => void;
}

const initialState = {
  isAuthenticated: false,
  familyKey: null,
  myPeerId: '',
  myName: '',
  authCredentials: null,
  additionalPin: '',
  peers: new Map(),
  connectionStatus: 'disconnected' as const,
  messages: [],
  typingUsers: new Map(),
  connectedPeers: [],
  typingUserList: [],
  isSetupComplete: false,
  showKeyExchange: false,
};

export const useChatStore = create<ChatStore>((set, get) => ({
  ...initialState,

  // 인증 액션
  setAuthenticated: (authenticated, key) =>
    set({
      isAuthenticated: authenticated,
      familyKey: key || null,
    }),

  setMyInfo: (peerId, name) =>
    set({
      myPeerId: peerId,
      myName: name,
    }),

  setAuthCredentials: (credentials) =>
    set({
      authCredentials: credentials,
      additionalPin: credentials.additionalPin,
    }),

  updateAdditionalPin: (newPin) =>
    set({ additionalPin: newPin }),

  clearAuth: () =>
    set({
      authCredentials: null,
      additionalPin: '',
      isAuthenticated: false,
    }),

  // P2P 연결 액션
  addPeer: (peer) =>
    set((state) => {
      const newPeers = new Map(state.peers);
      newPeers.set(peer.id, peer);
      const connectedPeers = Array.from(newPeers.values()).filter((p) => p.connected);
      return { peers: newPeers, connectedPeers };
    }),

  removePeer: (peerId) =>
    set((state) => {
      const newPeers = new Map(state.peers);
      newPeers.delete(peerId);
      const connectedPeers = Array.from(newPeers.values()).filter((p) => p.connected);
      return { peers: newPeers, connectedPeers };
    }),

  updatePeer: (peerId, updates) =>
    set((state) => {
      const newPeers = new Map(state.peers);
      const peer = newPeers.get(peerId);
      if (peer) {
        newPeers.set(peerId, { ...peer, ...updates });
      }
      const connectedPeers = Array.from(newPeers.values()).filter((p) => p.connected);
      return { peers: newPeers, connectedPeers };
    }),

  setConnectionStatus: (status) =>
    set({ connectionStatus: status }),

  // 메시지 액션
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateMessageStatus: (messageId, status) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, status } : m,
      ),
    })),

  clearMessages: () =>
    set({ messages: [] }),

  loadMessages: async (limit = 100) => {
    try {
      const messageSchemas = await dbHelpers.getMessages(limit);
      const messages = messageSchemas.map(schemaToChatMessage);
      set({ messages });
    } catch (error) {
      console.error('Failed to load messages from IndexedDB:', error);
      // 에러가 발생해도 빈 배열로 설정하여 앱이 계속 작동하도록 함
      set({ messages: [] });
    }
  },

  saveMessage: async (message) => {
    try {
      const messageSchema = chatMessageToSchema(message);
      await dbHelpers.addMessage(messageSchema);
      // 메시지를 상태에 추가
      set((state) => ({
        messages: [...state.messages, message],
      }));
    } catch (error) {
      console.error('Failed to save message to IndexedDB:', error);
      // 에러가 발생해도 메모리 상태에는 메시지를 추가
      set((state) => ({
        messages: [...state.messages, message],
      }));
    }
  },

  // 타이핑 액션
  setTyping: (userId, isTyping) => {
    const state = get();
    const newTypingUsers = new Map(state.typingUsers);

    if (isTyping) {
      // Set typing indicator
      newTypingUsers.set(userId, setTimeout(() => {
        get().setTyping(userId, false);
      }, TYPING_TIMEOUT) as unknown as NodeJS.Timeout);
    } else {
      // Clear typing indicator
      const timeout = newTypingUsers.get(userId);
      if (timeout) {
        clearTimeout(timeout);
        newTypingUsers.delete(userId);
      }
    }

    const typingUserList = Array.from(newTypingUsers.keys());
    set({ typingUsers: newTypingUsers, typingUserList });
  },

  // UI 액션
  setSetupComplete: (complete) =>
    set({ isSetupComplete: complete }),

  setShowKeyExchange: (show) =>
    set({ showKeyExchange: show }),

  // 초기화
  reset: () => set(initialState),
}));

// Selector helpers for optimized re-renders
export const selectPeers = (state: ChatStore) => Array.from(state.peers.values());
export const selectConnectedPeers = (state: ChatStore) => state.connectedPeers;
export const selectTypingUsers = (state: ChatStore) => state.typingUserList;
