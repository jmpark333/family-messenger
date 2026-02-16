# 간소화된 URL 기반 가족 메신저 - Next.js 없는 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Next.js 없이 순수 React + Vite로 간단한 가족 메신저 구현 - sharp 의존성 문제 해결

**Architecture:** 순수 클라이언트 사이드 React 앱 + Netlify Functions API - 별도의 SSR 없이 정적 파일 배포

**Tech Stack:** React 19, Vite 6, TypeScript, Zustand, Tailwind CSS 4, Netlify Functions, Web Crypto API, Dexie.js

---

## Task 1: 프로젝트 Vite로 마이그레이션

**Files:**
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Modify: `package.json`
- Delete: `next.config.js` (if exists)

**Step 1: package.json 업데이트 (Next.js 제거, Vite 추가)**

```bash
npm uninstall next @netlify/plugin-nextjs
npm install --save-dev vite @vitejs/plugin-react
```

**Step 2: vite.config.ts 생성**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
});
```

**Step 3: index.html 생성 (루트 디렉토리)**

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>가족 메신저</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 4: src/main.tsx 생성**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './app/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Step 5: src/App.tsx 생성 (React Router 설정)**

```bash
npm install react-router-dom
```

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import InvitePage from './pages/InvitePage';
import ChatPage from './pages/ChatPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/invite" element={<InvitePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Step 6: package.json scripts 업데이트**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx"
  }
}
```

**Step 7: Commit**

```bash
git add vite.config.ts index.html src/main.tsx src/App.tsx package.json package-lock.json
git commit -m "refactor: migrate from Next.js to Vite"
```

---

## Task 2: 파일 구조 재구성

**Files:**
- Move: `app/globals.css` → `src/app/globals.css`
- Move: `app/*.tsx` → `src/pages/*.tsx`
- Move: `components/*` → `src/components/*`
- Move: `lib/*` → `src/lib/*`
- Move: `stores/*` → `src/stores/*`
- Delete: `app/` directory (empty after move)

**Step 1: 디렉토리 구조 생성**

```bash
mkdir -p src/pages src/components/auth src/components/chat src/components/shared src/lib/crypto src/lib/api src/stores
```

**Step 2: 파일 이동**

```bash
# CSS
mv app/globals.css src/app/globals.css

# Pages
mv app/page.tsx src/pages/HomePage.tsx
mv app/auth/page.tsx src/pages/AuthPage.tsx
mv app/chat/page.tsx src/pages/ChatPage.tsx

# Components
mv components/* src/components/

# Lib
mv lib/* src/lib/

# Stores
mv stores/* src/stores/
```

**Step 3: Commit**

```bash
git add src/
git commit -m "refactor: reorganize file structure for Vite"
```

---

## Task 3: 페이지 컴포넌트 Next.js 의존성 제거

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/CreatePage.tsx`
- Modify: `src/pages/InvitePage.tsx`
- Modify: `src/pages/ChatPage.tsx`

**Step 1: HomePage.tsx 수정 (Next.js Link 제거)**

```typescript
// src/pages/HomePage.tsx
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
        <div className="text-6xl">👨‍👩‍👧‍👦</div>
        <h1 className="text-2xl font-bold text-gray-900">가족 메신저</h1>
        <p className="text-gray-600">가족끼리만 메시지를 공유하세요</p>

        <div className="space-y-3">
          <Link
            to="/create"
            className="block w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            새 가족 만들기
          </Link>
          <Link
            to="/invite"
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

**Step 2: CreatePage.tsx 수정**

```typescript
// src/pages/CreatePage.tsx
import { CreateFamilyForm } from '../components/auth/CreateFamilyForm';

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

**Step 3: InvitePage.tsx 수정 (useSearchParams → useSearchParams 커스텀 훅)**

```typescript
// src/pages/InvitePage.tsx
import { JoinFamilyForm } from '../components/auth/JoinFamilyForm';
import { useSearchParams } from '../lib/hooks/useSearchParams';

export default function InvitePage() {
  const searchParams = useSearchParams();
  const familyId = searchParams.get('family');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-xl font-bold mb-6 text-center">가족에 참여</h2>
        <JoinFamilyForm familyId={familyId} />
      </div>
    </div>
  );
}
```

**Step 4: useSearchParams 커스텀 훅 생성**

```typescript
// src/lib/hooks/useSearchParams.ts
import { useLocation } from 'react-router-dom';

