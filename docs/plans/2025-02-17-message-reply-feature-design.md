# Message Reply Feature Design

**Date:** 2025-02-17
**Status:** Approved
**Approach:** Complete UI/UX Implementation (Option 1)

## Overview

Add a reply feature that allows users to reply to specific messages in the chat. When a user clicks (desktop) or long-presses (mobile) a received message, a modal opens showing the original message and allowing them to compose a reply. Replies are displayed in the chat with a quoted reference to the original message.

## Requirements

1. Clicking a received message opens a reply modal
2. Modal displays original message content
3. Reply messages show the original message in a quoted format
4. Hover effect on desktop to indicate clickable messages
5. Only received messages (not own messages) can be replied to
6. Mobile support with long-press and bottom sheet UI

## Architecture

### Component Hierarchy

```
ChatPage
├── ChatHeader
├── MessageList
│   └── ChatMessage
│       └── QuotedMessage (for reply messages)
├── MessageInput
└── Modal (shared)
    └── ReplyModal
```

### State Management (Zustand Store)

Add to `chat-store.ts`:
- `replyToMessage: Message | null` - Currently being replied to
- `isReplyModalOpen: boolean` - Modal open state
- `setReplyToMessage(message)` - Set reply target
- `clearReplyToMessage()` - Clear reply target

## Components

### 1. Modal Component (New)

**File:** `src/components/shared/Modal.tsx`

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
```

Features:
- Backdrop click to close
- ESC key to close
- Focus trap (accessibility)
- Animation: fade-in + scale
- z-index: 50

### 2. ReplyModal Component (New)

**File:** `src/components/chat/ReplyModal.tsx`

```typescript
interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalMessage: Message;
  onSendReply: (content: string) => void;
}
```

Layout:
```
┌────────────────────────────────────┐
│  답장                               │
├────────────────────────────────────┤
│  ┌──────────────────────────────┐  │
│  │ 👤 SenderName                │  │ ← Original message (read-only)
│  │ Original content...          │  │
│  └──────────────────────────────┘  │
├────────────────────────────────────┤
│  [Reply input]                     │
│  [              ]        [Send]    │
└────────────────────────────────────┘
```

### 3. QuotedMessage Component (New)

**File:** `src/components/chat/QuotedMessage.tsx`

```typescript
interface QuotedMessageProps {
  originalMessage: Message;
  onClick?: () => void; // Scroll to original
}
```

Style:
- Gray background, blue left border (quote indicator)
- Sender name (bold)
- Message content (max 2 lines, ellipsis)
- Clickable (pointer cursor)

### 4. ChatMessage Component (Modified)

**File:** `src/components/chat/ChatMessage.tsx`

Changes:
- Add `replyTo` prop (optional)
- Add `onClick` handler (for received messages only)
- Add hover effect
- Render QuotedMessage at top if reply message

## Data Model

### Type Extensions

**File:** `types/index.ts`

```typescript
export interface ChatMessage {
  // ... existing fields ...
  replyTo?: ReplyToInfo;
}

