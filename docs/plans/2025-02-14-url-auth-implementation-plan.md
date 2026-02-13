# URL 기반 가족 인증 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 가족 URL 기반 인증 시스템으로 개편 - URL 공유로 가족원 초대, IndexedDB 저장, 파일 전송 기능 추가

**Architecture:** 기존 Firebase + Signal Protocol 아키텍처 유지하며, 인증을 URL 기반으로 변경. Firebase는 시그널링만 담당하고 메시지는 IndexedDB에만 저장. P2P(WebRTC)로 파일 전송.

**Tech Stack:** Next.js 16, TypeScript, Zustand, Firebase Realtime DB, WebRTC(PeerJS), Signal Protocol, Dexie.js (IndexedDB)

---

## Task 1: IndexedDB 래퍼 구현 (Dexie.js)

**Files:**
- Create: `lib/db/indexed-db.ts`
- Create: `lib/db/schema.ts`
- Create: `lib/db/index.ts`

**Step 1: 스키마 타입 정의**

```typescript
// lib/db/schema.ts
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
```

**Step 2: Dexie.js 래퍼 구현**

```typescript
// lib/db/indexed-db.ts
import Dexie, { Table } from 'dexie';
import type { MessageSchema, FileAttachment, FamilySchema, MemberSchema } from './schema';

export class FamilyMessengerDB extends Dexie {
  messages!: Table<MessageSchema, string>;
  files!: Table<FileAttachment, string>;
  family!: Table<FamilySchema, string>;
  members!: Table<MemberSchema, string>;

  constructor() {
    super('FamilyMessengerDB');

    this.version(1).stores({
      messages: 'id, timestamp, senderId',
      files: 'id, messageId',
      family: 'id',
      members: 'id, name'
    });
  }
}

export const db = new FamilyMessengerDB();

// Helper functions
export const dbHelpers = {
  // Messages
  async addMessage(message: MessageSchema): Promise<void> {
    await db.messages.add(message);
  },

  async getMessages(limit: number = 100, before?: number): Promise<MessageSchema[]> {
    let query = db.messages.orderBy('timestamp').reverse();
    if (before) {
      query = query.filter(m => m.timestamp < before);
    }
    return query.limit(limit).toArray();
  },

  async updateMessageStatus(id: string, status: MessageSchema['status']): Promise<void> {
    await db.messages.update(id, { status });
  },

  async clearMessages(): Promise<void> {
    await db.messages.clear();
  },

  // Files
  async addFile(file: FileAttachment): Promise<void> {
    await db.files.add(file);
  },

  async getFile(id: string): Promise<FileAttachment | undefined> {
    return db.files.get(id);
  },

  // Family
  async saveFamily(family: FamilySchema): Promise<void> {
    await db.family.put(family);
  },

  async getFamily(): Promise<FamilySchema | undefined> {
    return db.family.toCollection().first();
  },

  async clearFamily(): Promise<void> {
    await db.family.clear();
  },

  // Members
  async addMember(member: MemberSchema): Promise<void> {
    await db.members.put(member);
  },

  async getMember(id: string): Promise<MemberSchema | undefined> {
    return db.members.get(id);
  },

  async updateMember(id: string, updates: Partial<MemberSchema>): Promise<void> {
    await db.members.update(id, updates);
  },

  async getAllMembers(): Promise<MemberSchema[]> {
    return db.members.toArray();
  },

  async clearMembers(): Promise<void> {
    await db.members.clear();
  }
};
```

**Step 3: 바(barrel) export**

```typescript
// lib/db/index.ts
export * from './schema';
export * from './indexed-db';
export { db } from './indexed-db';
```

**Step 4: Dexie.js 의존성 설치**

```bash
npm install dexie
npm install --save-dev @types/dexie
```

**Step 5: Commit**

```bash
git add lib/db/ package.json package-lock.json
git commit -m "feat: add IndexedDB wrapper with Dexie.js"
```

---

## Task 2: 인증 URL 생성 및 검증 API

**Files:**
- Create: `lib/auth/url-generator.ts`
- Create: `lib/auth/token-validator.ts`
- Create: `lib/auth/invite-service.ts`
- Create: `app/api/auth/verify/route.ts`

