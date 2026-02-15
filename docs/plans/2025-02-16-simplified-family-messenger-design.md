# 간소화된 가족 메신저 설계 (URL + 4자리 인증코드)

> **날짜:** 2025-02-16
> **버전:** 2.0 (간소화)

## 개요

복잡한 Firebase 시그널링과 P2P 연결을 제거하고, **URL + 4자리 인증코드** 기반의 간단한 서버 중계식 채팅으로 재설계.

### 핵심 변경사항

| 항목 | 기존 계획 | 간소화 계획 |
|------|---------|----------|
| 인증 방식 | 복잡한 토큰 검증 | URL + 4자리 코드 |
| 메시지 전송 | P2P (WebRTC) | 서버 중계 |
| 시그널링 | Firebase Realtime DB | Netlify Functions API |
| 암호화 | E2E (Signal Protocol) | E2E 유지 (간소화) |
| 방화벽 | TURN 서버 필요 | 서버 중계로 해결 |

---

## 섹션 1: 인증 플로우 (간소화)

### 가족 생성
```
1. 사용자 이름 입력
2. 4자리 인증코드 직접 입력 (예: A123)
3. "가족 만들기" 버튼 클릭
4. familyId 생성 (UUID)
5. 인증 URL 생성: https://도메인/invite?family=xxxxx
6. URL + 인증코드를 가족원에게 공유
```

### 가족원 참여
```
1. 받은 URL 클릭 → /invite 페이지
2. 사용자 이름 입력
3. 가족원에게 받은 4자리 인증코드 입력
4. "참여" 버튼 클릭
5. 서버에서 familyId + 인증코드 검증
6. 인증 성공 → /chat 페이지로 이동
```

### 인증 검증 로직
```typescript
// 서버 측 검증
function validateInvite(familyId: string, code: string): boolean {
  const family = database.getFamily(familyId);
  return family && family.authCode === code;
}
```

---

## 섹션 2: 아키텍처 (간소화)

### 데이터 흐름
```
[사용자 A] → [Netlify Function] → [Database] → [Netlify Function] → [사용자 B]
                     ↓
              E2E 암호화/복호화
```

### 컴포넌트 구조
```
/pages
├── / (메인 페이지)
│   ├── "새 가족 만들기" 버튼
│   └── "초대장으로 참여" 버튼
│
├── /invite?family=xxxxx (초대 페이지)
│   ├── 이름 입력
│   ├── 4자리 코드 입력
│   └── 참여 버튼
│
└── /chat (채팅방)
    ├── 메시지 목록
    ├── 메시지 입력
    └── 나가기 버튼

/api
├── /api/family/create (가족 생성)
├── /api/family/join (가족 참여)
├── /api/messages/send (메시지 전송)
└── /api/messages/poll (메시지 수신)

/lib
├── /db (IndexedDB 래퍼)
├── /crypto (E2E 암호화)
└── /api (API 클라이언트)
```

---

## 섹션 3: 데이터베이스 구조

### IndexedDB (클라이언트)
```typescript
// family-messenger DB
{
  families: {
    key: 'familyId',
    data: {
      id: string,
      authCode: string,  // 4자리 코드
      myMemberId: string,
      myName: string,
      publicKey: string,
      privateKey: string
    }
  },
  messages: {
    key: 'messageId',
    index: 'timestamp',
    data: {
      id: string,
      senderId: string,
      senderName: string,
      content: string,  // 암호화됨
      timestamp: number,
      encrypted: true
    }
  }
}
```

### 서버 저장소 (간단한 JSON 파일 또는 Netlify Blobs)
```typescript
// families/{familyId}.json
{
  "id": "uuid",
  "authCode": "A123",
  "members": [
    { "id": "uuid", "name": "철수", "publicKey": "..." },
    { "id": "uuid", "name": "영희", "publicKey": "..." }
  ],
  "createdAt": 1234567890
}

// messages/{familyId}.json
[
  { "id": "uuid", "senderId": "...", "content": "encrypted...", "timestamp": 1234567890 }
]
```

---

## 섹션 4: E2E 암호화 (간소화)

### 키 교환
```typescript
// 가족 생성 시
const keyPair = await generateKeyPair(); // Web Crypto API
await saveToIndexedDB('myKeys', keyPair);

// 가족 참여 시
const myKeyPair = await generateKeyPair();
const familyPublicKey = await getFromServer(familyId, 'publicKey');
```

### 메시지 암호화
```typescript
// 전송 전
const encrypted = await encrypt(message, recipientPublicKey);
await sendToServer(encrypted);

// 수신 후
const decrypted = await decrypt(encrypted, myPrivateKey);
```

---

## 섹션 5: 구현 우선순위

### Phase 1: 인증 시스템
- [ ] 메인 페이지 UI
- [ ] 가족 생성 API (Netlify Function)
- [ ] 가족 참여 API (Netlify Function)
- [ ] 4자리 코드 검증 로직

### Phase 2: 채팅 기능
- [ ] 메시지 전송 API
- [ ] 메시지 폴링 API (또는 SSE)
- [ ] IndexedDB 메시지 저장
- [ ] 채팅 UI

### Phase 3: E2E 암호화
- [ ] Web Crypto API 래퍼
- [ ] 키 생성 및 저장
- [ ] 메시지 암호화/복호화

### Phase 4: 폴리시
- [ ] 에러 핸들링
- [ ] 로딩 상태
- [ ] 접근성 개선

---

## 섹션 6: API 명세

### POST /api/family/create
```typescript
Request: { name: string, authCode: string }
Response: { familyId: string, inviteUrl: string }
```

### POST /api/family/join
```typescript
Request: { familyId: string, name: string, authCode: string }
Response: { success: boolean, error?: string }
```

### POST /api/messages/send
```typescript
Request: { familyId: string, senderId: string, content: string, encrypted: boolean }
Response: { success: boolean, messageId: string }
```

### GET /api/messages/poll
```typescript
Request: ?familyId=xxx&lastTimestamp=123
Response: { messages: Message[] }
```

---

## 기술 스택

| 항목 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS 4 |
| 상태 관리 | Zustand |
| API | Netlify Functions |
| 로컬 저장 | IndexedDB (Dexie.js) |
| 암호화 | Web Crypto API |
| 배포 | Netlify |

---

## 보안 고려사항

1. **인증코드**: 4자리지만 가족 ID와 함께 사용
2. **E2E 암호화**: 서버가 메시지 내용을 볼 수 없음
3. **HTTPS**: 모든 통신은 HTTPS로 암호화
4. ** rate Limiting**: API 요청 횟수 제한
