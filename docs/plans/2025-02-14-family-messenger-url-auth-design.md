# 가족 URL 기반 인증 메신저 설계

## 개요

가족끼리만 메시지와 파일을 주고받을 수 있는 보안 메신저 앱. URL 기반 인증, 브라우저 전용 저장, E2E 암호화를 특징으로 함.

### 요구사항 요약
| 항목 | 내용 |
|------|------|
| 인증 방식 | 가족 URL 공유 (카카오톡 등) |
| 저장소 | IndexedDB만 (서버 저장 없음) |
| 파일 전송 | 이미지/PDF 등 (10MB 제한) |
| 가족 규모 | 최대 4명 |
| URL 만료 | 24시간 |
| 암호화 | E2E (Signal Protocol) |
| 파일 미리보기 | 이미지: O, PDF/기타: X |

---

## 섹션 1: 인증 플로우

### 가족 생성 ("가족 만들기")
1. 사용자가 메인 페이지 접속
2. "새 가족 만들기" 버튼 클릭
3. 사용자 이름 입력 후 확인
4. Firebase에 새 가족 도큐먼트 생성:
   - `familyId`: UUID
   - `members`: [{ id, name, publicKey, joinedAt }]
   - `createdAt`: timestamp
   - `maxMembers`: 4
5. 인증 URL 생성: `https://도메인/auth?family=xxxxx&token=yyyyy`
6. QR 코드 + 카카오톡 공유 버튼 표시

### 가족원 참여 (URL 클릭)
1. 받은 URL 클릭
2. 토큰 검증 (Firebase 서버에서)
3. 가족 정보 확인:
   - 최대 인원(4명) 체크
   - URL 만료(24시간) 체크
4. 사용자 이름 입력
5. E2E 키 교환 (Signal Protocol)
6. `/chat` 경민으로 리다이렉트

### 인증 상태 유지
- `sessionStorage`: 세션 동안만 (브라우저 닫으면 소실)
- `localStorage` 선택옵션: "다음에도 이 이름으로" 체크박스

---

## 섹션 2: 저장소 아키텍처

### IndexedDB 구조 (family-messenger DB)
```
Object Stores:
├── messages         // 메시지 저장
│   ├── key: id (UUID)
│   ├── index: timestamp
│   └── schema: { id, senderId, senderName, content, timestamp, type, encrypted, file?, status }
│
├── files           // 파일 저장 (10MB 미만)
│   ├── key: id (UUID)
│   ├── index: messageId
│   └── schema: { id, messageId, name, type, size, data (Blob) }
│
├── family          // 가족 정보 저장
│   ├── key: familyId
│   └── schema: { id, myMemberId, myName, keys, joinedAt }
│
└── members         // 가족원 정보
    ├── key: memberId
    └── schema: { id, name, publicKey, connected?, lastSeen }
```

### Firebase Realtime Database (시그널링용)
```
/families/{familyId}
├── signaling       // P2P 시그널링
│   └── {memberId}: { offer/answer/iceCandidates... }
├── messages        // 전달만 하고 저장 안 함 (TTL: 1분)
└── presence        // 온라인 상태
    └── {memberId}: { online?, lastSeen, typing? }
```

### 데이터 플로우
- 메시지 전송: 로컬 IndexedDB → Firebase 시그널링 (임시) → 수신자 IndexedDB
- Firebase 메시지는 1분 후 자동 삭제 (Cloud Functions이나 규칙으로)

---

## 섹션 3: 메시지 & 파일 플로우

### 텍스트 메시지 전송
```
1. 사용자 입력 → MessageInput 커폀넌트
2. 로컬 IndexedDB에 즉시 저장 (status: 'pending')
3. E2E 암호화 (Signal Protocol)
4. Firebase 시그널링에 게시
5. 수신자가 Firebase에서 수신 → 복호화 → IndexedDB 저장
6. 상태 업데이트 (status: 'delivered')
```

### 파일 전송 (10MB 미만)
```
1. 사용자가 파일 선택
2. 용량/타입 검증
3. 로컬 IndexedDB.files에 저장
4. 파일 메시지 생성:
   {
     type: 'file',
     file: { id, name, type, size, encryptedThumbnail? }
   }
5. P2P(WebRTC DataChannel)로 Blob 직접 전송
6. 수신자 IndexedDB.files에 저장
7. 파일 메시지 전송 완료 알림
```

### 파일 수신 단계
- **이미지**: 썸네일 미리보기 (클릭하면 전체)
- **PDF/기타**: 다운로드 버튼 + 파일명/크기 표시

### 메시지 목록 로딩
- 최신 100개씩 페이징 (무한 스크롤)
- scrollTop 0에 도달하면 다음 100개 로드

---

## 섹션 4: 커폀넌트 구조

### 페이지 구조
```
/ (root)
├── /auth          // 인증 & 가족 생성
│   ├── CreateFamilyPage    // "새 가족 만들기"
│   ├── JoinFamilyPage      // URL 클릭 후 리다이렉트
│   └── ShareUrlModal      // QR 코드, 공유 버튼
│
├── /chat          // 메인 채팅 (인증 필요)
│   └── page.tsx
└── /api           // API Routes (Netlify Functions)
    └── auth/verify-token.ts   // 토큰 검증
```

