// ============ 암호화 관련 타입 ============
export interface IdentityKeyPair {
  pubKey: Uint8Array;
  privKey: Uint8Array;
}

export interface PreKeyBundle {
  registrationId: number;
  identityKey: Uint8Array;
  signedPreKey: {
    keyId: number;
    pubKey: Uint8Array;
    signature: Uint8Array;
  };
  oneTimePreKeys: Array<{
    keyId: number;
    pubKey: Uint8Array;
  }>;
}

export interface SignalSession {
  sessionId: string;
  recipientId: string;
  device Id: number;
  state: any; // Signal Session State
}

export interface EncryptedMessage {
  ciphertext: Uint8Array;
  type: number;
  registrationId: number;
}

// ============ P2P 연결 관련 타입 ============
export interface PeerInfo {
  id: string;
  name: string;
  publicKey: Uint8Array;
  fingerprint: string;
  connected: boolean;
  lastSeen: number;
}

export interface WebRTCConfig {
  iceServers: RTCIceServer[];
}

export interface DataMessage {
  id: string;
  type: 'text' | 'key-exchange' | 'typing' | 'presence';
  senderId: string;
  timestamp: number;
  data: any;
  encrypted?: boolean;
  ciphertext?: Uint8Array;
}

// ============ 채팅 관련 타입 ============
export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId?: string; // undefined = broadcast to all family members
  content: string;
  timestamp: number;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  encrypted: boolean;
}

export interface TypingIndicator {
  userId: string;
  isTyping: boolean;
  timestamp: number;
}

// ============ 인증 관련 타입 ============
export interface FamilyKey {
  keyId: string;
  keyData: Uint8Array; // 32 bytes pre-shared key
  fingerprint: string; // SHA-256 hash for verification
  createdAt: number;
  expiresAt: number; // Optional: for key rotation
}

export interface KeyExchangeData {
  familyKey: FamilyKey;
  publicKey: Uint8Array;
  peerId: string;
}

// ============ 상태 관리 타입 ============
export interface AppState {
  // 인증 상태
  isAuthenticated: boolean;
  familyKey: FamilyKey | null;
  myPeerId: string;
  myName: string;

  // P2P 연결 상태
  peers: Map<string, PeerInfo>;
  connectionStatus: 'disconnected' | 'connecting' | 'connected';

  // 채팅 상태
  messages: ChatMessage[];
  typingUsers: Set<string>;

  // 보안 상태
  encryptionEnabled: boolean;
  verifiedPeers: Set<string>;
}

export interface AppActions {
  // 인증 액션
  setupFamilyKey: () => Promise<FamilyKey>;
  joinFamily: (keyData: KeyExchangeData) => Promise<void>;
  logout: () => Promise<void>;

  // P2P 액션
  connectToPeer: (peerId: string) => Promise<void>;
  disconnectFromPeer: (peerId: string) => void;

  // 메시지 액션
  sendMessage: (content: string, recipientId?: string) => Promise<void>;
  markAsRead: (messageId: string) => void;

  // 타이핑 액션
  setTyping: (isTyping: boolean) => void;
}

// ============ IndexedDB 관련 타입 ============
export interface StoredData {
  familyKey?: FamilyKey;
  identityKeyPair?: IdentityKeyPair;
  signedPreKey?: { keyId: number; keyPair: KeyPairType };
  oneTimePreKeys?: Array<{ keyId: number; keyPair: KeyPairType }>;
  sessions?: SignalSession[];
  messages?: ChatMessage[];
}

export type KeyPairType = {
  pubKey: Uint8Array;
  privKey: Uint8Array;
};

// ============ 에러 타입 ============
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export type ErrorCode =
  | 'KEY_GENERATION_FAILED'
  | 'KEY_VERIFICATION_FAILED'
  | 'PEER_CONNECTION_FAILED'
  | 'ENCRYPTION_FAILED'
  | 'DECRYPTION_FAILED'
  | 'STORAGE_ERROR'
  | 'NETWORK_ERROR';
