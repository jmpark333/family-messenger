'use client';

import { useRef } from 'react';
import { MAX_FILE_SIZE } from '@/types';

interface FileUploadButtonProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  accept?: string; // MIME types to accept
}

const DEFAULT_ACCEPT = 'image/*,application/pdf,.doc,.docx,.txt,.zip';

export default function FileUploadButton({
  onFileSelect,
  disabled = false,
  accept = DEFAULT_ACCEPT,
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Determine max size based on file type
    const isImage = file.type.startsWith('image/');
    const maxSize = isImage ? MAX_FILE_SIZE.image : MAX_FILE_SIZE.pdf;

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
      alert(`파일 크기가 ${maxSizeMB}MB를 초과했습니다. 현재 크기: ${(file.size / (1024 * 1024)).toFixed(2)}MB\n(E2E 암호화로 인해 제한됨)`);
      return;
    }

    onFileSelect(file);

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept={accept}
        aria-label="파일 업로드"
      />
      <button
        onClick={handleClick}
        disabled={disabled}
        className="p-3 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="파일 첨부"
        title="파일 첨부 (최대 1.5MB, 암호화로 인해 제한)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
      </button>
    </>
  );
}
