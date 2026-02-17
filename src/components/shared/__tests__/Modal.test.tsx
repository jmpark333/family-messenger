import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../Modal';

describe('Modal', () => {
  beforeEach(() => {
    // Reset document body styles before each test
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  });

  afterEach(() => {
    // Clean up after each test
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  });

  describe('open/close states', () => {
    it('should not render when isOpen is false', () => {
      const mockOnClose = vi.fn();
      render(
        <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      const mockOnClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should render without title when title prop is not provided', () => {
      const mockOnClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });

    it('should render content when children are provided', () => {
      const mockOnClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>First paragraph</p>
          <p>Second paragraph</p>
        </Modal>
      );

      expect(screen.getByText('First paragraph')).toBeInTheDocument();
      expect(screen.getByText('Second paragraph')).toBeInTheDocument();
    });

    it('should render close button when title is provided', () => {
      const mockOnClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      const closeButton = screen.getByLabelText('Close modal');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('backdrop click', () => {
    it('should call onClose when backdrop is clicked', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      // Find backdrop by aria-hidden attribute
      const backdrop = document.querySelector('[aria-hidden="true"]');
      expect(backdrop).toBeInTheDocument();

      if (backdrop) {
        await user.click(backdrop);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });

    it('should not call onClose when modal content is clicked', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      const modal = screen.getByRole('dialog');
      await user.click(modal);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('ESC key', () => {
    it('should call onClose when ESC key is pressed', async () => {
      const mockOnClose = vi.fn();

      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      // Wait for useEffect to attach event listener
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Use fireEvent to press ESC key at document level
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

      // Wait for the event handler to be called
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should not call onClose when other keys are pressed', () => {
      const mockOnClose = vi.fn();

      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(enterEvent);

      const aEvent = new KeyboardEvent('keydown', { key: 'a' });
      document.dispatchEvent(aEvent);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should not call onClose when ESC is pressed but modal is closed', () => {
      const mockOnClose = vi.fn();

      render(
        <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('close button', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnClose = vi.fn();

      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      const closeButton = screen.getByLabelText('Close modal');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('should have proper role and aria attributes', () => {
      const mockOnClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('should not have aria-labelledby when title is not provided', () => {
      const mockOnClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <p>Modal content</p>
        </Modal>
      );

      const modal = screen.getByRole('dialog');
      expect(modal).not.toHaveAttribute('aria-labelledby');
    });

    it('should have aria-hidden on backdrop', () => {
      const mockOnClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      const backdrop = document.querySelector('[aria-hidden="true"]');
      expect(backdrop).toBeInTheDocument();
    });
  });

  describe('size variants', () => {
    it('should render with small size when size="sm"', () => {
      const mockOnClose = vi.fn();
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" size="sm">
          <p>Modal content</p>
        </Modal>
      );

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('max-w-sm');
    });

    it('should render with medium size when size="md" (default)', () => {
      const mockOnClose = vi.fn();
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" size="md">
          <p>Modal content</p>
        </Modal>
      );

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('max-w-md');
    });

    it('should render with large size when size="lg"', () => {
      const mockOnClose = vi.fn();
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" size="lg">
          <p>Modal content</p>
        </Modal>
      );

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('max-w-lg');
    });
  });

  describe('body scroll lock', () => {
    it('should lock body scroll when modal is open', () => {
      const mockOnClose = vi.fn();
      const { rerender } = render(
        <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('');
      expect(document.body.style.position).toBe('');

      rerender(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');
      expect(document.body.style.position).toBe('fixed');
      expect(document.body.style.width).toBe('100%');
    });

    it('should restore body scroll when modal is closed', async () => {
      const mockOnClose = vi.fn();
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('');
        expect(document.body.style.position).toBe('');
      });
    });
  });

  describe('focus management', () => {
    it('should focus the close button when modal opens', async () => {
      const mockOnClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      await waitFor(() => {
        const closeButton = screen.getByLabelText('Close modal');
        expect(closeButton).toHaveFocus();
      });
    });

    it('should focus first focusable element when title is not provided', async () => {
      const mockOnClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <button>First Button</button>
          <button>Second Button</button>
        </Modal>
      );

      await waitFor(() => {
        const firstButton = screen.getByText('First Button');
        expect(firstButton).toHaveFocus();
      });
    });
  });
});
