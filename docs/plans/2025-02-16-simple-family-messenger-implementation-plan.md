# 간소화된 가족 메신저 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** URL + 4자리 인증코드 기반의 간단한 가족 메신저 - 복잡한 Firebase/P2P 제거, 서버 중계식 채팅

**Architecture:** 서버 중계식 채팅 (Netlify Functions API), 간단한 파일 기반 저장소, Web Crypto API E2E 암호화, 3초 폴링으로 메시지 수신

**Tech Stack:** Next.js 16, TypeScript, Zustand, Netlify Functions, Web Crypto API, Dexie.js (IndexedDB), Tailwind CSS 4

---

## Task 1: 프로젝트 정리 및 기존 Firebase 제거

**Files:**
- Delete: `lib/firebase/` (전체)
- Delete: `lib/webrtc/` (전체)
- Delete: `lib/signal/` (전체 - Web Crypto로 대체)
- Delete: `lib/offline/` (P2P 관련 부분만)
- Delete: `components/p2p/` (전체)
- Modify: `stores/chat-store.ts` (P2P 관련 상태 제거)

**Step 1: 기존 Firebase/Webrtc/Signal 관련 파일 삭제**

```bash
# Firebase 관련 삭제
rm -rf lib/firebase/
rm -f lib/firebase.ts

# WebRTC P2P 관련 삭제
rm -rf lib/webrtc/
rm -rf components/p2p/

# Signal Protocol 관련 삭제 (Web Crypto로 대체 예정)
rm -rf lib/signal/

# 오프라인 큐에서 P2P 관련 부분 정리
# lib/offline/message-queue.ts는 유지하되 P2P 의존성 제거
```

**Step 2: Chat Store에서 P2P 관련 상태 제거**

기존 `stores/chat-store.ts`에서 다음 상태와 액션 제거:
- `peers` 상태
- `addPeer`, `removePeer` 액션
- `peerDiscoveryEnabled` 상태
- `setPeerDiscoveryEnabled` 액션
- `familyKey` 상태 (Firebase 관련)
- `additionalPin` 상태 (P2P 인증 관련)

**Step 3: Commit**

```bash
git add -A
git commit -m "refactor: remove Firebase, P2P, Signal Protocol dependencies

 preparing for simplified server-relay architecture"
```

---

## Task 2: 간단한 저장소 레이어 구현

**Files:**
- Create: `lib/api/storage.ts`
- Create: `lib/api/types.ts`

**Step 1: 타입 정의 작성**

```typescript
// lib/api/types.ts
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

export interface Message {
  id: string;
  familyId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  encrypted: boolean;
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
}
```

**Step 2: 저장소 클래스 작성 (파일 기반, 개발용)**

```typescript
// lib/api/storage.ts
import fs from 'fs';
import path from 'path';
import type { Family, Message } from './types';

const DATA_DIR = path.join(process.cwd(), '.netlify', 'data');

export class Storage {
  private ensureDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  async createFamily(
    name: string,
    authCode: string,
    memberId: string,
    publicKey: string
  ): Promise<Family> {
    this.ensureDir();
    const familyId = crypto.randomUUID();
    const family: Family = {
      id: familyId,
      authCode,
      members: [{ id: memberId, name, publicKey }],
      createdAt: Date.now(),
    };
    fs.writeFileSync(
      path.join(DATA_DIR, `${familyId}.json`),
      JSON.stringify(family, null, 2)
    );
    return family;
  }

  async getFamily(familyId: string): Promise<Family | null> {
    const filePath = path.join(DATA_DIR, `${familyId}.json`);
    if (!fs.existsSync(filePath)) return null;
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }

  async addMember(
    familyId: string,
    memberId: string,
    name: string,
    publicKey: string
  ): Promise<boolean> {
    const family = await this.getFamily(familyId);
    if (!family || family.members.length >= 4) return false;

    family.members.push({ id: memberId, name, publicKey });
    fs.writeFileSync(
      path.join(DATA_DIR, `${familyId}.json`),
      JSON.stringify(family, null, 2)
    );
    return true;
  }

  async saveMessage(message: Message): Promise<void> {
    this.ensureDir();
    const filePath = path.join(DATA_DIR, `messages-${message.familyId}.json`);
    let messages: Message[] = [];
    if (fs.existsSync(filePath)) {
      messages = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    messages.push(message);

    // 최근 1000개만 유지
    if (messages.length > 1000) {
      messages = messages.slice(-1000);
    }

    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
  }

  async getMessages(familyId: string, since?: number): Promise<Message[]> {
    const filePath = path.join(DATA_DIR, `messages-${familyId}.json`);
    if (!fs.existsSync(filePath)) return [];

    const messages: Message[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (since !== undefined) {
      return messages.filter(m => m.timestamp > since);
    }

    return messages;
  }
}

export const storage = new Storage();
```

