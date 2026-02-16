'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/stores/chat-store';
import { getP2PManager } from '@/lib/webrtc/peer';
import { getMessageQueue } from '@/lib/offline/message-queue';
import type { DataMessage } from '@/types';
import FileUploadButton from './FileUploadButton';
import FilePreview, { type FilePreviewData } from './FilePreview';

export default function MessageInput() {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<FilePreviewData[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { myPeerId, addMessage } = useChatStore();

  // 타이핑 인디케이터 전송
  useEffect(() => {
    if (!isTyping || !myPeerId) return;

    const p2pManager = getP2PManager();
    if (!p2pManager) return;

    const typingMessage: DataMessage = {
      id: crypto.randomUUID(),
      type: 'typing',
      senderId: myPeerId,
      timestamp: Date.now(),
      data: { isTyping: true },
    };

    p2pManager.broadcast(typingMessage);

    // 3초 후 타이핑 종료
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isTyping, myPeerId]);

  const handleSend = () => {
    if ((!text.trim() && attachedFiles.length === 0) || !myPeerId) return;

    // If there are files, convert them to base64 and send
    if (attachedFiles.length > 0) {
      attachedFiles.forEach(fileData => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          const messageId = crypto.randomUUID();
          const message: DataMessage = {
            id: messageId,
            type: 'text',
            senderId: myPeerId,
            timestamp: Date.now(),
            data: {
              type: 'file',
              fileName: fileData.file.name,
              fileType: fileData.file.type,
              fileData: base64,
              fileSize: fileData.file.size,
            },
            encrypted: true,
          };

          // 메시지 큐를 사용하여 전송 (오프라인 지원)
          const messageQueue = getMessageQueue();

          if (messageQueue) {
            // 메시지 큐에 등록
            messageQueue.enqueue(message);
          } else {
            // 큐가 없는 경우 기존 방식으로 P2P 직접 전송
            const p2pManager = getP2PManager();
            if (p2pManager) {
              p2pManager.broadcast(message);
            }
          }

          // IndexedDB에 메시지 저장 (UI에도 자동 추가됨)
          useChatStore.getState().saveMessage({
            id: messageId,
            senderId: myPeerId,
            content: `[파일] ${fileData.file.name}`,
            timestamp: Date.now(),
            status: 'sending',
            encrypted: true,
          });
        };
        reader.readAsDataURL(fileData.file);
      });

      // Clear attached files and revoke URLs
      attachedFiles.forEach(fileData => {
        if (fileData.preview) {
          URL.revokeObjectURL(fileData.preview);
        }
      });
      setAttachedFiles([]);
    }

    // Send text message if there's text
    if (text.trim()) {
      const messageId = crypto.randomUUID();
      const message: DataMessage = {
        id: messageId,
        type: 'text',
        senderId: myPeerId,
        timestamp: Date.now(),
        data: text,
        encrypted: true,
      };

      // 메시지 큐를 사용하여 전송 (오프라인 지원)
      const messageQueue = getMessageQueue();

      if (messageQueue) {
        // 메시지 큐에 등록
        messageQueue.enqueue(message);
      } else {
        // 큐가 없는 경우 기존 방식으로 P2P 직접 전송
        const p2pManager = getP2PManager();
        if (p2pManager) {
          p2pManager.broadcast(message);
        }
      }

      // IndexedDB에 메시지 저장 (UI에도 자동 추가됨)
      useChatStore.getState().saveMessage({
        id: messageId,
        senderId: myPeerId,
        content: text,
        timestamp: Date.now(),
        status: 'sending',
        encrypted: true,
      });
    }

    setText('');
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    // 타이핑 인디케이터 활성화
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
    }
  };

  const handleFileSelect = (file: File) => {
    // Create preview for file
    if (file.type.startsWith('image/')) {
      // Create object URL for image preview
      const preview = URL.createObjectURL(file);
      setAttachedFiles(prev => [
        ...prev,
        { file, preview, id: crypto.randomUUID() }
      ]);
    } else {
      // For non-image files, use empty preview
      setAttachedFiles(prev => [
        ...prev,
        { file, preview: '', id: crypto.randomUUID() }
      ]);
    }
  };

  const handleRemoveFile = (id: string) => {
    setAttachedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {/* File previews */}
      <FilePreview files={attachedFiles} onRemove={handleRemoveFile} />

      <div className="flex items-end gap-2">
        {/* 파일 업로드 버튼 */}
        <FileUploadButton onFileSelect={handleFileSelect} />

        {/* 텍스트 입력 */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요... (Shift+Enter로 줄바꿈)"
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 rounded-2xl resize-none focus:outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            rows={1}
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />

          {/* 암호화 표시 */}
          <div className="absolute right-3 bottom-3 text-xs text-secure-green flex items-center gap-1">
            <span className="animate-pulse">🔒</span>
            <span className="hidden sm:inline">E2E</span>
          </div>
        </div>

        {/* 전송 버튼 */}
        <button
          onClick={handleSend}
          disabled={!text.trim() && attachedFiles.length === 0}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          aria-label="메시지 전송"
        >
          <span className="hidden sm:inline">전송</span>
          <span className="text-xl">➤</span>
        </button>
      </div>
    </div>
  );
}
