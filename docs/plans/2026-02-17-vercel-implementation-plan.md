# 간소화된 가족 메신저 - Vercel 배포 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** URL + 4자리 인증코드 기반의 간단한 가족 메신저 - Vercel 배포

**Architecture:** 순수 클라이언트 사이드 React 앱 + Vercel Serverless Functions API

**Tech Stack:** React 19, Vite 6, TypeScript, Zustand, Tailwind CSS 4, Vercel Functions, Web Crypto API, Dexie.js

---

## 작업 개요

| Task | 설명 | 상태 |
|------|------|------|
| 1 | 프로젝트 정리 (기존 의존성 제거 완료) | ✅ 완료 |
| 2 | 저장소 레이어 구현 | ⏳ 진행 예정 |
| 3 | Vercel Functions API 구현 | ⏳ 진행 예정 |
| 4 | Web Crypto API E2E 암호화 | ⏳ 진행 예정 |
| 5 | Chat Store 간소화 | ⏳ 진행 예정 |
| 6 | API 클라이언트 구현 | ⏳ 진행 예정 |
| 7 | 메인 페이지 간소화 | ⏳ 진행 예정 |
| 8 | 가족 생성 폼 구현 | ⏳ 진행 예정 |
| 9 | 가족 참여 폼 구현 | ⏳ 진행 예정 |
| 10 | 채팅 페이지 구현 | ⏳ 진행 예정 |

---

## Task 1: 프로젝트 정리 (완료 ✅)

Firebase, P2P, Signal Protocol 의존성 제거 완료.

---

## Task 2: 간단한 저장소 레이어 구현

**Files:**
- Create: `src/lib/api/types.ts`
- Create: `src/lib/api/storage.ts` (Vercel KV용)

**Vercel Storage 옵션:**
1. **Vercel KV (Redis)** - 프로덕션 권장
2. **Vercel Postgres** - SQL 기반
3. **개발용 메모리 저장소** - 로컬 테스트용

**Step 1: 타입 정의 작성**

```typescript
// src/lib/api/types.ts
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

**Step 2: Vercel KV 저장소 작성**

```typescript
// src/lib/api/storage.ts
import { kv } from '@vercel/kv';
import type { Family, Message } from './types';

export class Storage {
  async createFamily(
    name: string,
    authCode: string,
    memberId: string,
    publicKey: string
  ): Promise<Family> {
    const familyId = crypto.randomUUID();
    const family: Family = {
      id: familyId,
      authCode,
      members: [{ id: memberId, name, publicKey }],
      createdAt: Date.now(),
    };

    await kv.hset(`family:${familyId}`, family);
    await kv.expire(`family:${familyId}`, 60 * 60 * 24 * 30); // 30일

    return family;
  }

  async getFamily(familyId: string): Promise<Family | null> {
    return await kv.hgetall<Family>(`family:${familyId}`);
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
    await kv.hset(`family:${familyId}`, family);
    return true;
  }

  async saveMessage(message: Message): Promise<void> {
    await kv.lpush(`messages:${message.familyId}`, JSON.stringify(message));
    // 최근 1000개만 유지
    await kv.ltrim(`messages:${message.familyId}`, 0, 999);
    await kv.expire(`messages:${message.familyId}`, 60 * 60 * 24 * 7); // 7일
  }

  async getMessages(familyId: string, since?: number): Promise<Message[]> {
    const messages = await kv.lrange<Message[]>(`messages:${familyId}`, 0, -1);

    if (since !== undefined) {
      return messages.filter(m => m.timestamp > since);
    }

    return messages || [];
  }
}

export const storage = new Storage();
```

**Step 3: Commit**

```bash
git add src/lib/api/
git commit -m "feat: add storage layer with Vercel KV"
```

---

## Task 3: Vercel Functions API 구현

**Files:**
- Create: `api/family/create.ts`
- Create: `api/family/join.ts`
- Create: `api/messages/send.ts`
- Create: `api/messages/poll.ts`

**Step 1: Vercel 의존성 설치**

```bash
npm install @vercel/kv
```

**Step 2: 가족 생성 API**

```typescript
// api/family/create.ts
import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../src/lib/api/storage';

