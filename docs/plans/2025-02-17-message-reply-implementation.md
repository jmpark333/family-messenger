# Message Reply Feature Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add reply functionality to chat messages allowing users to quote and respond to specific messages with a modal UI on desktop and bottom sheet on mobile.

**Architecture:** Create shared Modal component and ReplyModal for composing replies, extend message data model with replyTo field, add QuotedMessage component for displaying reply references, modify ChatMessage with click/long-press handlers, and update store for reply state management.

**Tech Stack:** React, TypeScript, Zustand (state management), Tailwind CSS, Vitest (testing)

---

## Prerequisites

Read the design document:
- `docs/plans/2025-02-17-message-reply-feature-design.md`

---

## Task 1: Create Shared Modal Component

**Files:**
- Create: `src/components/shared/Modal.tsx`

**Step 1: Create Modal component with basic structure**

```typescript
// src/components/shared/Modal.tsx
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`${sizeClasses[size]} w-full mx-4 bg-white rounded-2xl shadow-xl animate-fade-in relative z-10
          md:mx-auto
          max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:rounded-t-2xl max-md:rounded-b-none max-md:mb-0
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Add animation for mobile bottom sheet**

```css
/* Add to src/app/globals.css */
@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.slide-up {
  animation: slide-up 0.3s ease-out;
}
```

**Step 3: Update Modal component to use slide-up animation on mobile**

Modify the modal div className in Modal.tsx:

```typescript
// Change the modal div className to include mobile animation:
className={`${sizeClasses[size]} w-full mx-4 bg-white rounded-2xl shadow-xl animate-fade-in relative z-10
  md:mx-auto
  max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:rounded-t-2xl max-md:rounded-b-none max-md:mb-0 max-md:slide-up
`}
```

**Step 4: Commit**

```bash
git add src/components/shared/Modal.tsx src/app/globals.css
git commit -m "feat: add responsive Modal component with mobile bottom sheet support"
```

---

## Task 2: Extend Message Type Definitions

**Files:**
- Modify: `types/index.ts`
- Modify: `src/stores/chat-store.ts`
- Modify: `src/lib/db/schema.ts`
- Modify: `src/lib/api/types.ts`

**Step 1: Add ReplyToInfo type to types/index.ts**

```typescript
// types/index.ts
export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId?: string;
  content: string;
  timestamp: number;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  encrypted: boolean;
  replyTo?: ReplyToInfo;
}

export interface ReplyToInfo {
  id: string;
  senderId: string;
  content: string;
}
```

**Step 2: Add replyTo to store Message type**

```typescript
// src/stores/chat-store.ts
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  encrypted: boolean;
  status: 'pending' | 'sent' | 'delivered';
  replyTo?: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
  };
}
```

**Step 3: Add replyTo fields to database schema**

```typescript
// src/lib/db/schema.ts
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
  replyToMessageId?: string;
  replyToContent?: string;
}
```

**Step 4: Add replyTo to API Message type**

```typescript
// src/lib/api/types.ts
export interface Message {
  id: string;
  familyId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  encrypted: boolean;
  replyTo?: {
    messageId: string;
    senderId: string;
    senderName: string;
    content: string;
  };
}
```

**Step 5: Commit**

```bash
git add types/index.ts src/stores/chat-store.ts src/lib/db/schema.ts src/lib/api/types.ts
git commit -m "feat: extend message types with reply support"
```

---

## Task 3: Add Reply State to Chat Store

**Files:**
- Modify: `src/stores/chat-store.ts`

**Step 1: Add reply state to store interface**

```typescript
// src/stores/chat-store.ts
// Add to ChatStore interface:
interface ChatStore {
  // ... existing fields ...
  replyToMessage: Message | null;
  isReplyModalOpen: boolean;
  setReplyToMessage: (message: Message) => void;
  clearReplyToMessage: () => void;
  setIsReplyModalOpen: (open: boolean) => void;
}
```

**Step 2: Implement reply state in create function**

```typescript
// Add to the store implementation:
export const useChatStore = create<ChatStore>((set, get) => ({
  // ... existing implementation ...

  replyToMessage: null,
  isReplyModalOpen: false,

  setReplyToMessage: (message) => set({ replyToMessage: message, isReplyModalOpen: true }),

  clearReplyToMessage: () => set({ replyToMessage: null, isReplyModalOpen: false }),

  setIsReplyModalOpen: (open) => set({ isReplyModalOpen: open }),
}));
```