**Step 1: URL 생성 구현**

```typescript
// lib/auth/url-generator.ts
import crypto from 'crypto';

const INVITE_URL_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export interface InviteToken {
  familyId: string;
  createdBy: string;
  createdAt: number;
  expiresAt: number;
  signature: string;
}

export function generateInviteUrl(familyId: string, createdBy: string, baseUrl: string): string {
  const token: InviteToken = {
    familyId,
    createdBy,
    createdAt: Date.now(),
    expiresAt: Date.now() + INVITE_URL_EXPIRY,
    signature: ''
  };

  // HMAC signature
  const secret = process.env.FIREBASE_CONFIG || 'default-secret';
  const data = `${token.familyId}:${token.createdBy}:${token.createdAt}:${token.expiresAt}`;
  token.signature = crypto.createHmac('sha256', secret).update(data).digest('hex');

  const encoded = Buffer.from(JSON.stringify(token)).toString('base64url');
  return `${baseUrl}/auth?invite=${encoded}`;
}
```

**Step 2: 토큰 검증 구현**

```typescript
// lib/auth/token-validator.ts
import type { InviteToken } from './url-generator';

export function validateInviteToken(encoded: string): InviteToken | null {
  try {
    const decoded = Buffer.from(encoded, 'base64url').toString();
    const token: InviteToken = JSON.parse(decoded);

    // Check expiry
    if (Date.now() > token.expiresAt) {
      return null;
    }

    // Verify signature
    const secret = process.env.FIREBASE_CONFIG || 'default-secret';
    const data = `${token.familyId}:${token.createdBy}:${token.createdAt}:${token.expiresAt}`;
    const expectedSignature = require('crypto')
      .createHmac('sha256', secret)
      .update(data)
      .digest('hex');

    if (token.signature !== expectedSignature) {
      return null;
    }

    return token;
  } catch {
    return null;
  }
}

export function getInviteErrorCode(token: InviteToken | null): string | null {
  if (!token) {
    return 'INVALID_TOKEN';
  }
  if (Date.now() > token.expiresAt) {
    return 'EXPIRED_TOKEN';
  }
  return null;
}
```

**Step 3: 초대 서비스 구현**

```typescript
// lib/auth/invite-service.ts
import { getFirebaseAdmin } from '../firebase/firebase-admin';
import type { InviteToken } from './url-validator';

export interface InviteValidationResult {
  valid: boolean;
  error?: 'EXPIRED' | 'INVALID' | 'FULL' | 'ALREADY_MEMBER';
  familyId?: string;
  memberCount?: number;
}

export async function validateInvite(token: InviteToken): Promise<InviteValidationResult> {
  const admin = getFirebaseAdmin();
  const db = admin.database();

  // Check family exists
  const familyRef = db.ref(`families/${token.familyId}`);
  const familySnap = await familyRef.get();

  if (!familySnap.exists()) {
    return { valid: false, error: 'INVALID' };
  }

  // Check member count
  const membersRef = familyRef.child('members');
  const membersSnap = await membersRef.get();
  const memberCount = membersSnap.size || 0;

  if (memberCount >= 4) {
    return { valid: false, error: 'FULL', memberCount };
  }

  return {
    valid: true,
    familyId: token.familyId,
    memberCount
  };
}
```

**Step 4: API 라우트**

```typescript
// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { validateInviteToken } from '@/lib/auth/token-validator';
import { validateInvite } from '@/lib/auth/invite-service';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const invite = searchParams.get('invite');

  if (!invite) {
    return NextResponse.json({ error: 'MISSING_INVITE' }, { status: 400 });
  }

  const token = validateInviteToken(invite);
  const validation = await validateInvite(token);

  if (!validation.valid) {
    return NextResponse.json(validation, { status: 400 });
  }

  return NextResponse.json(validation);
}
```

**Step 5: Commit**

```bash
git add lib/auth/ app/api/auth/
git commit -m "feat: add invite URL generation and verification API"
```

---

## Task 3: 가족 생성 페이지

**Files:**
- Create: `app/auth/page.tsx`
- Create: `components/auth/CreateFamilyForm.tsx`