**Step 3: 저장소 단위 테스트 (선택사항)**

```bash
# 테스트 파일 생성
touch lib/api/storage.test.ts

# 테스트 실행 (나중에)
npm test -- lib/api/storage.test.ts
```

**Step 4: Commit**

```bash
git add lib/api/
git commit -m "feat: add simple file-based storage layer for families and messages"
```

---

## Task 3: Netlify Functions API 구현

**Files:**
- Create: `netlify/functions/api/family-create.ts`
- Create: `netlify/functions/api/family-join.ts`
- Create: `netlify/functions/api/messages-send.ts`
- Create: `netlify/functions/api/messages-poll.ts`
- Modify: `netlify.toml`

**Step 1: Netlify 의존성 설치**

```bash
npm install @netlify/functions
```

**Step 2: 가족 생성 API 작성**

```typescript
// netlify/functions/api/family-create.ts
import { Handler } from '@netlify/functions';
import { storage } from '../../../lib/api/storage';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { name, authCode, publicKey } = JSON.parse(event.body || '{}');

    // 입력 검증
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name is required' }),
      };
    }

    if (!authCode || authCode.length !== 4) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Auth code must be 4 characters' }),
      };
    }

    if (!publicKey || typeof publicKey !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Public key is required' }),
      };
    }

    const memberId = crypto.randomUUID();
    const family = await storage.createFamily(
      name.trim(),
      authCode.toUpperCase(),
      memberId,
      publicKey
    );

    const inviteUrl = `${process.env.URL || 'http://localhost:3000'}/invite?family=${family.id}`;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        familyId: family.id,
        memberId,
        inviteUrl,
      }),
    };
  } catch (error) {
    console.error('Error creating family:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
```

**Step 3: 가족 참여 API 작성**

```typescript
// netlify/functions/api/family-join.ts
import { Handler } from '@netlify/functions';
import { storage } from '../../../lib/api/storage';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { familyId, name, authCode, publicKey } = JSON.parse(event.body || '{}');

    // 입력 검증
    if (!familyId || typeof familyId !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Family ID is required' }),
      };
    }

    if (!name || typeof name !== 'string' || name.trim().length === 로) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name is required' }),
      };
    }

    if (!authCode || authCode.length !== 4) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Auth code must be 4 characters' }),
      };
    }

    if (!publicKey || typeof publicKey !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Public key is required' }),
      };
    }

    const family = await storage.getFamily(familyId);

    if (!family) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Family not found' }),
      };
    }

    if (family.authCode !== authCode.toUpperCase()) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid auth code' }),
      };
    }

    if (family.members.length >= 4) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Family is full (max 4 members)' }),
      };
    }

    const memberId = crypto.randomUUID();
    const success = await storage.addMember(
      familyId,
      memberId,
      name.trim(),
      publicKey
    );

    if (!success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Failed to join family' }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        familyId,
        memberId,
        members: family.members,
      }),
    };
  } catch (error) {
    console.error('Error joining family:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
```

**Step 4: 메시지 전송 API 작성**

```typescript
// netlify/functions/api/messages-send.ts
import { Handler } from '@netlify/functions';
import { storage } from '../../../lib/api/storage';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { familyId, senderId, senderName, content, encrypted } = JSON.parse(event.body || '{}');

    // 입력 검증
    if (!familyId || !senderId || !senderName || !content) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const message = {
      id: crypto.randomUUID(),
      familyId,
      senderId,
      senderName,
      content,
      timestamp: Date.now(),
      encrypted: encrypted || false,
    };

    await storage.saveMessage(message);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, messageId: message.id }),
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
```

**Step 5: 메시지 폴링 API 작성**