**Step 3: Commit**

```bash
git add src/stores/chat-store.ts
git commit -m "feat: add reply state management to chat store"
```

---

## Task 4: Create QuotedMessage Component

**Files:**
- Create: `src/components/chat/QuotedMessage.tsx`

**Step 1: Create QuotedMessage component**

```typescript
// src/components/chat/QuotedMessage.tsx
import { User } from 'lucide-react';

interface QuotedMessageProps {
  originalMessage: {
    id: string;
    senderId: string;
    senderName?: string;
    content: string;
  };
  onClick?: () => void;
}

export function QuotedMessage({ originalMessage, onClick }: QuotedMessageProps) {
  const displayName = originalMessage.senderName || originalMessage.senderId.slice(0, 8);
  const truncatedContent =
    originalMessage.content.length > 50
      ? originalMessage.content.slice(0, 50) + '...'
      : originalMessage.content;

  return (
    <div
      onClick={onClick}
      className={`
        flex items-start gap-2 px-3 py-2 mb-2 rounded-lg
        bg-gray-100 border-l-4 border-blue-500
        ${onClick ? 'cursor-pointer hover:bg-gray-200 transition-colors' : ''}
      `}
    >
      <User className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-700 truncate">
          {displayName}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2">
          {truncatedContent}
        </p>
      </div>
    </div>
  );
}
```

**Step 2: Add line-clamp utility to Tailwind config if not present**

```css
/* Add to src/app/globals.css if line-clamp is not working */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

**Step 3: Commit**

```bash
git add src/components/chat/QuotedMessage.tsx src/app/globals.css
git commit -m "feat: add QuotedMessage component for displaying reply references"
```

---

## Task 5: Create ReplyModal Component

**Files:**
- Create: `src/components/chat/ReplyModal.tsx`

**Step 1: Create ReplyModal component**

```typescript
// src/components/chat/ReplyModal.tsx
import { useState, useEffect, useRef } from 'react';
import { Modal } from '../shared/Modal';
import { QuotedMessage } from './QuotedMessage';
import { Send } from 'lucide-react';

interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalMessage: {
    id: string;
    senderId: string;
    senderName?: string;
    content: string;
  };
  onSendReply: (content: string) => void;
}

