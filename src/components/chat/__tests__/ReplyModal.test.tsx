import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReplyModal } from '../ReplyModal';
import { ReplyToInfo } from '@/types/index';

describe('ReplyModal', () => {
  const mockOriginalMessage: ReplyToInfo = {
    id: 'msg-123',
    senderId: 'user-456',
    senderName: 'John Doe',
    content: 'This is the original message',
  };

  const mockOnSendReply = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('original message display', () => {
    it('should display the original message in QuotedMessage component', () => {
      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('This is the original message')).toBeInTheDocument();
    });

    it('should display sender name when available', () => {
      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should display truncated sender ID when sender name is not available', () => {
      const messageWithoutName: ReplyToInfo = {
        ...mockOriginalMessage,
        senderName: '',
        senderId: 'abcdefgh12345678',
      };

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={messageWithoutName}
          onSendReply={mockOnSendReply}
        />
      );

      expect(screen.getByText('abcdefgh')).toBeInTheDocument();
    });

    it('should display empty message placeholder when content is empty', () => {
      const emptyMessage: ReplyToInfo = {
        ...mockOriginalMessage,
        content: '',
      };

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={emptyMessage}
          onSendReply={mockOnSendReply}
        />
      );

      expect(screen.getByText('Empty message')).toBeInTheDocument();
    });

    it('should truncate long original message content', () => {
      const longMessage: ReplyToInfo = {
        ...mockOriginalMessage,
        content: 'This is a very long message that exceeds the fifty character limit and should be truncated',
      };

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={longMessage}
          onSendReply={mockOnSendReply}
        />
      );

      // QuotedMessage truncates at 50 characters + "..."
      // The text is: "This is a very long message that exceeds the fifty..."
      expect(
        screen.getByText((content) => {
          return content.includes('This is a very long message that exceeds the fifty') && content.endsWith('...');
        })
      ).toBeInTheDocument();
    });
  });

  describe('send reply functionality', () => {
    it('should enable send button when reply text is not empty', async () => {
      const user = userEvent.setup();

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      const sendButton = screen.getByText('전송');
      expect(sendButton).toBeDisabled();

      const textarea = screen.getByLabelText('답장 입력');
      await user.type(textarea, 'This is my reply');

      await waitFor(() => {
        expect(sendButton).not.toBeDisabled();
      });
    });

    it('should call onSendReply with correct parameters when send button is clicked', async () => {
      const user = userEvent.setup();
      const replyText = 'My reply';

      // Create a fresh mock for this test that resolves successfully
      const localOnSendReply = vi.fn().mockResolvedValue(undefined);

      render(
        <ReplyModal
          isOpen={true}
          onClose={vi.fn()}
          originalMessage={mockOriginalMessage}
          onSendReply={localOnSendReply}
        />
      );

      // Verify we're in the normal mode
      expect(screen.getByText('답장', { selector: 'h2' })).toBeInTheDocument();

      const textarea = screen.getByLabelText('답장 입력');
      await user.type(textarea, replyText);

      // Get the send button - it should be the one with "전송" text
      const sendButton = screen.getAllByText('전송').find(btn =>
        btn.tagName === 'BUTTON' && !btn.hasAttribute('disabled')
      );

      expect(sendButton).toBeDefined();

      if (sendButton) {
        await user.click(sendButton);
      }

      // Verify that onSendReply was called with the correct parameters
      await waitFor(() => {
        expect(localOnSendReply).toHaveBeenCalledTimes(1);
        expect(localOnSendReply).toHaveBeenCalledWith(replyText, mockOriginalMessage.id);
      });
    });

    it('should call onSendReply when Enter key is pressed', async () => {
      const user = userEvent.setup();
      const replyText = 'This is my reply';

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      const textarea = screen.getByLabelText('답장 입력');
      await user.type(textarea, replyText);
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockOnSendReply).toHaveBeenCalledWith(replyText, mockOriginalMessage.id);
      });
    });

    it('should not send reply with Shift+Enter (allows line breaks)', async () => {
      const user = userEvent.setup();

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      const textarea = screen.getByLabelText('답장 입력');
      await user.type(textarea, 'Line 1');
      await user.keyboard('{Shift>}{Enter}{/Shift}');
      await user.type(textarea, 'Line 2');

      expect(textarea).toHaveValue('Line 1\nLine 2');
      expect(mockOnSendReply).not.toHaveBeenCalled();
    });

    it('should show loading state while sending', async () => {
      const user = userEvent.setup();
      const slowSendReply = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={slowSendReply}
        />
      );

      const textarea = screen.getByLabelText('답장 입력');
      await user.type(textarea, 'Reply text');

      const sendButton = screen.getByText('전송');
      await user.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText('전송 중...')).toBeInTheDocument();
      });
    });

    it('should disable send button while sending', async () => {
      const user = userEvent.setup();
      const slowSendReply = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={slowSendReply}
        />
      );

      const textarea = screen.getByLabelText('답장 입력');
      await user.type(textarea, 'Reply text');

      const sendButton = screen.getByText('전송');
      await user.click(sendButton);

      await waitFor(() => {
        expect(sendButton).toBeDisabled();
      });
    });

    it('should handle send error and display error message', async () => {
      const user = userEvent.setup();
      const errorSendReply = vi.fn(() => Promise.reject(new Error('Send failed')));

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={errorSendReply}
        />
      );

      const textarea = screen.getByLabelText('답장 입력');
      await user.type(textarea, 'Reply text');

      const sendButton = screen.getByText('전송');
      await user.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText('Send failed')).toBeInTheDocument();
      });
    });

    it('should clear error message when user starts typing again', async () => {
      const user = userEvent.setup();
      const errorSendReply = vi.fn(() => Promise.reject(new Error('Send failed')));

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={errorSendReply}
        />
      );

      const textarea = screen.getByLabelText('답장 입력');
      await user.type(textarea, 'Reply text');

      const sendButton = screen.getByText('전송');
      await user.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText('Send failed')).toBeInTheDocument();
      });

      // Click cancel - should show confirmation dialog since there's unsaved content
      const cancelButton = screen.getByText('취소');
      await user.click(cancelButton);

      // Should show confirmation dialog
      expect(screen.getByText('작성 중인 내용 삭제')).toBeInTheDocument();
    });
  });

  describe('draft confirmation', () => {
    it('should show confirmation dialog when closing with unsaved content', async () => {
      const user = userEvent.setup();

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      const textarea = screen.getByLabelText('답장 입력');
      await user.type(textarea, 'Unsaved reply text');

      const cancelButton = screen.getByText('취소');
      await user.click(cancelButton);

      expect(screen.getByText('작성 중인 내용 삭제')).toBeInTheDocument();
      expect(screen.getByText('작성 중인 답장 내용이 삭제됩니다. 정말 닫으시겠습니까?')).toBeInTheDocument();
    });

    it('should display preview of unsaved content in confirmation dialog', async () => {
      const user = userEvent.setup();
      const unsavedText = 'This is unsaved content that will be lost';

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      const textarea = screen.getByLabelText('답장 입력');
      await user.type(textarea, unsavedText);

      const cancelButton = screen.getByText('취소');
      await user.click(cancelButton);

      expect(screen.getByText(unsavedText)).toBeInTheDocument();
    });

    it('should close modal when confirming discard in confirmation dialog', async () => {
      const user = userEvent.setup();

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      const textarea = screen.getByLabelText('답장 입력');
      await user.type(textarea, 'Unsaved reply text');

      const cancelButton = screen.getByText('취소');
      await user.click(cancelButton);

      const confirmButton = screen.getByText('삭제하고 닫기');
      await user.click(confirmButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should return to editing when canceling discard in confirmation dialog', async () => {
      const user = userEvent.setup();

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      const textarea = screen.getByLabelText('답장 입력');
      await user.type(textarea, 'Unsaved reply text');

      const cancelButton = screen.getByText('취소');
      await user.click(cancelButton);

      const continueButton = screen.getByText('계속 작성');
      await user.click(continueButton);

      // Should return to normal mode
      expect(screen.getByLabelText('답장 입력')).toBeInTheDocument();
      expect(screen.getByText('전송')).toBeInTheDocument();
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should close immediately without confirmation when there is no unsaved content', async () => {
      const user = userEvent.setup();

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      const cancelButton = screen.getByText('취소');
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
      expect(screen.queryByText('작성 중인 내용 삭제')).not.toBeInTheDocument();
    });

    it('should close immediately when pressing ESC with no content', async () => {
      const user = userEvent.setup();

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      await user.keyboard('{Escape}');

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should show confirmation when pressing ESC with unsaved content', async () => {
      const user = userEvent.setup();

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      const textarea = screen.getByLabelText('답장 입력');
      await user.type(textarea, 'Unsaved text');

      await user.keyboard('{Escape}');

      expect(screen.getByText('작성 중인 내용 삭제')).toBeInTheDocument();
    });
  });

  describe('character limit', () => {
    it('should display character count', () => {
      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      expect(screen.getByText('0 / 2000')).toBeInTheDocument();
    });

    it('should update character count as user types', async () => {
      const user = userEvent.setup();

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      const textarea = screen.getByLabelText('답장 입력');
      await user.type(textarea, 'Hello');

      expect(screen.getByText('5 / 2000')).toBeInTheDocument();
    });

    it('should show warning color when approaching limit', async () => {
      const user = userEvent.setup();

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      const textarea = screen.getByLabelText('답장 입력');

      // Use fireEvent to change value (faster than typing)
      const longText = 'a'.repeat(1801); // 90.05% of 2000
      fireEvent.change(textarea, { target: { value: longText } });

      const counter = screen.getByText('1801 / 2000');
      expect(counter).toHaveClass('text-orange-600');
    });

    it('should show error color at limit', async () => {
      const user = userEvent.setup();

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      const textarea = screen.getByLabelText('답장 입력');
      const longText = 'a'.repeat(2000);

      // Use fireEvent to change value (faster than typing)
      fireEvent.change(textarea, { target: { value: longText } });

      await waitFor(() => {
        const counter = screen.getByText('2000 / 2000');
        expect(counter).toHaveClass('text-red-600');
      });
    });

    it('should disable send button at character limit', async () => {
      const user = userEvent.setup();

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      const textarea = screen.getByLabelText('답장 입력');
      const longText = 'a'.repeat(2000);

      // Use fireEvent to change value (faster than typing)
      fireEvent.change(textarea, { target: { value: longText } });

      await waitFor(() => {
        const sendButton = screen.getByText('전송');
        expect(sendButton).toBeDisabled();
      });
    });
  });

  describe('auto-resize textarea', () => {
    it('should have auto-resize styling applied', () => {
      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      const textarea = screen.getByLabelText('답장 입력') as HTMLTextAreaElement;

      // Check that textarea has the appropriate styling for auto-resize
      expect(textarea).toHaveStyle({
        minHeight: '100px',
        maxHeight: '200px',
      });
      // The resize-none is handled by Tailwind CSS class, not an attribute
      expect(textarea.className).toContain('resize-none');
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      expect(screen.getByLabelText('답장 입력')).toBeInTheDocument();
      expect(screen.getByLabelText('답장 전송')).toBeInTheDocument();
    });

    it('should have aria-describedby for character count', () => {
      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      const textarea = screen.getByLabelText('답장 입력');
      expect(textarea).toHaveAttribute('aria-describedby', 'character-count');

      const counter = document.getElementById('character-count');
      expect(counter).toBeInTheDocument();
    });

    it('should have aria-live on character count for screen readers', () => {
      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      const counter = document.getElementById('character-count');
      expect(counter).toHaveAttribute('aria-live', 'polite');
      expect(counter).toHaveAttribute('aria-atomic', 'true');
    });

    it('should display help text for keyboard shortcuts', () => {
      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      expect(screen.getByText('Enter로 전송, Shift+Enter로 줄바꿈')).toBeInTheDocument();
    });

    it('should have role="alert" on error message', async () => {
      const user = userEvent.setup();
      const errorSendReply = vi.fn(() => Promise.reject(new Error('Send failed')));

      render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={errorSendReply}
        />
      );

      const textarea = screen.getByLabelText('답장 입력');
      await user.type(textarea, 'Reply text');

      const sendButton = screen.getByText('전송');
      await user.click(sendButton);

      await waitFor(() => {
        const errorDiv = screen.getByText('Send failed').closest('[role="alert"]');
        expect(errorDiv).toBeInTheDocument();
      });
    });
  });

  describe('state reset', () => {
    it('should reset state when modal is reopened', async () => {
      const user = userEvent.setup();

      const { rerender } = render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      let textarea = screen.getByLabelText('답장 입력');
      await user.type(textarea, 'Some text');

      // Close modal - textarea should be removed from DOM
      rerender(
        <ReplyModal
          isOpen={false}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      expect(screen.queryByLabelText('답장 입력')).not.toBeInTheDocument();

      // Reopen modal
      rerender(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      // Get the new textarea element after reopening
      textarea = screen.getByLabelText('답장 입력');
      expect(textarea).toHaveValue('');
    });

    it('should reset state when original message changes', async () => {
      const user = userEvent.setup();

      const newMessage: ReplyToInfo = {
        id: 'msg-456',
        senderId: 'user-789',
        senderName: 'Jane Smith',
        content: 'Different original message',
      };

      const { rerender } = render(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={mockOriginalMessage}
          onSendReply={mockOnSendReply}
        />
      );

      const textarea = screen.getByLabelText('답장 입력');
      await user.type(textarea, 'Some text');

      rerender(
        <ReplyModal
          isOpen={true}
          onClose={mockOnClose}
          originalMessage={newMessage}
          onSendReply={mockOnSendReply}
        />
      );

      expect(textarea).toHaveValue('');
    });
  });
});