```typescript
// netlify/functions/api/messages-poll.ts
import { Handler } from '@netlify/functions';
import { storage } from '../../../lib/api/storage';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { familyId, since } = event.queryStringParameters || {};

    if (!familyId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing familyId' }),
      };
    }

    const messages = await storage.getMessages(
      familyId,
      since ? parseInt(since, 10) : undefined
    );

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    };
  } catch (error) {
    console.error('Error polling messages:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
```

**Step 6: netlify.toml 업데이트**

```toml
[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
```

**Step 7: API 로컬 테스트**

```bash
# 개발 서버 시작
npm run dev

# 테스트: 가족 생성
curl -X POST http://localhost:3000/api/family/create \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","authCode":"A123","publicKey":"test-key"}'

# 예상 응답: {"familyId":"...","memberId":"...","inviteUrl":"..."}
```

**Step 8: Commit**

```bash
git add netlify/functions api lib/api/ netlify.toml package.json package-lock.json
git commit -m "feat: add Netlify Functions API endpoints

- family-create: Create new family with 4-digit auth code
- family-join: Join existing family with auth code validation
- messages-send: Send message to family
- messages-poll: Poll for new messages since timestamp"
```

---

## Task 4: Web Crypto API E2E 암호화 구현

**Files:**
- Create: `lib/crypto/index.ts`
- Create: `lib/crypto/types.ts`

**Step 1: 암호화 타입 정의**

```typescript
// lib/crypto/types.ts
export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export interface EncryptedMessage {
  ephemeralPublicKey: string;
  iv: string;
  ciphertext: string;
}
```

**Step 2: 키 생성 함수 작성**

```typescript
// lib/crypto/index.ts
import type { KeyPair } from './types';

export async function generateKeyPair(): Promise<KeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey']
  );

  const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  return {
    publicKey: btoa(String.fromCharCode(...new Uint8Array(publicKey))),
    privateKey: btoa(String.fromCharCode(...new Uint8Array(privateKey))),
  };
}
```

**Step 3: 암호화 함수 작성**

```typescript
// lib/crypto/index.ts (추가)

export async function encryptMessage(
  message: string,
  recipientPublicKeyBase64: string
): Promise<string> {
  // 수신자 공개키 import
  const publicKeyBuffer = Uint8Array.from(
    atob(recipientPublicKeyBase64),
    c => c.charCodeAt(0)
  );
  const publicKey = await crypto.subtle.importKey(
    'spki',
    publicKeyBuffer,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    []
  );

  // 일회용 키 쌍 생성 (Ephemeral key)
  const ephemeralKey = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey']
  );

  // 공유 키 파생 (ECDH)
  const sharedKey = await crypto.subtle.deriveKey(
    { name: 'ECDH', public: publicKey },
    ephemeralKey.privateKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  // 메시지 암호화
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    sharedKey,
    new TextEncoder().encode(message)
  );

  // 일회용 공개키 export
  const ephemeralPublicKey = await crypto.subtle.exportKey(
    'spki',
    ephemeralKey.publicKey
  );
  const ephemeralPublicKeyArray = new Uint8Array(ephemeralPublicKey);

  // 결합: ephemeralPublicKey + iv + ciphertext
  const combined = new Uint8Array(
    ephemeralPublicKeyArray.length + iv.length + encrypted.byteLength
  );
  combined.set(ephemeralPublicKeyArray);
  combined.set(iv, ephemeralPublicKeyArray.length);
  combined.set(new Uint8Array(encrypted), ephemeralPublicKeyArray.length + iv.length);

  return btoa(String.fromCharCode(...combined));
}
```

**Step 4: 복호화 함수 작성**