export async function POST(request: NextRequest) {
  try {
    const { name, authCode, publicKey } = await request.json();

    // 입력 검증
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!authCode || authCode.length !== 4) {
      return NextResponse.json(
        { error: 'Auth code must be 4 characters' },
        { status: 400 }
      );
    }

    if (!publicKey || typeof publicKey !== 'string') {
      return NextResponse.json(
        { error: 'Public key is required' },
        { status: 400 }
      );
    }

    const memberId = crypto.randomUUID();
    const family = await storage.createFamily(
      name.trim(),
      authCode.toUpperCase(),
      memberId,
      publicKey
    );

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    const inviteUrl = `${baseUrl}/invite?family=${family.id}`;

    return NextResponse.json({
      familyId: family.id,
      memberId,
      inviteUrl,
    });
  } catch (error) {
    console.error('Error creating family:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Step 3: 가족 참여 API**

```typescript
// api/family/join.ts
import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../src/lib/api/storage';

export async function POST(request: NextRequest) {
  try {
    const { familyId, name, authCode, publicKey } = await request.json();

    // 입력 검증
    if (!familyId || typeof familyId !== 'string') {
      return NextResponse.json(
        { error: 'Family ID is required' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!authCode || authCode.length !== 4) {
      return NextResponse.json(
        { error: 'Auth code must be 4 characters' },
        { status: 400 }
      );
    }

    if (!publicKey || typeof publicKey !== 'string') {
      return NextResponse.json(
        { error: 'Public key is required' },
        { status: 400 }
      );
    }

    const family = await storage.getFamily(familyId);

    if (!family) {
      return NextResponse.json(
        { error: 'Family not found' },
        { status: 404 }
      );
    }

    if (family.authCode !== authCode.toUpperCase()) {
      return NextResponse.json(
        { error: 'Invalid auth code' },
        { status: 401 }
      );
    }

    if (family.members.length >= 4) {
      return NextResponse.json(
        { error: 'Family is full (max 4 members)' },
        { status: 400 }
      );
    }

    const memberId = crypto.randomUUID();
    const success = await storage.addMember(
      familyId,
      memberId,
      name.trim(),
      publicKey
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to join family' },
        { status: 400 }
      );
    }

    // 업데이트된 멤버 목록 반환
    const updatedFamily = await storage.getFamily(familyId);

    return NextResponse.json({
      familyId,
      memberId,
      members: updatedFamily?.members,
    });
  } catch (error) {
    console.error('Error joining family:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Step 4: 메시지 전송 API**

```typescript
// api/messages/send.ts
import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../src/lib/api/storage';

export async function POST(request: NextRequest) {
  try {
    const { familyId, senderId, senderName, content, encrypted } = await request.json();

    // 입력 검증
    if (!familyId || !senderId || !senderName || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
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

    return NextResponse.json({ success: true, messageId: message.id });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Step 5: 메시지 폴링 API**

```typescript
// api/messages/poll.ts
import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../src/lib/api/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const familyId = searchParams.get('familyId');
    const since = searchParams.get('since');

    if (!familyId) {
      return NextResponse.json(
        { error: 'Missing familyId' },
        { status: 400 }
      );
    }

    const messages = await storage.getMessages(
      familyId,
      since ? parseInt(since, 10) : undefined
    );

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error polling messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Step 6: vercel.json 생성**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Step 7: Commit**

```bash
git add api/ vercel.json package.json package-lock.json
git commit -m "feat: add Vercel Functions API endpoints"
```

---

## Task 4: Web Crypto API E2E 암호화 구현

**Files:**
- Create: `src/lib/crypto/types.ts`
- Create: `src/lib/crypto/index.ts`

*기존 계획과 동일하게 구현*

---

## Task 5-10: 클라이언트 구현

*기존 Vite 계획과 동일하게 구현 (React Router 사용)*

---

## Vercel 배포 설정

**Step 1: Vercel 프로젝트 설정**

```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 배포
vercel
```

**Step 2: 환경 변수 설정**

Vercel Dashboard에서 설정:
- `KV_URL` (Vercel KV 자동 제공)
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `VERCEL_URL` (자동 설정)

**Step 3: Vercel KV 생성**

1. Vercel Dashboard → Storage → Create Database
2. KV (Redis) 선택
3. 리전 선택 (서울 권장)
4. 생성 후 환경 변수 자동 추가

---

## 완료 체크리스트

- [ ] Vercel KV 저장소 동작
- [ ] API 엔드포인트 4개 모두 동작
- [ ] E2E 암호화 동작
- [ ] 가족 생성 및 URL 생성
- [ ] 4자리 인증코드로 참여
- [ ] 메시지 전송/수신 (폴링)
- [ ] Vercel 배포 성공
- [ ] 프로덕션에서 테스트 완료

---

## 로컬 개발 환경

**Vercel KV 없이 로컬 테스트:**

```typescript
// src/lib/api/storage.ts (개발용)
import type { Family, Message } from './types';

// 간단한 인메모리 저장소 (개발용)
const families = new Map<string, Family>();
const messages = new Map<string, Message[]>();

export class Storage {
  // ... 동일한 메서드, Map 기반으로 구현
}
```

또는 로컬에서 Docker로 Redis 실행:
```bash
docker run -d -p 6379:6379 redis
```
