'use client';

import { useMemo } from 'react';

export interface FilePreviewData {
  file: File;
  preview: string;
  id: string;
}

interface FilePreviewProps {
  files: FilePreviewData[];
  onRemove: (id: string) => void;
}

export default function FilePreview({ files, onRemove }: FilePreviewProps) {
  if (files.length === 0) return null;

  return (
    <div className="flex gap-2 mb-2 flex-wrap">
      {files.map((fileData) => (
        <FilePreviewItem
          key={fileData.id}
          fileData={fileData}
          onRemove={() => onRemove(fileData.id)}
        />
      ))}
    </div>
  );
}

interface FilePreviewItemProps {
  fileData: FilePreviewData;
  onRemove: () => void;
}

function FilePreviewItem({ fileData, onRemove }: FilePreviewItemProps) {
  const { file, preview } = fileData;

  const isImage = file.type.startsWith('image/');
  const fileSize = useMemo(() => formatFileSize(file.size), [file.size]);

  return (
    <div className="relative group bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
      {isImage ? (
        <ImagePreview preview={preview} fileName={file.name} fileSize={fileSize} onRemove={onRemove} />
      ) : (
        <FilePreview fileName={file.name} fileSize={fileSize} onRemove={onRemove} />
      )}
    </div>
  );
}

interface ImagePreviewProps {
  preview: string;
  fileName: string;
  fileSize: string;
  onRemove: () => void;
}

function ImagePreview({ preview, fileName, fileSize, onRemove }: ImagePreviewProps) {
  return (
    <div className="relative w-24 h-24 sm:w-32 sm:h-32">
      <img
        src={preview}
        alt={fileName}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
        <button
          onClick={onRemove}
          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          aria-label="파일 제거"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-1 bg-black bg-opacity-50 text-white text-xs truncate">
          {fileName}
        </div>
      </div>
      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black bg-opacity-70 text-white text-xs rounded">
        {fileSize}
      </div>
    </div>
  );
}

interface FilePreviewProps {
  fileName: string;
  fileSize: string;
  onRemove: () => void;
}

function FilePreview({ fileName, fileSize, onRemove }: FilePreviewProps) {
  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();

    if (ext === 'pdf') {
      return (
        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <path d="M14 2v6h6" fill="white" />
        </svg>
      );
    }

    if (['doc', 'docx'].includes(ext || '')) {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <path d="M14 2v6h6" fill="white" />
        </svg>
      );
    }

    if (['zip', 'rar', '7z'].includes(ext || '')) {
      return (
        <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <path d="M14 2v6h6" fill="white" />
        </svg>
      );
    }

    // Default file icon
    return (
      <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
        <path d="M14 2v6h6" fill="white" />
      </svg>
    );
  };

  return (
    <div className="flex items-center gap-3 p-3 pr-8 w-48 sm:w-64">
      {getFileIcon(fileName)}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {fileName}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {fileSize}
        </p>
      </div>
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
        aria-label="파일 제거"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