### 주요 커폀넌트
```
components/
├── auth/
│   ├── CreateFamilyForm    // 이름 입력, 가족 생성
│   ├── JoinFamilyForm      // 이름 입력, 참여 완료
│   └── ShareInviteUrl     // QR, 카카오톡 공유
│
├── chat/
│   ├── ChatContainer       // 메인 채팅 영역
│   ├── MessageList         // 메시지 목록 (무한 스크롤)
│   ├── ChatMessage         // 개별 메시지 (텍스트/파일)
│   ├── MessageInput        // 입력 + 파일 업로드 버튼
│   ├── FilePreview         // 이미지 미리보기
│   ├── FileDownloadBtn     // PDF/기타 다운로드
│   └── TypingIndicator     // "입력 중..." 표시
│
├── family/
│   ├── FamilyHeader        // 가족명, 온라인 인원
│   ├── MemberList          // 가족원 목록 (슬라이드/모달)
│   └── LeaveFamilyModal    // 나가기 확인
│
└── shared/
    ├── Toaster             // 알림 메시지
    └── ConfirmDialog       // 확인 다이얼로그
```

---

## 섹션 5: 에러 핸들링 & 경계 케이스

### 인증 관련 에러
| 상황 | 처리 |
|------|------|
| URL 만료 (24시간 경과) | "만료된 초대장입니다. 가족원에게 새 URL 요청하세요" |
| 가족 정원 (4명) 초과 | "가족이 가득찼습니다 (최대 4명)" |
| 이미 가족에 있는 사용자 | "이미 가족원입니다. 채팅방으로 이동합니다" → 리다이렉트 |
| 토큰 위조/변조 | "유효하지 않은 초대장입니다" |
| 가족 삭제됨 | "존재하지 않는 가족입니다" |

### 파일 전송 에러
| 상황 | 처리 |
|------|------|
| 10MB 초과 | "10MB 이상 파일은 전송할 수 없습니다" |
| 지원하지 않는 타입 | "지원하지 않는 파일 형식입니다" |
| P2P 연결 실패 | "파일 전송을 위한 연결에 실패했습니다. 다시 시도하세요" |
| 수신 거부/연결 끺김 | "파일 전송이 중단되었습니다" |

### 네트워크 에러
| 상황 | 처리 |
|------|------|
| Firebase 연결 끺김 | "오프라인 모드입니다. 인터넷 연결을 확인하세요" + 재연결 시도 |
| P2P 연결 실패 | "메시지를 전송할 수 없습니다. 재연결 중..." |
| IndexedDB 권한 거부 | "로컬 저장소 접근이 거부되었습니다. 브라우저 설정을 확인하세요" |

### 복구 메커니즘
- Firebase 연결: 자동 재연결 (exponential backoff)
- P2P 연결: 시그널링 다시 시도
- 메시지 전송 실패: 재시용 큐 (최대 3회)

---

## 섹션 6: 보안 고려사항

### E2E 암호화 (Signal Protocol 유지)
- X3DH 키 교환: 가족원 참여 시 자동 수행
- Double Ratchet: 각 메시지마다 키 로테이션
- AXolotl: 수신자 오프라인이어도 메시지 수신 가능

### 인증 토큰 보안
- Firebase Custom Token: 24시간 TTL
- URL 토큰: UUID + 난수 + 서명 (HMAC)
- 한 번 사용 시 무효화 (replay attack 방지)

### 파일 보안
- 파일 내용도 E2E 암호화 후 P2P 전송
- 수신 후 IndexedDB에 암호화된 상태로 저장
- 썸네일만 평문 (but 블러 처리 가능)

### 저장소 보안
- IndexedDB: 브라우저 보안 정책 따름 (same-origin만 접근)
- Clear on logout: 선택사항 (체크박스)
- `Private Browsing` 모드 경고: "시크릿 모드에서는 데이터가 유실될 수 있습니다"

### 기타
- CSP (Content Security Policy): inline script 차단
- HTTPS 강제 (production)
- Referrer-Policy: no-referrer

---

## 기술 스택

| 항목 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS 4 |
| 상태 관리 | Zustand |
| P2P | WebRTC (PeerJS) |
| 암호화 | Signal Protocol (libsignal) |
| 시그널링 | Firebase Realtime DB |
| 로컬 저장 | IndexedDB (Dexie.js wrapper) |
| 배포 | Netlify |

---

## 구현 우선순위

1. **Phase 1: 인증 시스템**
   - 가족 생성 페이지
   - URL 생성 및 공유
   - 토큰 검증 API
   - E2E 키 교환

2. **Phase 2: 저장소 계층**
   - IndexedDB 래퍼
   - Firebase 시그널링 연동

3. **Phase 3: 채팅 기능**
   - 메시지 전송/수신
   - 메시지 목록 페이징

4. **Phase 4: 파일 전송**
   - 파일 선택 및 검증
   - P2P 파일 전송
   - 미리보기/다운로드

5. **Phase 5: 폴리쉬**
   - 에러 핸들링
   - 로딩 상태
   - 오프라인 모드