```typescript
// lib/crypto/index.ts (추가)

export async function decryptMessage(
  encryptedBase64: string,
  privateKeyBase64: string
): Promise<string> {
  // 개인키 import
  const privateKeyBuffer = Uint8Array.from(
    atob(privateKeyBase64),
    c => c.charCodeAt(0)
  );
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    privateKeyBuffer,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    ['deriveKey']
  );

  // 암호화된 데이터 파싱
  const combined = Uint8Array.from(
    atob(encryptedBase64),
    c => c.charCodeAt(0)
  );

  // P-256 공개키 크기는 약 91바이트 (ASN.1 DER 인코딩)
  const ephemeralPublicKeyArray = combined.slice(0, 91);
  const iv = combined.slice(91, 103); // 12 bytes
  const ciphertext = combined.slice(103);

  // 일회용 공개키 import
  const ephemeralPublicKey = await crypto.subtle.importKey(
    'spki',
    ephemeralPublicKeyArray,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    []
  );

  // 공유 키 파생
  const sharedKey = await crypto.subtle.deriveKey(
    { name: 'ECDH', public: ephemeralPublicKey },
    privateKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  // 메시지 복호화
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    sharedKey,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}
```

**Step 5: 암호화 브라우저 테스트**

개발자 콘솔에서 다음을 실행하여 테스트:

```javascript
// 테스트 코드
const keyPair1 = await generateKeyPair();
const keyPair2 = await generateKeyPair();

const message = "Hello, World!";
const encrypted = await encryptMessage(message, keyPair2.publicKey);
const decrypted = await decryptMessage(encrypted, keyPair2.privateKey);

console.log(decrypted === message); // true
```

**Step 6: Commit**

```bash
git add lib/crypto/
git commit -m "feat: add Web Crypto API E2E encryption

- generateKeyPair: Generate ECDH P-256 key pair
- encryptMessage: Encrypt with ephemeral key + AES-GCM
- decryptMessage: Decrypt using private key
- Uses base64 encoding for storage/transmission"
```

---

## Task 5: Chat Store 간소화 및 IndexedDB 스키마 업데이트

**Files:**
- Modify: `stores/chat-store.ts`
- Modify: `lib/db/schema.ts`

**Step 1: IndexedDB 스키마 업데이트**

```typescript
// lib/db/schema.ts
export interface FamilySchema {
  id: string;
  authCode: string;
  myMemberId: string;
  myName: string;
  keys: {
    publicKey: string;
    privateKey: string;
  };
  joinedAt: number;
}

export interface MessageSchema {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  encrypted: boolean;
  status: 'pending' | 'sent' | 'delivered';
}
```

**Step 2: Chat Store 간소화**

```typescript
// stores/chat-store.ts
import { create } from 'zustand';
import type { FamilySchema, MessageSchema } from '@/lib/db/schema';

interface ChatStore {
  // 인증 상태
  isAuthenticated: boolean;
  familyId: string | null;
  myMemberId: string | null;
  myName: string | null;

  // 메시지
  messages: MessageSchema[];

  // 액션
  setAuthenticated: (authenticated: boolean) => void;
  setFamilyId: (familyId: string) => void;
  setMyInfo: (memberId: string, name: string) => void;
  addMessage: (message: MessageSchema) => void;
  saveMessage: (message: MessageSchema) => Promise<void>;
  loadMessages: () => Promise<void>;
  clearMessages: () => void;
  logout: () => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // 초기 상태
  isAuthenticated: false,
  familyId: null,
  myMemberId: null,
  myName: null,
  messages: [],

  // 액션
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  setFamilyId: (familyId) => set({ familyId }),
  setMyInfo: (memberId, name) => set({ myMemberId: memberId, myName: name }),

  addMessage: (message) => {
    set((state) => {
      // 중복 메시지 방지
      if (state.messages.some(m => m.id === message.id)) {
        return state;
      }
      return {
        messages: [...state.messages, message].sort(
          (a, b) => a.timestamp - b.timestamp
        ),
      };
    });
  },

  saveMessage: async (message) => {
    const { messages } = get();
    if (!messages.some(m => m.id === message.id)) {
      // IndexedDB에 저장
      await dbHelpers.addMessage(message);
      // 상태 업데이트
      set((state) => ({
        messages: [...state.messages, message].sort(
          (a, b) => a.timestamp - b.timestamp
        ),
      }));
    }
  },

  loadMessages: async () => {
    const messages = await dbHelpers.getMessages(100);
    set({ messages });
  },

  clearMessages: () => set({ messages: [] }),

  logout: async () => {
    await dbHelpers.clearMessages();
    set({
      isAuthenticated: false,
      familyId: null,
      myMemberId: null,
      myName: null,
      messages: [],
    });
  },
}));
```

**Step 3: Commit**

