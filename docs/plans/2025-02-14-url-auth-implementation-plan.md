# 간소화된 URL 기반 가족 인증 구현 계획 v2

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 간소화된 URL + 4자리 인증코드 기반 가족 메신저 - 복잡한 Firebase/P2P 제거, 서버 중계식 채팅

**Architecture:** 서버 중계식 채팅, 간단한 Netlify Functions API, E2E 암호화 유지

**Tech Stack:** Next.js 16, TypeScript, Zustand, Netlify Functions, Web Crypto API, Dexie.js (IndexedDB)

---

## Task 1: 간단한 API 서버 구현 (Netlify Functions)

**Files:**
- Create: `netlify/functions/api/family-create.ts`
- Create: `netlify/functions/api/family-join.ts`
- Create: `netlify/functions/api/messages-send.ts`
- Create: `netlify/functions/api/messages-poll.ts`
- Create: `lib/api/storage.ts` (간단한 파일 기반 저장소)

**Step 1: 저장소 구현 (Netlify Blobs 또는 파일 시스템)**

```typescript
// lib/api/storage.ts
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.netlify', 'data');

interface Family {
  id: string;
  authCode: string;
  members: Array<{ id: string; name: string; publicKey: string }>;
  createdAt: number;
}

interface Message {
  id: string;
  familyId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  encrypted: boolean;
}

export class Storage {
  private ensureDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  async createFamily(name: string, authCode: string, memberId: string, publicKey: string): Promise<Family> {
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

  async addMember(familyId: string, memberId: string, name: string, publicKey: string): Promise<boolean> {
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

**Step 2: 가족 생성 API**

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

    if (!name || !authCode || authCode.length !== 4) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid input' }),
      };
    }

    const memberId = crypto.randomUUID();
    const family = await storage.createFamily(name, authCode, memberId, publicKey);

    const inviteUrl = `${process.env.URL}/invite?family=${family.id}`;

    return {
      statusCode: 200,
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

**Step 3: 가족 참여 API**

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

    const family = await storage.getFamily(familyId);

    if (!family) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Family not found' }),
      };
    }

    if (family.authCode !== authCode) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid auth code' }),
      };
    }

    if (family.members.length >= 4) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Family is full' }),
      };
    }

    const memberId = crypto.randomUUID();
    const success = await storage.addMember(familyId, memberId, name, publicKey);

    if (!success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Failed to join family' }),
      };
    }

    return {
      statusCode: 200,
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

**Step 4: 메시지 전송 API**

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

**Step 5: 메시지 폴링 API**

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

**Step 7: Commit**

```bash
git add netlify/functions api lib/api/storage.ts netlify.toml
git commit -m "feat: add simplified API endpoints (v2)"
```

---

## Task 2: 간단한 인증 페이지

**Files:**
- Modify: `app/page.tsx`
- Create: `app/invite/page.tsx`
- Modify: `components/auth/CreateFamilyForm.tsx`
- Modify: `components/auth/JoinFamilyForm.tsx`

**Step 1: 메인 페이지 간소화**

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

**Step 2: 가족 생성 페이지**

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

**Step 3: 초대 페이지**

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

**Step 4: 간소화된 가족 생성 폼**

```typescript
// components/auth/CreateFamilyForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/stores/chat-store';
import { generateKeyPair } from '@/lib/crypto';