**Step 1: 메인 페이지를 가족 생성/입장 선택으로 변경**

```typescript
// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
        <div className="text-6xl">👨‍👩‍👧‍👦</div>
        <h1 className="text-2xl font-bold text-gray-900">가족 메신저</h1>
        <p className="text-gray-600">가족끼리만 메시지와 파일을 공유하세요</p>

        <div className="space-y-3">
          <Link
            href="/auth?mode=create"
            className="block w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            새 가족 만들기
          </Link>
          <p className="text-sm text-gray-500">또는</p>
          <Link
            href="/auth?mode=join"
            className="block w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            가족원에게 받은 URL 입력
          </Link>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: 가족 생성 커폀넌트**

```typescript
// components/auth/CreateFamilyForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateInviteUrl } from '@/lib/auth/url-generator';

export function CreateFamilyForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('이름을 입력해주세요');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create family in Firebase
      const familyId = crypto.randomUUID();
      const baseUrl = window.location.origin;

      // Save to IndexedDB
      await dbHelpers.saveFamily({
        id: familyId,
        myMemberId: crypto.randomUUID(),
        myName: name,
        keys: { publicKey: new Uint8Array() }, // TODO: generate keys
        joinedAt: Date.now()
      });

      const url = generateInviteUrl(familyId, 'creator', baseUrl);
      setInviteUrl(url);
    } catch (err) {
      setError('가족 생성에 실패했습니다');
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

  if (inviteUrl) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-lg font-semibold">가족이 생성되었습니다!</h3>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-2">이 URL을 가족원에게 보내세요:</p>
          <input
            type="text"
            value={inviteUrl}
            readOnly
            className="w-full px-3 py-2 bg-white border rounded-lg text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopy}
            className="py-2 bg-blue-500 text-white rounded-lg font-medium"
          >
            복사하기
          </button>
          <button
            onClick={() => router.push('/chat')}
            className="py-2 bg-gray-200 text-gray-700 rounded-lg font-medium"
          >
            채팅 시작
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이름
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
          placeholder="당신의 이름"
          autoFocus
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50"
      >
        {loading ? '생성 중...' : '가족 만들기'}
      </button>
    </form>
  );
}
```

**Step 3: Commit**

```bash
git add app/page.tsx components/auth/CreateFamilyForm.tsx
git commit -m "feat: add create family form page"
```

---

## Task 4: 가족 입장 페이지

**Files:**
- Create: `app/auth/page.tsx`
- Create: `components/auth/JoinFamilyForm.tsx`

**Step 1: 인증 페이지 구현**

```typescript
// app/auth/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { CreateFamilyForm } from '@/components/auth/CreateFamilyForm';
import { JoinFamilyForm } from '@/components/auth/JoinFamilyForm';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const invite = searchParams.get('invite');

  // If invite URL is present, show join form
  if (invite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <JoinFamilyForm inviteToken={invite} />
        </div>
      </div>
    );
  }

  // Otherwise show mode selection
  if (mode === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h2 className="text-xl font-bold mb-6 text-center">새 가족 만들기</h2>
          <CreateFamilyForm />
        </div>
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h2 className="text-xl font-bold mb-6 text-center">URL 입력</h2>
          <JoinFamilyForm />
        </div>
      </div>
    );
  }

  // Invalid - redirect home
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>유효하지 않은 접근입니다. <a href="/">홈으로</a></p>
    );
  }
}
```

**Step 2: 가족 입장 폼**

```typescript
// components/auth/JoinFamilyForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateInviteToken } from '@/lib/auth/token-validator';

interface Props {
  inviteToken?: string;
}