export function ReplyModal({ isOpen, onClose, originalMessage, onSendReply }: ReplyModalProps) {
  const [content, setContent] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
    if (!isOpen) {
      setContent('');
      setShowConfirm(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (content.trim()) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setContent('');
    setShowConfirm(false);
    onClose();
  };

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    if (trimmed.length > 2000) {
      alert('메시지가 너무 깁니다 (최대 2000자)');
      return;
    }
    onSendReply(trimmed);
    setContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (showConfirm) {
    return (
      <Modal isOpen={isOpen} onClose={() => setShowConfirm(false)} title="답장 취소">
        <div className="space-y-4">
          <p className="text-gray-700">작성 중인 답장이 있습니다. 닫으시겠습니까?</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              계속 작성
            </button>
            <button
              onClick={handleConfirmClose}
              className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="답장">
      <div className="space-y-4">
        <QuotedMessage originalMessage={originalMessage} />

        <div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="답장을 입력하세요..."
            className="w-full min-h-[100px] max-h-[200px] p-3 border border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:outline-none"
            maxLength={2000}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {content.length}/2000
            </span>
            <span className="text-xs text-gray-400">
              Enter로 전송, Shift+Enter로 줄바꿈
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSend}
            disabled={!content.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
            전송
          </button>
        </div>
      </div>
    </Modal>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/chat/ReplyModal.tsx
git commit -m "feat: add ReplyModal component with draft protection"
```

---

## Task 6: Update ChatMessage Component

**Files:**
- Modify: `src/components/chat/ChatMessage.tsx`

**Step 1: Add new props and state to ChatMessage**

```typescript
// src/components/chat/ChatMessage.tsx
// Add to imports:
import { QuotedMessage } from './QuotedMessage';

// Add to ChatMessageProps interface:
interface ChatMessageProps {
  message: MessageType;
  isMine: boolean;
  onReplyClick?: (message: MessageType) => void; // NEW
}

// Add to component:
const [isLongPressing, setIsLongPressing] = useState(false);
const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
```

**Step 2: Add click and long-press handlers**

```typescript
// Add handlers inside ChatMessage component (before return):
const handleClick = () => {
  if (!isMine && onReplyClick) {
    onReplyClick(message);
  }
};

const handleTouchStart = () => {
  if (!isMine && onReplyClick) {
    setIsLongPressing(true);
    longPressTimerRef.current = setTimeout(() => {
      // Vibrate on mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      onReplyClick(message);
      setIsLongPressing(false);
    }, 500);
  }
};

const handleTouchEnd = () => {
  setIsLongPressing(false);
  if (longPressTimerRef.current) {
    clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  }
};

const handleTouchMove = () => {
  // Cancel long press if finger moves
  setIsLongPressing(false);
  if (longPressTimerRef.current) {
    clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  }
};

// Cleanup on unmount
useEffect(() => {
  return () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };
}, []);
```

**Step 3: Add QuotedMessage render and update message bubble**

```typescript
// Add before the message bubble in the return:
{message.replyTo && (
  <QuotedMessage
    originalMessage={{
      id: message.replyTo.id,
      senderId: message.replyTo.senderId,
      senderName: message.replyTo.senderName,
      content: message.replyTo.content,
    }}
  />
)}

// Update message-bubble div className to include hover and click states:
className={`message-bubble px-4 py-2 break-words ${
  isMine
    ? 'message-sent bg-gradient-to-br from-blue-500 to-indigo-500 text-white'
    : 'message-received bg-gray-200 text-gray-900'
} ${!isMine ? 'hover:bg-blue-50 cursor-pointer transition-colors' : ''} ${
  isLongPressing ? 'bg-blue-100' : ''
}`}

// Add event handlers to the message bubble div:
onClick={handleClick}
onTouchStart={handleTouchStart}
onTouchEnd={handleTouchEnd}
onTouchMove={handleTouchMove}
```

**Step 4: Add styling for long-press state**

```css
/* Add to src/app/globals.css if not already present */
.message-bubble {
  transition: background-color 0.15s ease;
}
```

**Step 5: Commit**

```bash
git add src/components/chat/ChatMessage.tsx src/app/globals.css
git commit -m "feat: add click/long-press handlers and reply display to ChatMessage"
```

---

## Task 7: Integrate ReplyModal into ChatPage

**Files:**
- Modify: `src/pages/ChatPage.tsx` (or equivalent main chat page)

**Step 1: Import and add ReplyModal to ChatPage**

```typescript
// Add to imports:
import { ReplyModal } from '../components/chat/ReplyModal';
import { useChatStore } from '../stores/chat-store';

// Add after the message list rendering (before MessageInput):
const { replyToMessage, isReplyModalOpen, setReplyToMessage, clearReplyToMessage } = useChatStore();

const handleReplyClick = (message: Message) => {
  setReplyToMessage(message);
};

const handleSendReply = (content: string) => {
  if (!replyToMessage) return;

  const replyMessage = {
    // ... existing message fields ...
    content,
    replyTo: {
      id: replyToMessage.id,
      senderId: replyToMessage.senderId,
      senderName: replyToMessage.senderName,
      content: replyToMessage.content,
    },
  };

  sendMessage(replyMessage);
  clearReplyToMessage();
};

// Add after MessageInput component:
{replyToMessage && (
  <ReplyModal
    isOpen={isReplyModalOpen}
    onClose={clearReplyToMessage}
    originalMessage={replyToMessage}
    onSendReply={handleSendReply}
  />
)}
```

**Step 2: Update ChatMessage props to include onReplyClick**

```typescript
// In the messages map function, add onReplyClick prop:
<ChatMessage
  key={msg.id}
  message={msg}
  isMine={msg.senderId === currentUserId}
  onReplyClick={handleReplyClick}
/>
```

**Step 3: Commit**

```bash
git add src/pages/ChatPage.tsx
git commit -m "feat: integrate ReplyModal into ChatPage with reply flow"
```

---

## Task 8: Add Scroll to Original Message Feature

**Files:**
- Modify: `src/pages/ChatPage.tsx` (or MessageList component)

**Step 1: Add scroll to message handler**

```typescript
// Add to ChatPage:
import { useRef } from 'react';

const messagesEndRef = useRef<HTMLDivElement>(null);
const messagesContainerRef = useRef<HTMLDivElement>(null);

const scrollToMessage = (messageId: string) => {
  const element = document.getElementById(`message-${messageId}`);
  if (element && messagesContainerRef.current) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Add highlight effect
    element.classList.add('message-highlight');
    setTimeout(() => {
      element.classList.remove('message-highlight');
    }, 2000);
  } else {
    toast.error('메시지를 찾을 수 없습니다');
  }
};

// Pass scrollToMessage to QuotedMessage if needed:
// In ChatMessage, when rendering QuotedMessage for own replies:
{message.replyTo && (
  <QuotedMessage
    originalMessage={message.replyTo}
    onClick={() => scrollToMessage(message.replyTo!.id)}
  />
)}
```

**Step 2: Add highlight animation**

```css
/* Add to src/app/globals.css */
@keyframes highlight-pulse {
  0%, 100% {
    background-color: transparent;
  }
  50% {
    background-color: rgba(59, 130, 246, 0.3);
  }
}

.message-highlight {
  animation: highlight-pulse 0.5s ease-in-out 3;
}
```

**Step 3: Add ref to messages container**

```typescript
// Update the messages container div:
<div
  ref={messagesContainerRef}
  className="flex-1 overflow-y-auto message-list"
>
  {/* messages */}
</div>
```

**Step 4: Add id to each message**

```typescript
// In ChatMessage or message rendering, add id prop:
<div id={`message-${message.id}`} className="message-container">
  <ChatMessage ... />
</div>
```

**Step 5: Commit**

```bash
git add src/pages/ChatPage.tsx src/components/chat/ChatMessage.tsx src/app/globals.css
git commit -m "feat: add scroll to original message with highlight effect"
```

---

## Task 9: Update API Client for Reply Support

**Files:**
- Modify: `src/lib/api/client.ts` (or equivalent)

**Step 1: Update sendMessage to include replyTo**

```typescript
// In the sendMessage function, ensure replyTo is sent:
export async function sendMessage(message: Message): Promise<void> {
  const payload = {
    familyId: message.familyId,
    senderId: message.senderId,
    senderName: message.senderName,
    content: message.content,
    timestamp: message.timestamp,
    encrypted: message.encrypted,
    replyTo: message.replyTo ? {
      messageId: message.replyTo.id,
      senderId: message.replyTo.senderId,
      senderName: message.replyTo.senderName,
      content: message.replyTo.content,
    } : undefined,
  };

  // ... rest of the function
}
```

**Step 2: Commit**

```bash
git add src/lib/api/client.ts
git commit -m "feat: update API client to send reply data"
```

---

## Task 10: Testing

**Files:**
- Create: `src/components/chat/__tests__/QuotedMessage.test.tsx`
- Create: `src/components/shared/__tests__/Modal.test.tsx`
- Create: `src/components/chat/__tests__/ReplyModal.test.tsx`

**Step 1: Create QuotedMessage tests**

```typescript
// src/components/chat/__tests__/QuotedMessage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { QuotedMessage } from '../QuotedMessage';

describe('QuotedMessage', () => {
  const mockMessage = {
    id: '123',
    senderId: 'user-12345678',
    senderName: 'Test User',
    content: 'This is a test message content',
  };

  it('renders original message correctly', () => {
    render(<QuotedMessage originalMessage={mockMessage} />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('This is a test message content')).toBeInTheDocument();
  });

  it('truncates long content', () => {
    const longMessage = {
      ...mockMessage,
      content: 'a'.repeat(100),
    };
    render(<QuotedMessage originalMessage={longMessage} />);
    const content = screen.getByText(/a+/);
    expect(content.textContent).toHaveLength(53); // 50 + '...'
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(
      <QuotedMessage originalMessage={mockMessage} onClick={handleClick} />
    );
    fireEvent.click(screen.getByText('Test User'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

**Step 2: Create Modal tests**

```typescript
// src/components/shared/__tests__/Modal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../Modal';

describe('Modal', () => {
  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <p>Modal content</p>
      </Modal>
    );
    const backdrop = screen.getByText('Modal content').parentElement?.previousElementSibling;
    fireEvent.click(backdrop!);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when ESC key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <p>Modal content</p>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
```

**Step 3: Create ReplyModal tests**

```typescript
// src/components/chat/__tests__/ReplyModal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ReplyModal } from '../ReplyModal';

describe('ReplyModal', () => {
  const mockOriginalMessage = {
    id: '123',
    senderId: 'user-123',
    senderName: 'Original Sender',
    content: 'Original message',
  };

  it('renders original message in QuotedMessage', () => {
    render(
      <ReplyModal
        isOpen={true}
        onClose={vi.fn()}
        originalMessage={mockOriginalMessage}
        onSendReply={vi.fn()}
      />
    );
    expect(screen.getByText('Original Sender')).toBeInTheDocument();
    expect(screen.getByText('Original message')).toBeInTheDocument();
  });

  it('calls onSendReply with content when send is clicked', () => {
    const handleSendReply = vi.fn();
    render(
      <ReplyModal
        isOpen={true}
        onClose={vi.fn()}
        originalMessage={mockOriginalMessage}
        onSendReply={handleSendReply}
      />
    );

    const textarea = screen.getByPlaceholderText('답장을 입력하세요...');
    fireEvent.change(textarea, { target: { value: 'Reply content' } });
    fireEvent.click(screen.getByText('전송'));

    expect(handleSendReply).toHaveBeenCalledWith('Reply content');
  });

  it('shows confirm dialog when closing with draft content', () => {
    render(
      <ReplyModal
        isOpen={true}
        onClose={vi.fn()}
        originalMessage={mockOriginalMessage}
        onSendReply={vi.fn()}
      />
    );

    const textarea = screen.getByPlaceholderText('답장을 입력하세요...');
    fireEvent.change(textarea, { target: { value: 'Draft content' } });

    // Click backdrop (close button)
    fireEvent.click(screen.getByRole('dialog').parentElement!.firstChild!);

    expect(screen.getByText('작성 중인 답장이 있습니다')).toBeInTheDocument();
  });
});
```

**Step 4: Run tests**

```bash
npm test
```

**Step 5: Commit**

```bash
git add src/components/chat/__tests__/ src/components/shared/__tests__/
git commit -m "test: add unit tests for Modal, ReplyModal, and QuotedMessage"
```

---

## Task 11: Accessibility Testing

**Files:**
- Manual testing checklist

**Step 1: Keyboard navigation test**

- [ ] Tab key focuses through modal elements
- [ ] ESC key closes modal
- [ ] Enter in textarea sends message
- [ ] Shift+Enter creates new line

**Step 2: Screen reader test**

- [ ] Modal announces "dialog" role
- [ ] Close button has aria-label="Close"
- [ ] Original message is read correctly

**Step 3: Touch target test**

- [ ] All buttons are at least 44x44px
- [ ] Long-press works on mobile
- [ ] Vibration feedback works

**Step 4: Commit accessibility fixes if needed**

```bash
git add .
git commit -m "fix: address accessibility issues"
```

---

## Task 12: Manual Testing

**Test on Desktop:**

1. Click a received message → Reply modal opens
2. Verify original message is displayed
3. Enter reply and send → Reply appears in chat with quoted message
4. Click quoted message → Scrolls to original
5. Click own message → Nothing happens
6. Hover received message → Background changes

**Test on Mobile:**

1. Long-press received message → Vibration + modal opens
2. Verify bottom sheet appears from bottom
3. Send reply → Works correctly
4. Short tap received message → Nothing happens
5. Test with draft content → Confirm dialog appears

**Fix any issues found:**

```bash
git add .
git commit -m "fix: address issues found in manual testing"
```

---

## Task 13: Final Verification

**Step 1: Run all tests**

```bash
npm test
npm run build
```

**Step 2: Check git status**

```bash
git status
git log --oneline -5
```

**Step 3: Create summary commit**

```bash
git add .
git commit -m "feat: complete message reply feature implementation

- Add responsive Modal component with bottom sheet for mobile
- Add ReplyModal with original message display and draft protection
- Add QuotedMessage component for reply references
- Extend message data model with replyTo field
- Add click/long-press handlers to ChatMessage
- Add scroll-to-original with highlight effect
- Update API client for reply data
- Add comprehensive unit tests
- Full accessibility support"
```

---

## Success Criteria

- [ ] Users can reply to received messages via click (desktop) or long-press (mobile)
- [ ] Reply modal displays original message correctly
- [ ] Replies show quoted reference in chat
- [ ] Clicking quoted message scrolls to original with highlight
- [ ] Only received messages are replyable
- [ ] Responsive design works on desktop and mobile
- [ ] Draft content is protected with confirm dialog
- [ ] All tests pass
- [ ] Accessibility requirements met