export function CreateFamilyForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('이름을 입력해주세요');
      return;
    }
    if (!authCode.trim() || authCode.length !== 4) {
      setError('4자리 인증코드를 입력해주세요');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 키 쌍 생성
      const keyPair = await generateKeyPair();
      const memberId = crypto.randomUUID();

      // API 호출
      const response = await fetch('/api/family/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          authCode: authCode.toUpperCase(),
          publicKey: keyPair.publicKey,
        }),
      });

      if (!response.ok) {
        throw new Error('가족 생성 실패');
      }

      const data = await response.json();

      // 스토어 업데이트
      useChatStore.getState().setAuthenticated(true);
      useChatStore.getState().setMyInfo(data.memberId, name);
      useChatStore.getState().setFamilyId(data.familyId);

      // IndexedDB에 저장
      await dbHelpers.saveFamily({
        id: data.familyId,
        myMemberId: data.memberId,
        myName: name,
        authCode: authCode.toUpperCase(),
        keys: keyPair,
        joinedAt: Date.now(),
      });

      setInviteUrl(data.inviteUrl);
    } catch (err) {
      setError('가족 생성에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  // ... 나머지 UI 코드
}
```

**Step 5: 간소화된 참여 폼**

```typescript
// components/auth/JoinFamilyForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useChatStore } from '@/stores/chat-store';
import { generateKeyPair } from '@/lib/crypto';

export function JoinFamilyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const familyId = searchParams.get('family');

  const [name, setName] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    if (!name.trim()) {
      setError('이름을 입력해주세요');
      return;
    }
    if (!authCode.trim() || authCode.length !== 4) {
      setError('4자리 인증코드를 입력해주세요');
      return;
    }
    if (!familyId) {
      setError('유효하지 않은 초대장입니다');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const keyPair = await generateKeyPair();

      const response = await fetch('/api/family/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyId,
          name,
          authCode: authCode.toUpperCase(),
          publicKey: keyPair.publicKey,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '참여 실패');
      }

      const data = await response.json();

      // 스토어 업데이트
      useChatStore.getState().setAuthenticated(true);
      useChatStore.getState().setMyInfo(data.memberId, name);
      useChatStore.getState().setFamilyId(familyId);

      // IndexedDB에 저장
      await dbHelpers.saveFamily({
        id: familyId,
        myMemberId: data.memberId,
        myName: name,
        authCode: authCode.toUpperCase(),
        keys: keyPair,
        joinedAt: Date.now(),
      });

      router.push('/chat');
    } catch (err) {
      setError(err instanceof Error ? err.message : '참여에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  // ... 나머지 UI 코드
}
```

**Step 6: Commit**

```bash
git add app/page.tsx app/create/page.tsx app/invite/page.tsx components/auth/
git commit -m "feat: add simplified auth pages (v2)"
```

---

## Task 3: 간단한 채팅 페이지

**Files:**
- Modify: `app/chat/page.tsx`
- Modify: `components/chat/MessageInput.tsx`
- Create: `lib/api/client.ts`

**Step 1: API 클라이언트**

```typescript
// lib/api/client.ts
export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api';
  }

  async sendMessage(params: {
    familyId: string;
    senderId: string;
    senderName: string;
    content: string;
    encrypted: boolean;
  }) {
    const response = await fetch(`${this.baseUrl}/messages/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  }

  async pollMessages(familyId: string, since?: number) {
    const params = new URLSearchParams({ familyId });
    if (since !== undefined) {
      params.set('since', since.toString());
    }
    const response = await fetch(`${this.baseUrl}/messages/poll?${params}`);
    return response.json();
  }
}

export const apiClient = new ApiClient();
```

**Step 2: 간소화된 채팅 페이지**

```typescript
// app/chat/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useChatStore } from '@/stores/chat-store';
import { apiClient } from '@/lib/api/client';
import ChatMessage from '@/components/chat/ChatMessage';
import MessageInput from '@/components/chat/MessageInput';

export default function ChatPage() {
  const { messages, isAuthenticated, familyId, myPeerId, addMessage } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);

  // 메시지 폴링
  useEffect(() => {
    if (!isAuthenticated || !familyId) return;

    const pollMessages = async () => {
      if (isLoading) return;
      setIsLoading(true);

      try {
        const lastTimestamp = messages[messages.length - 1]?.timestamp || 0;
        const data = await apiClient.pollMessages(familyId, lastTimestamp);

        for (const msg of data.messages) {
          if (msg.senderId !== myPeerId) {
            addMessage(msg);
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
  }, [isAuthenticated, familyId, messages.length]);

  if (!isAuthenticated) {
    return <div>인증이 필요합니다...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">가족 메신저</h1>
          <button className="text-sm text-blue-500">나가기</button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isMine={message.senderId === myPeerId}
            />
          ))}
        </div>
      </main>

      {/* Input */}
      <footer className="bg-white border-t">
        <div className="max-w-4xl mx-auto p-4">
          <MessageInput />
        </div>
      </footer>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add app/chat/page.tsx lib/api/client.ts
git commit -m "feat: add simplified chat page (v2)"
```

---

## Task 4: 간단한 E2E 암호화

**Files:**
- Create: `lib/crypto/index.ts`

**Step 1: Web Crypto API 래퍼**

```typescript
// lib/crypto/index.ts
export async function generateKeyPair(): Promise<{
  publicKey: string;
  privateKey: string;
}> {
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

export async function encryptMessage(
  message: string,
  publicKeyBase64: string
): Promise<string> {
  const publicKeyBuffer = Uint8Array.from(atob(publicKeyBase64), c => c.charCodeAt(0));
  const publicKey = await crypto.subtle.importKey(
    'spki',
    publicKeyBuffer,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    []
  );

  const ephemeralKey = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey']
  );

  const sharedKey = await crypto.subtle.deriveKey(
    { name: 'ECDH', public: publicKey },
    ephemeralKey.privateKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    sharedKey,
    new TextEncoder().encode(message)
  );

  const ephemeralPublicKey = await crypto.subtle.exportKey('spki', ephemeralKey.publicKey);
  const ephemeralPublicKeyArray = new Uint8Array(ephemeralPublicKey);

  // Combine: ephemeralPublicKey + iv + encrypted
  const combined = new Uint8Array(
    ephemeralPublicKeyArray.length + iv.length + encrypted.byteLength
  );
  combined.set(ephemeralPublicKeyArray);
  combined.set(iv, ephemeralPublicKeyArray.length);
  combined.set(new Uint8Array(encrypted), ephemeralPublicKeyArray.length + iv.length);

  return btoa(String.fromCharCode(...combined));
}

export async function decryptMessage(
  encryptedBase64: string,
  privateKeyBase64: string
): Promise<string> {
  const privateKeyBuffer = Uint8Array.from(atob(privateKeyBase64), c => c.charCodeAt(0));
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    privateKeyBuffer,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    ['deriveKey']
  );

  const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));

  // Extract ephemeralPublicKey (first 91 bytes for P-256)
  const ephemeralPublicKeyArray = combined.slice(0, 91);
  const iv = combined.slice(91, 103); // 12 bytes
  const encrypted = combined.slice(103);

  const ephemeralPublicKey = await crypto.subtle.importKey(
    'spki',
    ephemeralPublicKeyArray,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    []
  );

  const sharedKey = await crypto.subtle.deriveKey(
    { name: 'ECDH', public: ephemeralPublicKey },
    privateKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    sharedKey,
    encrypted
  );

  return new TextDecoder().decode(decrypted);
}
```

**Step 2: Commit**

```bash
git add lib/crypto/
git commit -m "feat: add simplified E2E encryption (v2)"
```

---

## 완료 체크리스트

- [ ] 간단한 API 서버 동작 확인
- [ ] 가족 생성 및 URL 생성 동작
- [ ] 4자리 인증코드로 가족 참여 동작
- [ ] 텍스트 메시지 전송/수신 (폴링)
- [ ] E2E 암호화 확인
- [ ] 4명 제한 체크
- [ ] 다양한 에러 상황 테스트

---

## 테스트 방법

```bash
# 1. 개발 서버 시작
npm run dev

# 2. 가족 생성 테스트
# - /create 접속
# - 이름 + 4자리 코드 입력
# - 생성된 URL 복사

# 3. 가족 참여 테스트
# - 다른 브라우저/시크릿 모드에서 /invite?family=xxxxx 접속
# - 이름 + 4자리 코드 입력
# - 채팅방 입장

# 4. 메시지 전송 테스트
# - 양쪽 브라우저에서 메시지 전송
# - 3초 폴링으로 메시지 수신 확인
```

---

## 배포 전 체크리스트

- [ ] Netlify Functions 설정 확인
- [ ] 환경변수 설정 (필요시)
- [ ] Netlify 빌드 확인
- [ ] Production HTTPS 확인