export function JoinFamilyForm({ inviteToken: propToken }: Props) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [token, setToken] = useState(propToken || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    setError('');
    setLoading(true);

    try {
      // Validate token
      const validated = validateInviteToken(token);
      if (!validated) {
        setError('유효하지 않은 초대장입니다');
        return;
      }

      // Check expiry
      if (Date.now() > validated.expiresAt) {
        setError('만료된 초대장입니다. 가족원에게 새 URL을 요청하세요');
        return;
      }

      // TODO: Verify with API, join family, key exchange

      // Save to IndexedDB
      await dbHelpers.saveFamily({
        id: validated.familyId,
        myMemberId: crypto.randomUUID(),
        myName: name,
        keys: { publicKey: new Uint8Array() },
        joinedAt: Date.now()
      });

      router.push('/chat');
    } catch (err) {
      setError('가족 참여에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleJoin(); }} className="space-y-4">
      {!propToken && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            초대 URL
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
            placeholder="가족원에게 받은 URL을 붙여넣으세요"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이름
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
          placeholder="가족원들에게 보일 이름"
          autoFocus={!!propToken}
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !name.trim() || !token.trim()}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50"
      >
        {loading ? '참여 중...' : '가족에 참여'}
      </button>
    </form>
  );
}
```

**Step 3: Commit**

```bash
git add app/auth/page.tsx components/auth/JoinFamilyForm.tsx
git commit -m "feat: add join family page"
```

---

## Task 5: Zustand 스토어 수정 (IndexedDB 연동)

**Files:**
- Modify: `stores/chat-store.ts`

**Step 1: IndexedDB를 사용하도록 스토어 리팩토링**

```typescript
// stores/chat-store.ts
import { create } from 'zustand';
import { dbHelpers } from '@/lib/db';

interface ChatStore {
  // ... existing state ...

  // Actions
  loadMessages: () => Promise<void>;
  saveMessage: (message: ChatMessage) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // ... existing initial state ...

  // New actions
  loadMessages: async () => {
    const messages = await dbHelpers.getMessages(100);
    set({ messages });
  },

  saveMessage: async (message) => {
    await dbHelpers.addMessage(message);
    set((state) => ({
      messages: [...state.messages, message]
    }));
  },

  // ... keep other actions ...
}));
```

**Step 2: Commit**

```bash
git add stores/chat-store.ts
git commit -m "refactor: integrate IndexedDB with chat store"
```

---

## Task 6: 파일 업로드 커폀넌트

**Files:**
- Create: `components/chat/FileUploadButton.tsx`
- Create: `components/chat/FilePreview.tsx`

**Step 1: 파일 업로드 버튼**

```typescript
// components/chat/FileUploadButton.tsx
'use client';

import { useRef } from 'react';
import { useChatStore } from '@/stores/chat-store';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain'
];

export function FileUploadButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addMessage } = useChatStore();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (file.size > MAX_FILE_SIZE) {
      alert('파일 크기는 10MB 이하여야 합니다');
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('지원하지 않는 파일 형식입니다');
      return;
    }

    // TODO: Send file via P2P
    console.log('File selected:', file.name);

    // Reset
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        accept={ALLOWED_TYPES.join(',')}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="p-3 text-gray-500 hover:text-blue-500 transition-colors"
        aria-label="파일 첨부"
      >
        📎
      </button>
    </>
  );
}
```

**Step 2: 파일 미리보기**

```typescript
// components/chat/FilePreview.tsx
'use client';

import type { FileAttachment } from '@/lib/db';

interface Props {
  file: FileAttachment;
}