export interface ReplyToInfo {
  id: string;      // Original message ID
  senderId: string; // Original sender ID
  content: string;  // Original content
}
```

**File:** `src/stores/chat-store.ts`

```typescript
interface Message {
  // ... existing fields ...
  replyTo?: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
  };
}
```

**File:** `src/lib/db/schema.ts`

```typescript
export interface MessageSchema {
  // ... existing fields ...
  replyToMessageId?: string;
  replyToContent?: string;
}
```

## UI/UX Design

### Responsive Layout

**Desktop (768px+):**
- Modal centered on screen (max-width: 500px)
- Click to open reply modal
- Hover effect with cursor change

**Mobile (<768px):**
- Bottom sheet from bottom of screen
- Long-press to open reply modal
- Haptic feedback on long-press

### Interactions

| Device | Trigger | Action |
|--------|---------|--------|
| Desktop | Click received message | Open reply modal |
| Desktop | Hover message | Background color change, pointer cursor |
| Mobile | Long-press received message | Open reply modal + vibration |
| Mobile | Short tap | No action (prevent accidental) |

### Touch States

**Desktop hover:**
```css
.message-bubble:hover {
  background-color: rgba(59, 130, 246, 0.1);
  cursor: pointer;
}
```

**Mobile long-press:**
```css
.message-bubble.long-pressing {
  background-color: rgba(59, 130, 246, 0.2);
}
```

## Data Flow

### Reply Send Flow

1. User clicks/long-presses received message
2. ChatMessage: onClick/onLongPress handler executes
3. chatStore.setReplyToMessage(message)
4. ReplyModal opens (isOpen = true)
5. User enters reply and clicks send
6. ReplyModal: onSendReply(content) called
7. ChatPage: creates reply message with replyTo
8. chatStore.saveMessage(messageWithReply)
9. API: POST /send-message (with replyTo)
10. chatStore.clearReplyToMessage()
11. ReplyModal closes
12. MessageList adds reply with QuotedMessage

### Scroll to Original Flow

1. User clicks QuotedMessage
2. QuotedMessage: onClick handler executes
3. MessageList: scrollToMessage(originalMessageId)
4. Find message element by ID
5. scrollIntoView({ behavior: 'smooth', block: 'center' })
6. Highlight original message (temporary effect)

## Error Handling

| Scenario | Handling | User Feedback |
|----------|----------|---------------|
| No network | Retry (3x) | Toast: "Check network connection" |
| API error (5xx) | Show failed status | Toast: "Failed to send message" |
| Auth expired | Redirect to login | Toast: "Please login again" |
| Original message deleted | Send without replyTo | Toast: "Original deleted. Sending as regular message" |
| Original not found | Show QuotedMessage only | Toast: "Message not found" on click |

### Validation

```typescript
const validateReply = (content: string): { valid: boolean; error?: string } => {
  if (!content.trim()) {
    return { valid: false, error: 'Enter message content' };
  }
  if (content.length > 2000) {
    return { valid: false, error: 'Message too long (max 2000 chars)' };
  }
  return { valid: true };
};
```

### Modal Close with Draft

```typescript
const handleReplyModalClose = () => {
  if (draftContent.trim()) {
    if (confirm('Discard reply in progress?')) {
      clearReplyToMessage();
      setDraftContent('');
    }
  } else {
    clearReplyToMessage();
  }
};
```

## Testing

### Unit Tests

- Modal: open/close state, backdrop click, ESC key, focus trap
- ReplyModal: original display, validation, send handler
- QuotedMessage: info display, click handler, text ellipsis
- ChatMessage: QuotedMessage render, click handler (received only)

### Integration Scenarios

1. Basic reply flow (click → modal → send → display)
2. Mobile long-press (vibration + bottom sheet)
3. Scroll to original (click QuotedMessage)
4. Own message click prevention
5. Reply cancel (confirm draft discard)

### Accessibility

- Keyboard navigation (Tab, Enter, ESC)
- Screen reader announcements (ARIA labels)
- Touch target size (min 44x44px)
- Color contrast (WCAG AA)

## Implementation Files

New files:
- `src/components/shared/Modal.tsx`
- `src/components/chat/ReplyModal.tsx`
- `src/components/chat/QuotedMessage.tsx`

Modified files:
- `src/components/chat/ChatMessage.tsx`
- `src/stores/chat-store.ts`
- `types/index.ts`
- `src/lib/db/schema.ts`
- `src/lib/api/types.ts`

## Success Criteria

- [ ] Users can reply to received messages via click (desktop) or long-press (mobile)
- [ ] Reply modal displays original message correctly
- [ ] Replies show quoted reference in chat
- [ ] Clicking quoted message scrolls to original
- [ ] Only received messages are replyable
- [ ] Responsive design works on desktop and mobile
- [ ] Error handling covers edge cases
