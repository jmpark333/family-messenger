import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuotedMessage } from '../QuotedMessage';
import { ReplyToInfo } from '@/types/index';

describe('QuotedMessage', () => {
  const mockOriginalMessage: ReplyToInfo = {
    id: 'msg-123',
    senderId: 'user-456',
    senderName: 'John Doe',
    content: 'This is a test message',
  };

  describe('rendering', () => {
    it('should render the quoted message with sender name', () => {
      render(<QuotedMessage originalMessage={mockOriginalMessage} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should render the message content', () => {
      render(<QuotedMessage originalMessage={mockOriginalMessage} />);

      expect(screen.getByText('This is a test message')).toBeInTheDocument();
    });

    it('should display empty message placeholder when content is empty', () => {
      const emptyMessage: ReplyToInfo = {
        ...mockOriginalMessage,
        content: '',
      };

      render(<QuotedMessage originalMessage={emptyMessage} />);

      expect(screen.getByText('Empty message')).toBeInTheDocument();
    });

    it('should display truncated sender ID when senderName is not provided', () => {
      const messageWithoutName: ReplyToInfo = {
        ...mockOriginalMessage,
        senderName: '',
        senderId: 'abcdefgh12345678',
      };

      render(<QuotedMessage originalMessage={messageWithoutName} />);

      expect(screen.getByText('abcdefgh')).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      const mockOnClick = vi.fn();
      render(<QuotedMessage originalMessage={mockOriginalMessage} onClick={mockOnClick} />);

      const container = screen.getByRole('button');
      expect(container).toHaveAttribute('tabIndex', '0');
      expect(container).toHaveAttribute(
        'aria-label',
        'Reply to message from John Doe: This is a test message'
      );
    });

    it('should not be interactive when onClick is not provided', () => {
      const { container } = render(
        <QuotedMessage originalMessage={mockOriginalMessage} />
      );

      const quotedMessage = container.querySelector('[role="button"]');
      expect(quotedMessage?.className).not.toContain('cursor-pointer');
      expect(quotedMessage).not.toHaveAttribute('tabIndex');
    });
  });

  describe('content truncation', () => {
    it('should truncate content longer than 50 characters', () => {
      const longMessage: ReplyToInfo = {
        ...mockOriginalMessage,
        content: 'This is a very long message that exceeds the fifty character limit and should be truncated',
      };

      render(<QuotedMessage originalMessage={longMessage} />);

      // The component truncates to 50 chars + "..."
      const displayedText = screen.getByText((content) =>
        content.includes('This is a very long message that exceeds the fifty') &&
        content.endsWith('...')
      );
      expect(displayedText).toBeInTheDocument();
    });

    it('should not truncate content exactly 50 characters', () => {
      const exactLengthMessage: ReplyToInfo = {
        ...mockOriginalMessage,
        content: 'a'.repeat(50),
      };

      render(<QuotedMessage originalMessage={exactLengthMessage} />);

      expect(screen.getByText('a'.repeat(50))).toBeInTheDocument();
    });

    it('should not truncate content shorter than 50 characters', () => {
      const shortMessage: ReplyToInfo = {
        ...mockOriginalMessage,
        content: 'Short',
      };

      render(<QuotedMessage originalMessage={shortMessage} />);

      expect(screen.getByText('Short')).toBeInTheDocument();
    });

    it('should trim whitespace before truncating', () => {
      const whitespaceMessage: ReplyToInfo = {
        ...mockOriginalMessage,
        content: '  trimmed content  ',
      };

      render(<QuotedMessage originalMessage={whitespaceMessage} />);

      expect(screen.getByText('trimmed content')).toBeInTheDocument();
    });
  });

  describe('onClick handler', () => {
    it('should call onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <QuotedMessage
          originalMessage={mockOriginalMessage}
          onClick={handleClick}
        />
      );

      const container = screen.getByRole('button');
      await user.click(container);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when Enter key is pressed', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <QuotedMessage
          originalMessage={mockOriginalMessage}
          onClick={handleClick}
        />
      );

      const container = screen.getByRole('button');
      container.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when Space key is pressed', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <QuotedMessage
          originalMessage={mockOriginalMessage}
          onClick={handleClick}
        />
      );

      const container = screen.getByRole('button');
      container.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick for other keys', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <QuotedMessage
          originalMessage={mockOriginalMessage}
          onClick={handleClick}
        />
      );

      const container = screen.getByRole('button');
      container.focus();
      await user.keyboard('{a}');

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should prevent default on Enter key', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <QuotedMessage
          originalMessage={mockOriginalMessage}
          onClick={handleClick}
        />
      );

      const container = screen.getByRole('button');

      // Spy on the keydown handler to verify it prevents default
      const keydownEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });

      const preventDefaultSpy = vi.spyOn(keydownEvent, 'preventDefault');
      container.dispatchEvent(keydownEvent);

      // The component's handleKeyDown should call preventDefault
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });
});