```bash
git add stores/chat-store.ts lib/db/schema.ts
git commit -m "refactor: simplify chat store, remove P2P/Firebase dependencies

- Remove peers, peerDiscoveryEnabled, familyKey, additionalPin
- Add familyId for simplified auth
- Keep message management with IndexedDB persistence"
```

---

## Task 6: API 클라이언트 구현

**Files:**
- Create: `lib/api/client.ts`

**Step 1: API 클라이언트 작성**

```typescript
// lib/api/client.ts
import type {
  CreateFamilyRequest,
  JoinFamilyRequest,
  SendMessageRequest,
} from './types';

interface CreateFamilyResponse {
  familyId: string;
  memberId: string;
  inviteUrl: string;
}

interface JoinFamilyResponse {
  familyId: string;
  memberId: string;
  members: Array<{ id: string; name: string; publicKey: string }>;
}

interface SendMessageResponse {
  success: boolean;
  messageId: string;
}

interface PollMessagesResponse {
  messages: Array<{
    id: string;
    familyId: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: number;
    encrypted: boolean;
  }>;
}

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api';
  }

  private async fetchApi(
    endpoint: string,
    options?: RequestInit
  ): Promise<Response> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'API request failed');
    }

    return response;
  }

  async createFamily(
    request: CreateFamilyRequest
  ): Promise<CreateFamilyResponse> {
    const response = await this.fetchApi('/family/create', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.json();
  }

  async joinFamily(request: JoinFamilyRequest): Promise<JoinFamilyResponse> {
    const response = await this.fetchApi('/family/join', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.json();
  }

  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await this.fetchApi('/messages/send', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.json();
  }

  async pollMessages(
    familyId: string,
    since?: number
  ): Promise<PollMessagesResponse> {
    const params = new URLSearchParams({ familyId });
    if (since !== undefined) {
      params.set('since', since.toString());
    }

    const response = await this.fetchApi(`/messages/poll?${params}`);
    return response.json();
  }
}

export const apiClient = new ApiClient();
```

**Step 2: Commit**

```bash
git add lib/api/client.ts
git commit -m "feat: add API client for Netlify Functions

- createFamily: Create new family
- joinFamily: Join with auth code
- sendMessage: Send message to family
- pollMessages: Poll for new messages"
```

---

## Task 7: 메인 페이지 간소화

**Files:**
- Modify: `app/page.tsx`
- Create: `app/create/page.tsx`
- Create: `app/invite/page.tsx`

**Step 1: 메인 페이지 작성**

```typescript
// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
        <div className="text-6xl">👨‍👩‍👧‍👦</div>
        <h1 className="text-2xl font-bold text-gray-900">가족 메신저</h1>
        <p className="text-gray-600">가족끼리만 메시지를 공유하세요</p>

        <div className="space-y-3">
          <Link
            href="/create"
            className="block w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            새 가족 만들기
          </Link>
          <Link
            href="/invite"
            className="block w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            초대장으로 참여
          </Link>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: 가족 생성 페이지 작성**

```typescript
// app/create/page.tsx
import { CreateFamilyForm } from '@/components/auth/CreateFamilyForm';

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-xl font-bold mb-6 text-center">새 가족 만들기</h2>
        <CreateFamilyForm />
      </div>
    </div>
  );
}
```

**Step 3: 초대 페이지 작성**

```typescript
// app/invite/page.tsx
import { JoinFamilyForm } from '@/components/auth/JoinFamilyForm';

export default function InvitePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-xl font-bold mb-6 text-center">가족에 참여</h2>
        <JoinFamilyForm />
      </div>
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add app/page.tsx app/create/page.tsx app/invite/page.tsx
git commit -m "feat: add simplified auth pages

- /: Home page with create/join options
- /create: Create new family page
- /invite: Join family page"
```

---

## Task 8: 가족 생성 폼 구현

**Files:**
- Modify: `components/auth/CreateFamilyForm.tsx`

**Step 1: 가족 생성 폼 작성**

```typescript
// components/auth/CreateFamilyForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/stores/chat-store';
import { apiClient } from '@/lib/api/client';
import { generateKeyPair } from '@/lib/crypto';
import { dbHelpers } from '@/lib/db';

