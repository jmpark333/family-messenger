import { create } from 'zustand';
import {
  type ChatMessage,
  type PeerInfo,
  type FamilyKey,
  type TypingIndicator,
  type KeyExchangeData,
} from '@/types';

// Typing timeout (ms)
const TYPING_TIMEOUT = 3000;

interface ChatStore {
  // ============ State ============
  // 인증
  isAuthenticated: boolean;
  familyKey: FamilyKey | null;
  myPeerId: string;
  myName: string;

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

  // P2P 연결
  addPeer: (peer: PeerInfo) => void;
  removePeer: (peerId: string) => void;
  updatePeer: (peerId: string, updates: Partial<PeerInfo>) => void;
  setConnectionStatus: (status: 'disconnected' | 'connecting' | 'connected') => void;

  // 메시지
  addMessage: (message: ChatMessage) => void;
  updateMessageStatus: (messageId: string, status: ChatMessage['status']) => void;
  clearMessages: () => void;

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
