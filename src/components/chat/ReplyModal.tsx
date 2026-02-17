'use client';

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import { Modal } from '../shared/Modal';
import { QuotedMessage } from './QuotedMessage';
import { ReplyToInfo } from '../../../types/index';

interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalMessage: ReplyToInfo;
  onSendReply: (content: string, replyToId: string) => Promise<void>;
}

const MAX_CHARACTERS = 2000;

export function ReplyModal({
  isOpen,
  onClose,
  originalMessage,
  onSendReply,
}: ReplyModalProps) {
  const [replyText, setReplyText] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const focusRestoredRef = useRef(false);

  // Reset state when modal opens or original message changes
  useEffect(() => {
    if (isOpen) {
      setReplyText('');
      setShowConfirmDialog(false);
      setIsSending(false);
      setSendError(null);
      focusRestoredRef.current = false;
    }
  }, [isOpen, originalMessage.id]);

  // Handle focus management separately from modal's focus trap
  useEffect(() => {
    if (isOpen && !focusRestoredRef.current) {
      // Use requestAnimationFrame to avoid conflicts with Modal's focus trap
      const request = requestAnimationFrame(() => {
        textareaRef.current?.focus();
        focusRestoredRef.current = true;
      });
      return () => cancelAnimationFrame(request);
    }
  }, [isOpen]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(
        Math.max(textareaRef.current.scrollHeight, 100),
        200
      );
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [replyText]);

  const handleSend = useCallback(async () => {
    const trimmedText = replyText.trim();
    if (!trimmedText || isSending) return;

    setIsSending(true);
    setSendError(null);

    try {
      await onSendReply(trimmedText, originalMessage.id);
      handleClose();
    } catch (error) {
      console.error('Failed to send reply:', error);
      setSendError(error instanceof Error ? error.message : 'Failed to send reply. Please try again.');
      setIsSending(false);
    }
  }, [replyText, isSending, onSendReply, originalMessage.id]);

  const handleClose = useCallback(() => {
    if (replyText.trim() && !showConfirmDialog) {
      // Show confirmation dialog if there's unsaved content
      setShowConfirmDialog(true);
    } else {
      // Close immediately if no content or already confirming
      onClose();
    }
  }, [replyText, showConfirmDialog, onClose]);

  const handleConfirmClose = useCallback(() => {
    setShowConfirmDialog(false);
    onClose();
  }, [onClose]);

  const handleCancelClose = useCallback(() => {
    setShowConfirmDialog(false);
    setSendError(null);
    // Refocus the textarea
    const request = requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
    return () => cancelAnimationFrame(request);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (replyText.trim() && !isSending) {
        handleSend();
      }
    }
    // ESC to close
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    }
  }, [replyText, isSending, handleSend, handleClose]);

  const characterCount = replyText.length;
  const isNearLimit = characterCount > MAX_CHARACTERS * 0.9;
  const isAtLimit = characterCount >= MAX_CHARACTERS;
  const canSend = replyText.trim().length > 0 && !isAtLimit && !isSending;

  // Normal mode render
  if (!showConfirmDialog) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="답장" size="lg">
        <div className="space-y-4">
          {/* Original message preview */}
          <div className="border-b border-gray-200 pb-4">
            <QuotedMessage originalMessage={originalMessage} />
          </div>

          {/* Reply input */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="답장을 입력하세요..."
              className={`
                w-full px-4 py-3 rounded-xl border-2 resize-none
                focus:outline-none transition-colors
                ${
                  isAtLimit
                    ? 'border-red-300 bg-red-50 focus:border-red-500'
                    : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white'
                }
              `}
              style={{ minHeight: '100px', maxHeight: '200px' }}
              maxLength={MAX_CHARACTERS}
              aria-label="답장 입력"
              aria-describedby="character-count"
            />

            {/* Character counter with ARIA live region */}
            <div
              id="character-count"
              className={`
                absolute bottom-2 right-2 text-xs font-medium
                ${isNearLimit ? (isAtLimit ? 'text-red-600' : 'text-orange-600') : 'text-gray-500'}
              `}
              aria-live="polite"
              aria-atomic="true"
            >
              {characterCount} / {MAX_CHARACTERS}
            </div>
          </div>

          {/* Error message */}
          {sendError && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              role="alert"
              aria-live="assertive"
            >
              {sendError}
            </div>
          )}

          {/* Help text */}
          <p className="text-xs text-gray-500">
            Enter로 전송, Shift+Enter로 줄바꿈
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleClose}
              disabled={isSending}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={`
                px-6 py-2 rounded-lg font-semibold text-white
                bg-gradient-to-r from-blue-500 to-indigo-600
                hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                transition-all transform active:scale-95
              `}
              aria-label="답장 전송"
            >
              {isSending ? '전송 중...' : '전송'}
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  // Confirmation dialog render
  return (
    <Modal isOpen={isOpen} onClose={handleCancelClose} title="작성 중인 내용 삭제" size="sm">
      <div className="space-y-4">
        <p className="text-gray-700">
          작성 중인 답장 내용이 삭제됩니다. 정말 닫으시겠습니까?
        </p>

        {/* Preview of what will be lost */}
        {replyText.trim() && (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-sm text-gray-600 line-clamp-3">
              {replyText.trim()}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleCancelClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            계속 작성
          </button>
          <button
            onClick={handleConfirmClose}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
          >
            삭제하고 닫기
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ReplyModal;