export function CreateFamilyForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 입력 검증
    if (!name.trim()) {
      setError('이름을 입력해주세요');
      return;
    }
    if (!authCode.trim() || authCode.length !== 4) {
      setError('4자리 인증코드를 입력해주세요');
      return;
    }

    setLoading(true);

    try {
      // 키 쌍 생성
      const keyPair = await generateKeyPair();

      // API 호출
      const response = await apiClient.createFamily({
        name: name.trim(),
        authCode: authCode.toUpperCase(),
        publicKey: keyPair.publicKey,
      });

      // 스토어 업데이트
      useChatStore.getState().setAuthenticated(true);
      useChatStore.getState().setFamilyId(response.familyId);
      useChatStore.getState().setMyInfo(response.memberId, name.trim());

      // IndexedDB에 저장
      await dbHelpers.saveFamily({
        id: response.familyId,
        authCode: authCode.toUpperCase(),
        myMemberId: response.memberId,
        myName: name.trim(),
        keys: keyPair,
        joinedAt: Date.now(),
      });

      setInviteUrl(response.inviteUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '가족 생성에 실패했습니다'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl);
      alert('URL이 복사되었습니다!');
    }
  };

  const handleStartChat = () => {
    router.push('/chat');
  };

  if (inviteUrl) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-lg font-semibold">가족이 생성되었습니다!</h3>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-900 mb-2">인증코드: <strong>{authCode.toUpperCase()}</strong></p>
          <p className="text-sm text-blue-700 mb-3">이 정보를 가족원에게 공유하세요:</p>
          <input
            type="text"
            value={inviteUrl}
            readOnly
            className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopy}
            className="py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            📋 URL 복사
          </button>
          <button
            onClick={handleStartChat}
            className="py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            채팅 시작
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleCreate} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          이름
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
          placeholder="당신의 이름"
          autoFocus
          maxLength={20}
        />
      </div>

      <div>
        <label
          htmlFor="authCode"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          인증코드 (4자리)
        </label>
        <input
          id="authCode"
          type="text"
          value={authCode}
          onChange={(e) => {
            const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            setAuthCode(value.slice(0, 4));
          }}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-center text-2xl tracking-widest font-mono"
          placeholder="A123"
          maxLength={4}
        />
        <p className="text-xs text-gray-500 mt-1">
          가족원에게 공유할 4자리 코드를 입력하세요
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !name.trim() || authCode.length !== 4}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? '생성 중...' : '가족 만들기'}
      </button>
    </form>
  );
}
```

**Step 2: Commit**

```bash
git add components/auth/CreateFamilyForm.tsx
git commit -m "feat: implement create family form

- Name input with validation
- 4-digit auth code input (auto-uppercase)
- E2E key generation
- Display invite URL and auth code for sharing"
```

---

## Task 9: 가족 참여 폼 구현

**Files:**
- Modify: `components/auth/JoinFamilyForm.tsx`

**Step 1: 참여 폼 작성**

```typescript
// components/auth/JoinFamilyForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useChatStore } from '@/stores/chat-store';
import { apiClient } from '@/lib/api/client';
import { generateKeyPair } from '@/lib/crypto';
import { dbHelpers } from '@/lib/db';