export function FilePreview({ file }: Props) {
  const isImage = file.type.startsWith('image/');

  if (isImage) {
    return (
      <div className="rounded-lg overflow-hidden max-w-xs">
        <img
          src={`/api/files/${file.id}`}
          alt={file.name}
          className="w-full h-auto"
        />
        <p className="text-xs text-gray-500 mt-1">{file.name}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
      <span className="text-2xl">📄</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
      </div>
      <button className="text-blue-500 hover:text-blue-700">
        ⬇️
      </button>
    </div>
  );
}
```

**Step 3: MessageInput에 파일 버튼 추가**

```typescript
// components/chat/MessageInput.tsx 수정
import { FileUploadButton } from './FileUploadButton';

// ... in return, add to the input area:
<div className="flex items-end gap-2">
  <FileUploadButton />
  {/* existing textarea and send button */}
</div>
```

**Step 4: Commit**

```bash
git add components/chat/FileUploadButton.tsx components/chat/FilePreview.tsx components/chat/MessageInput.tsx
git commit -m "feat: add file upload and preview components"
```

---

## Task 7: Firebase 시그널링 리팩토링 (메시지 TTL)

**Files:**
- Modify: `lib/firebase/firebase-manager.ts`

**Step 1: 메시지 전송 시 TTL 추가**

```typescript
// lib/firebase/firebase-manager.ts
// ... existing code ...

async broadcastMessage(message: DataMessage) {
  if (!this.familyId) return;

  const messagesRef = this.db.ref(`families/${this.familyId}/messages`);
  await messagesRef.push({
    ...message,
    // Set server timestamp with 1 minute TTL
    '.priority': Firebase.ServerValue.TIMESTAMP
  });

  // Cleanup old messages via Firebase rules or Cloud Functions
}
```

**Step 2: Commit**

```bash
git add lib/firebase/firebase-manager.ts
git commit -m "refactor: add TTL to Firebase messages"
```

---

## Task 8: E2E 키 교환 유지보수

**Files:**
- Modify: `lib/signal/protocol.ts`
- Modify: `components/auth/CreateFamilyForm.tsx`
- Modify: `components/auth/JoinFamilyForm.tsx`

**Step 1: 키 생성 헬퍼 추가**

```typescript
// lib/signal/protocol.ts
export async function generateIdentityKeyPair(): Promise<{ publicKey: Uint8Array; privateKey: Uint8Array }> {
  // TODO: Use existing Signal Protocol implementation
  const keyPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey']
  );

  const publicKey = await crypto.subtle.exportKey('raw', keyPair.publicKey);
  const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  return {
    publicKey: new Uint8Array(publicKey),
    privateKey: new Uint8Array(privateKey)
  };
}
```

**Step 2: CreateFamilyForm에서 키 생성 사용**

```typescript
// components/auth/CreateFamilyForm.tsx 수정
import { generateIdentityKeyPair } from '@/lib/signal/protocol';

// in handleCreate:
const keyPair = await generateIdentityKeyPair();

await dbHelpers.saveFamily({
  id: familyId,
  myMemberId: crypto.randomUUID(),
  myName: name,
  keys: keyPair,
  joinedAt: Date.now()
});
```

**Step 3: Commit**

```bash
git add lib/signal/protocol.ts components/auth/CreateFamilyForm.tsx components/auth/JoinFamilyForm.tsx
git commit -m "feat: integrate key generation with auth forms"
```

---

## Task 9: 오프라인 지원 및 메시지 재시용

**Files:**
- Create: `lib/offline/message-queue.ts`
- Modify: `components/chat/MessageInput.tsx`

**Step 1: 메시지 큐 구현**

```typescript
// lib/offline/message-queue.ts
interface QueuedMessage {
  id: string;
  message: DataMessage;
  attempts: number;
  timestamp: number;
}

class MessageQueue {
  private queue: Map<string, QueuedMessage> = new Map();
  private processing = false;
  private maxAttempts = 3;

  enqueue(message: DataMessage) {
    this.queue.set(message.id, {
      id: message.id,
      message,
      attempts: 0,
      timestamp: Date.now()
    });
    this.processQueue();
  }

  private async processQueue() {
    if (this.processing) return;
    this.processing = true;

    for (const [id, queued] of this.queue) {
      if (queued.attempts >= this.maxAttempts) {
        this.queue.delete(id);
        continue;
      }

      try {
        await this.sendMessage(queued.message);
        this.queue.delete(id);
      } catch {
        queued.attempts++;
      }
    }

    this.processing = false;
  }

  private async sendMessage(message: DataMessage) {
    // TODO: Send via Firebase or P2P
  }
}

export const messageQueue = new MessageQueue();
```

**Step 2: MessageInput에서 큐 사용**

```typescript
// components/chat/MessageInput.tsx 수정
import { messageQueue } from '@/lib/offline/message-queue';

// in handleSend:
messageQueue.enqueue(message);
```

**Step 3: Commit**

```bash
git add lib/offline/message-queue.ts components/chat/MessageInput.tsx
git commit -m "feat: add offline message queue with retry"
```

---

## Task 10: 에러 핸들링 및 알림 시스템

**Files:**
- Create: `components/shared/Toaster.tsx`
- Create: `lib/hooks/useToast.ts`

**Step 1: 토스트 훅**

```typescript
// lib/hooks/useToast.ts
import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = crypto.randomUUID();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      }));
    }, 3000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter(t => t.id !== id)
    }))
}));