export function useSearchParams() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  return {
    get: (key: string) => params.get(key),
    toString: () => params.toString(),
  };
}
```

**Step 5: Commit**

```bash
git add src/pages/ src/lib/hooks/
git commit -m "refactor: remove Next.js dependencies from page components"
```

---

## Task 4: 컴포넌트 Next.js 의존성 제거

**Files:**
- Modify: `src/components/auth/CreateFamilyForm.tsx`
- Modify: `src/components/auth/JoinFamilyForm.tsx`
- Modify: `src/components/chat/MessageInput.tsx`
- Modify: `src/components/chat/ChatMessage.tsx`

**Step 1: CreateFamilyForm.tsx 수정 (useRouter → useNavigate)**

```typescript
// src/components/auth/CreateFamilyForm.tsx
'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../../stores/chat-store';

// ... 기존 코드에서 router.push → navigate('/chat')로 변경

export function CreateFamilyForm() {
  const navigate = useNavigate();
  // ... 나머지 코드

  const handleCreate = async () => {
    // ... API 호출

    setInviteUrl(data.inviteUrl);
    // 성공 시 navigate('/chat')로 이동
  };
}
```

**Step 2: JoinFamilyForm.tsx 수정**

```typescript
// src/components/auth/JoinFamilyForm.tsx
'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from '../../lib/hooks/useSearchParams';
import { useChatStore } from '../../stores/chat-store';

export function JoinFamilyForm({ familyId: propFamilyId }: { familyId?: string }) {
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const familyId = propFamilyId || searchParams.get('family');

  // ... 나머지 코드
}
```

**Step 3: Commit**

```bash
git add src/components/auth/
git commit -m "refactor: remove Next.js dependencies from auth components"
```

---

## Task 5: ChatPage.tsx 완전 재작성

**Files:**
- Modify: `src/pages/ChatPage.tsx`

**Step 1: ChatPage.tsx 재작성**

```typescript
// src/pages/ChatPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../stores/chat-store';
import { apiClient } from '../lib/api/client';
import ChatMessage from '../components/chat/ChatMessage';
import MessageInput from '../components/chat/MessageInput';

export default function ChatPage() {
  const navigate = useNavigate();
  const { messages, isAuthenticated, familyId, myPeerId, addMessage, logout } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, navigate]);

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

    const interval = setInterval(pollMessages, 3000);
    pollMessages();

    return () => clearInterval(interval);
  }, [isAuthenticated, familyId, messages.length, myPeerId, addMessage, isLoading]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return <div>인증이 필요합니다...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">가족 메신저</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            나가기
          </button>
        </div>
      </header>

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

      <footer className="bg-white border-t">
        <div className="max-w-4xl mx-auto p-4">
          <MessageInput />
        </div>
      </footer>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/pages/ChatPage.tsx
git commit -m "refactor: rewrite ChatPage for Vite"
```

---

## Task 6: netlify.toml 업데이트 (Next.js 플러그인 제거)

**Files:**
- Modify: `netlify.toml`

**Step 1: netlify.toml 업데이트**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

# SPA routing - 모든 경로를 index.html로 리다이렉트
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# API 라우팅
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[functions]
  directory = "netlify/functions"
```

**Step 2: Commit**

```bash
git add netlify.toml
git commit -m "refactor: update netlify.toml for Vite build"
```

---

## Task 7: @ 경로 별칭 설정 (선택)

**Files:**
- Modify: `vite.config.ts`
- Modify: `tsconfig.json`

**Step 1: vite.config.ts에 path alias 추가**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
});
```

**Step 2: tsconfig.json 업데이트**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Step 3: Import 경로 업데이트**

```bash
# 모든 파일에서 상대 경로를 @ 별칭으로 변경
# 예: '../../stores/chat-store' → '@/stores/chat-store'
```

**Step 4: Commit**

```bash
git add vite.config.ts tsconfig.json src/
git commit -m "refactor: add path alias support"
```

---

## Task 8: API 서버 구현 (기존 계획 유지)

**Files:**
- Create: `netlify/functions/api/family-create.ts`
- Create: `netlify/functions/api/family-join.ts`
- Create: `netlify/functions/api/messages-send.ts`
- Create: `netlify/functions/api/messages-poll.ts`
- Create: `src/lib/api/storage.ts`

*이 태스크는 기존 계획의 Task 1과 동일하게 구현*

**Step 1: 저장소 구현**

```typescript
// src/lib/api/storage.ts
// 기존 계획의 코드와 동일
```

**Step 2: Netlify Functions 구현**

```typescript
// netlify/functions/api/*.ts
// 기존 계획의 코드와 동일
```

**Step 3: API 클라이언트 업데이트**

```typescript
// src/lib/api/client.ts
export class ApiClient {
  private baseUrl: string;

