// src/components/shared/Modal.tsx
import { useEffect, useRef, useCallback } from 'react';
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
  const triggerRef = useRef<HTMLElement | null>(null);
  const previousBodyOverflowRef = useRef<string>('');

  // Store trigger element when modal opens
  useEffect(() => {
    if (isOpen && !triggerRef.current) {
      triggerRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Body scroll lock - prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store the current body overflow style
      previousBodyOverflowRef.current = document.body.style.overflow;
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
      // Also prevent scrolling on iOS
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      // Restore body scroll
      document.body.style.overflow = previousBodyOverflowRef.current;
      document.body.style.position = '';
      document.body.style.width = '';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = previousBodyOverflowRef.current;
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

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

  // Complete focus trap - cycles Tab navigation within modal
  const handleTabKey = useCallback((e: KeyboardEvent) => {
    if (!modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // If Tab key pressed
    if (e.key === 'Tab') {
      // If Shift + Tab on first element, move to last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
      // If Tab (no Shift) on last element, move to first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  }, []);

  // Setup focus trap and initial focus
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;

      // Focus first element
      firstElement?.focus();

      // Add Tab key listener for focus trap
      document.addEventListener('keydown', handleTabKey);

      return () => {
        document.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isOpen, handleTabKey]);

  // Focus restoration - restore focus to trigger element on close
  useEffect(() => {
    if (!isOpen && triggerRef.current) {
      // Small delay to ensure the modal is fully removed from DOM
      const timeoutId = setTimeout(() => {
        triggerRef.current?.focus();
        triggerRef.current = null; // Clear after restoration
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  };

  return (
    <>
      {/* Reduced motion support for accessibility */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .modal-enter {
            animation: none !important;
            transition: none !important;
          }
          .modal-backdrop-enter {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 animate-fade-in modal-backdrop-enter"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          ref={modalRef}
          className={`${sizeClasses[size]} w-full mx-4 bg-white rounded-2xl shadow-xl animate-fade-in relative z-10 modal-enter
            md:mx-auto
            max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:rounded-t-2xl max-md:rounded-b-none max-md:mb-0 max-md:slide-up
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
                aria-label="Close modal"
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
    </>
  );
}