export const useToast = () => {
  const { addToast } = useToastStore();
  return {
    showToast: (message: string, type?: Toast['type']) => addToast(message, type)
  };
};
```

**Step 2: Toaster 커폀넌트**

```typescript
// components/shared/Toaster.tsx
'use client';

import { useToastStore } from '@/lib/hooks/useToast';

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  const colors = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500'
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${colors[toast.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add lib/hooks/useToast.ts components/shared/Toaster.tsx
git commit -m "feat: add toast notification system"
```

---

## Task 11: 채팅 페이지 UI 개선

**Files:**
- Modify: `app/chat/page.tsx`

**Step 1: 채팅 페이지 커폀넌트 구현**

```typescript
// app/chat/page.tsx
'use client';

import { useEffect } from 'react';
import { useChatStore } from '@/stores/chat-store';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { MessageInput } from '@/components/chat/MessageInput';
import { Toaster } from '@/components/shared/Toaster';
import { dbHelpers } from '@/lib/db';

export default function ChatPage() {
  const { messages, loadMessages } = useChatStore();

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster />

      <header className="bg-white dark:bg-gray-800 border-b sticky top-0">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-semibold">가족 메신저</h1>
          <button className="text-sm text-blue-500">나가기</button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 pb-24">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>메시지를 보내보세요!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} isMine={false} />
            ))}
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t">
        <div className="max-w-2xl mx-auto p-4">
          <MessageInput />
        </div>
      </footer>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add app/chat/page.tsx
git commit -m "feat: implement chat page UI"
```

---

## Task 12: Firebase 규칙 설정

**Files:**
- Create: `firebase.rules`

**Step 1: Realtime Database 규칙**

```javascript
// firebase.rules
{
  "rules": {
    "families": {
      "$familyId": {
        ".read": "auth != null",
        ".write": "auth != null",
        "members": {
          ".indexOn": ["name"],
          "$memberId": {
            ".validate": "newData.hasChildren(['id', 'name', 'publicKey', 'joinedAt'])"
          }
        },
        "messages": {
          // Messages expire after 1 minute
          ".validate": "newData.hasChildren(['id', 'senderId', 'timestamp', 'type']) && newData.child('timestamp').val() > now - 60000"
        },
        "signaling": {
          "$memberId": {
            ".read": "auth != null",
            ".write": "auth.uid == $memberId"
          }
        },
        "presence": {
          ".indexOn": ["online"]
        }
      }
    }
  }
}
```

**Step 2: Commit**

```bash
git add firebase.rules
git commit -m "feat: add Firebase security rules"
```

---

## 완료 체크리스트

- [ ] IndexedDB 래퍼 동작 확인
- [ ] 가족 생성 및 URL 생성 동작
- [ ] URL로 가족 입장 동작
- [ ] 텍스트 메시지 전송/수신
- [ ] 파일 업로드 (이미지, PDF)
- [ ] 오프라인 상태에서 메시지 큐 동작
- [ ] E2E 암호화 확인
- [ ] 4명 제한 체크
- [ ] 24시간 만료 체크
- [ ] 다양한 에러 상황 테스트

---

## 테스트 방법

```bash
# 1. 개발 서버 시작
npm run dev

# 2. 다른 브라우저/시크릿 모드에서 두 탭 열기
# 3. 첫 탭: 가족 생성 → URL 복사
# 4. 둘 탭: URL 붙여넣고 가족 입장
# 5. 양쪽 탭에서 메시지 전송 테스트
# 6. 파일 업로드 테스트
# 7. 오프라인 모드 테스트 (DevTools → Network → Offline)
```

---

## 배포 전 체크리스트

- [ ] `NEXT_PUBLIC_BASE_URL` 환경변수 설정
- [ ] Firebase 프로젝트 설정
- [ ] Firebase Database 규칙 배포
- [ ] Netlify 빌드 확인
- [ ] Production HTTPS 확인
- [ ] CSP 헤더 설정