  constructor() {
    // 개발 중에는 Vite proxy, 프로덕션에서는 상대 경로
    this.baseUrl = import.meta.env.DEV ? '/api' : '/.netlify/functions/api';
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

  async createFamily(params: {
    name: string;
    authCode: string;
    publicKey: string;
  }) {
    const response = await fetch(`${this.baseUrl}/family/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  }

  async joinFamily(params: {
    familyId: string;
    name: string;
    authCode: string;
    publicKey: string;
  }) {
    const response = await fetch(`${this.baseUrl}/family/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  }
}

export const apiClient = new ApiClient();
```

**Step 4: Vite proxy 설정 (개발용)**

```typescript
// vite.config.ts
export default defineConfig({
  // ... 기존 설정
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/.netlify/functions/api'),
      },
    },
  },
});
```

**Step 5: Commit**

```bash
git add netlify/functions src/lib/api/
git commit -m "feat: add API server and client"
```

---

## Task 9: E2E 암호화 구현 (기존 계획 유지)

**Files:**
- Create: `src/lib/crypto/index.ts`

*이 태스크는 기존 계획의 Task 4와 동일하게 구현*

**Step 1: Web Crypto API 래퍼 구현**

```typescript
// src/lib/crypto/index.ts
// 기존 계획의 코드와 동일
```

**Step 2: Commit**

```bash
git add src/lib/crypto/
git commit -m "feat: add E2E encryption"
```

---

## Task 10: 빌드 및 배포 테스트

**Files:**
- Test: `npm run build`
- Test: `npm run preview`

**Step 1: 로컬 빌드 테스트**

```bash
npm run build
npm run preview
```

**Expected:** dist 디렉토리에 정적 파일 생성, http://localhost:4173에서 접속 가능

**Step 2: 개발 서버 테스트**

```bash
npm run dev
```

**Expected:** http://localhost:3000에서 개발 서버 실행

**Step 3: Netlify Functions 로컬 테스트**

```bash
npm install -g netlify-cli
netlify dev
```

**Expected:** API 엔드포인트 정상 작동

**Step 4: Commit**

```bash
git commit -m "test: verify build and deployment"
```

---

## 완료 체크리스트

- [ ] Next.js 완전 제거 확인 (package.json)
- [ ] Vite 빌드 정상 작동
- [ ] 모든 페이지 라우팅 작동
- [ ] API 서버 동작 확인
- [ ] 가족 생성 및 URL 생성 동작
- [ ] 4자리 인증코드로 가족 참여 동작
- [ ] 텍스트 메시지 전송/수신 (폴링)
- [ ] E2E 암호화 확인
- [ ] sharp 의존성 없는지 확인
- [ ] Netlify 배포 테스트

---

## 테스트 방법

```bash
# 1. 개발 서버 시작
npm run dev

# 2. Netlify Functions 포함해서 테스트
netlify dev

# 3. 프로덕션 빌드 테스트
npm run build
npm run preview

# 4. 가족 생성 테스트
# - /create 접속
# - 이름 + 4자리 코드 입력
# - 생성된 URL 복사

# 5. 가족 참여 테스트
# - 다른 브라우저/시크릿 모드에서 /invite?family=xxxxx 접속
# - 이름 + 4자리 코드 입력
# - 채팅방 입장

# 6. 메시지 전송 테스트
# - 양쪽 브라우저에서 메시지 전송
# - 3초 폴링으로 메시지 수신 확인
```

---

## 마이그레이션 완료 후 제거할 항목

- [ ] `app/` 디렉토리 (비어있으면 삭제)
- [ ] `next.config.js` (있으면 삭제)
- [ ] `@netlify/plugin-nextjs` 관련 설정

---

## 주요 변경사항 요약

| 항목 | Next.js | Vite |
|------|---------|------|
| 라우팅 | App Router | React Router |
| 빌드 | next build | vite build |
| 개발 서버 | next dev | vite |
| 페이지 구조 | app/*.tsx | src/pages/*.tsx |
| Link 컴포넌트 | next/link | react-router-dom |
| useSearchParams | next/navigation | 커스텀 훅 |
| 빌드 출력 | .next | dist |