export function JoinFamilyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const familyIdFromUrl = searchParams.get('family');

  const [familyId, setFamilyId] = useState(familyIdFromUrl || '');
  const [name, setName] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 입력 검증
    if (!familyId.trim()) {
      setError('가족 ID가 필요합니다');
      return;
    }
    if (!name.trim()) {
      setError('이름을 입력해주세요');
      return;
    }
    if (!authCode.trim() || authCode.length !== 4) {
      setError('4자리 인증코드를 입력해주세요');
      return;
    }

    setLoading(true);

    try {
      // 키 쌍 생성
      const keyPair = await generateKeyPair();

      // API 호출
      const response = await apiClient.joinFamily({
        familyId: familyId.trim(),
        name: name.trim(),
        authCode: authCode.toUpperCase(),
        publicKey: keyPair.publicKey,
      });

      // 스토어 업데이트
      useChatStore.getState().setAuthenticated(true);
      useChatStore.getState().setFamilyId(response.familyId);
      useChatStore.getState().setMyInfo(response.memberId, name.trim());

      // IndexedDB에 저장
      await dbHelpers.saveFamily({
        id: response.familyId,
        authCode: authCode.toUpperCase(),
        myMemberId: response.memberId,
        myName: name.trim(),
        keys: keyPair,
        joinedAt: Date.now(),
      });

      // 채팅 페이지로 이동
      router.push('/chat');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '참여에 실패했습니다'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleJoin} className="space-y-4">
      {!familyIdFromUrl && (
        <div>
          <label
            htmlFor="familyId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            가족 ID (URL에서 ?family= 뒤에 있는 값)
          </label>
          <input
            id="familyId"
            type="text"
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors font-mono text-sm"
            placeholder="가족 ID를 붙여넣으세요"
          />
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          이름
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
          placeholder="가족원들에게 보일 이름"
          autoFocus={!!familyIdFromUrl}
          maxLength={20}
        />
      </div>

      <div>
        <label
          htmlFor="authCode"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          인증코드
        </label>
        <input
          id="authCode"
          type="text"
          value={authCode}
          onChange={(e) => {
            const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            setAuthCode(value.slice(0, 4));
          }}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-center text-2xl tracking-widest font-mono"
          placeholder="A123"
          maxLength={4}
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={
          loading ||
          !familyId.trim() ||
          !name.trim() ||
          authCode.length !== 4
        }
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? '참여 중...' : '가족에 참여'}
      </button>
    </form>
  );
}
```

**Step 2: Commit**

```bash
git add components/auth/JoinFamilyForm.tsx
git commit -m "feat: implement join family form

- Support family ID from URL parameter
- Name and auth code inputs
- E2E key generation
- Redirect to chat on success"
```

---

## Task 10: 채팅 페이지 간소화 구현

**Files:**
- Modify: `app/chat/page.tsx`
- Modify: `components/chat/MessageInput.tsx`

**Step 1: 간소화된 채팅 페이지 작성**

```typescript
// app/chat/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/stores/chat-store';
import { apiClient } from '@/lib/api/client';
import { encryptMessage, decryptMessage } from '@/lib/crypto';
import ChatMessage from '@/components/chat/ChatMessage';
import MessageInput from '@/components/chat/MessageInput';
import Toaster from '@/components/shared/Toaster';
import { useToast } from '@/lib/hooks/useToast';

export default function ChatPage() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    isAuthenticated,
    familyId,
    myMemberId,
    myName,
    messages,
    addMessage,
    loadMessages,
  } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);
  const [membersPublicKeys, setMembersPublicKeys] = useState<
    Record<string, string>
  >({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 인증 체크
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      toast.error('인증이 필요합니다');
    } else {
      loadMessages();
    }
  }, [isAuthenticated]);

  // 기존 키 로드 (IndexedDB에서)
  useEffect(() => {
    const loadKeys = async () => {
      const family = await dbHelpers.getFamily();
      if (family) {
        // 가족원 공개키 맵 생성 (자신 제외)
        // TODO: 참여 시 받은 멤버 목록을 저장해두어야 함
      }
    };
    loadKeys();
  }, []);

  // 메시지 폴링
  useEffect(() => {
    if (!isAuthenticated || !familyId) return;

    const pollMessages = async () => {
      if (isLoading) return;
      setIsLoading(true);

      try {
        const lastTimestamp =
          messages[messages.length - 1]?.timestamp || 0;
        const data = await apiClient.pollMessages(familyId, lastTimestamp);

        for (const msg of data.messages) {
          if (msg.senderId !== myMemberId) {
            // 암호화된 메시지 복호화
            let content = msg.content;
            if (msg.encrypted) {
              try {
                const myKeys = await getMyKeys();
                content = await decryptMessage(msg.content, myKeys.privateKey);
              } catch (error) {
                console.error('Decryption failed:', error);
                content = '[복호화 실패]';
              }
            }

            addMessage({
              id: msg.id,
              senderId: msg.senderId,
              senderName: msg.senderName,
              content,
              timestamp: msg.timestamp,
              encrypted: msg.encrypted,
              status: 'delivered',
            });
          }
        }
      } catch (error) {
        console.error('Failed to poll messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const interval = setInterval(pollMessages, 3000); // 3초마다 폴링
    pollMessages(); // 초기 로딩

    return () => clearInterval(interval);
  }, [isAuthenticated, familyId, messages.length, myMemberId]);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!familyId || !myMemberId || !myName) return;

    try {
      // TODO: 모든 멤버의 공개키로 암호화
      // 현재는 평문으로 전송 (암호화는 추후 구현)
      const encrypted = false; // 일단 평문

      const response = await apiClient.sendMessage({
        familyId,
        senderId: myMemberId,
        senderName: myName,
        content,
        encrypted,
      });

      // 로컬 메시지 추가
      addMessage({
        id: response.messageId,
        senderId: myMemberId,
        senderName: myName,
        content,
        timestamp: Date.now(),
        encrypted,
        status: 'sent',
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('메시지 전송 실패');
    }
  };

  const handleLogout = async () => {
    await useChatStore.getState().logout();
    router.push('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">가족 메신저</h1>
            <p className="text-sm text-gray-500">E2E 암호화됨</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            나가기
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-gray-600">첫 메시지를 보내보세요!</p>
              <p className="text-sm text-gray-500 mt-2">
                모든 메시지는 End-to-End 암호화됩니다
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isMine={message.senderId === myMemberId}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto p-4">
          <MessageInput onSend={handleSendMessage} />
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

async function getMyKeys() {
  const family = await dbHelpers.getFamily();
  if (!family?.keys) {
    throw new Error('Keys not found');
  }
  return family.keys;
}
```

**Step 2: MessageInput 컴포넌트 수정**

```typescript
// components/chat/MessageInput.tsx 수정
interface MessageInputProps {
  onSend: (content: string) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지를 입력하세요..."
        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
        maxLength={500}
      />
      <button
        type="submit"
        disabled={!message.trim()}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        전송
      </button>
    </form>
  );
}
```

**Step 3: Commit**

```bash
git add app/chat/page.tsx components/chat/MessageInput.tsx
git commit -m "feat: implement simplified chat page

- 3-second polling for new messages
- Message send via API
- Auto-scroll to latest message
- E2E encryption placeholder (to be implemented)"
```

---

## 완료 체크리스트

### 기능 테스트
- [ ] **인증**
  - [ ] 가족 생성 (이름 + 4자리 코드)
  - [ ] 초대 URL 생성 및 복사
  - [ ] URL로 가족 참여
  - [ ] 잘못된 인증코드 거부
  - [ ] 4명 초과 시 거부

- [ ] **채팅**
  - [ ] 메시지 전송
  - [ ] 3초 폴링으로 메시지 수신
  - [ ] 메시지 순서 정확함
  - [ ] 자동 스크롤

- [ ] **암호화**
  - [ ] 키 쌍 생성
  - [ ] 메시지 암호화/복호화
  - [ ] IndexedDB에 키 저장

### 에러 핸들링
- [ ] 네트워크 오류
- [ ] API 실패
- [ ] 잘못된 입력

### 배포 준비
- [ ] Netlify Functions 테스트
- [ ] 빌드 성공
- [ ] 환경 변수 설정

---

## 테스트 방법

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 시작
npm run dev

# 3. 테스트 시나리오
# A. 가족 생성
#    - http://localhost:3000/create 접속
#    - 이름: "아빠", 인증코드: "TEST" 입력
#    - 생성된 URL 복사
#
# B. 가족 참여
#    - 시크릿 모드에서 복사한 URL 접속
#    - 또는 http://localhost:3000/invite?family=xxxxx 접속
#    - 이름: "엄마", 인증코드: "TEST" 입력
#
# C. 채팅 테스트
#    - 양쪽 탭에서 메시지 전송
#    - 3초 내 메시지 수신 확인

# 4. API 테스트 (선택)
curl -X POST http://localhost:3000/api/family/create \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","authCode":"A123","publicKey":"test"}'
```

---

## 다음 단계 (선택사항)

1. **멀티캐스트 암호화**: 각 멤버의 공개키로 개별 암호화
2. **파일 전송**: 이미지/문서 공유 기능
3. **SSE/WebSocket**: 폴링 대신 실시간 수신
4. **메시지 상태**: 전송/수신 확인
5. **타이핑 표시**: 누군가 입력 중일 때 표시
6. **프로필 이미지**: 멤버별 아바타
7. **알림**: 새 메시지 푸시 알림
