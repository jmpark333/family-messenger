// MessageInput.tsx - 파일 첨부 기능 추가
import { useState, useRef, useEffect } from 'react';
import { Image, File, X } from 'lucide-react';
import { MessageAttachment, MAX_FILE_SIZE } from '@/types';

interface MessageInputProps {
  onSend: (content: string, attachment?: MessageAttachment) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState<MessageAttachment | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!text.trim() && !attachment) return;

    console.log('[MessageInput] Sending message:', { text: text.trim(), attachment });
    onSend(text.trim(), attachment || undefined);
    setText('');
    setAttachment(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processFile(file);
  };

  const processFile = (file: File) => {
    const fileType = file.type;

    // Check file type
    if (!fileType.startsWith('image/') && fileType !== 'application/pdf') {
      alert('이미지 파일과 PDF만 첨부할 수 있습니다.');
      return;
    }

    // Check file size
    const maxSize = fileType.startsWith('image/') ? MAX_FILE_SIZE.image : MAX_FILE_SIZE.pdf;
    if (file.size > maxSize) {
      alert(`파일 크기가 너무 큽니다. 최대 ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      const base64Data = data.split(',')[1]; // Remove data URL prefix

      setAttachment({
        type: fileType.startsWith('image/') ? 'image' : 'pdf',
        name: file.name,
        data: base64Data,
        size: file.size,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  // 자동 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const canSend = text.trim() || attachment;

  return (
    <div className="space-y-2">
      {/* Attachment preview */}
      {attachment && (
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
          {attachment.type === 'image' ? (
            <div className="relative w-12 h-12">
              <img
                src={`data:image/${attachment.name.split('.').pop()};base64,${attachment.data}`}
                alt={attachment.name}
                className="w-full h-full object-cover rounded"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center">
              <File className="w-6 h-6 text-red-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
            <p className="text-xs text-gray-500">
              {(attachment.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button
            onClick={handleRemoveAttachment}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="첨부 파일 제거"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}

      {/* Input area */}
      <div
        className={`flex items-end gap-2 transition-colors ${isDragging ? 'bg-blue-50 p-2 rounded-lg' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="파일 선택"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label="파일 첨부"
          title="이미지 또는 PDF 첨부"
        >
          <Image className="w-5 h-5" />
        </button>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={attachment ? "메시지를 입력하세요... (선택사항)" : "메시지를 입력하세요... (Shift+Enter로 줄바꿈)"}
            className="w-full px-4 py-3 bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl resize-none focus:outline-none transition-colors text-gray-900 placeholder-gray-500"
            rows={1}
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />

          {/* 암호화 표시 */}
          <div className="absolute right-3 bottom-3 text-xs text-green-600 flex items-center gap-1">
            <span className="animate-pulse">🔒</span>
            <span className="hidden sm:inline">E2E</span>
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={!canSend}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          aria-label="메시지 전송"
        >
          <span className="hidden sm:inline">전송</span>
          <span className="text-xl">➤</span>
        </button>
      </div>

      {/* Drag overlay hint */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/10 rounded-lg flex items-center justify-center">
          <p className="text-blue-600 font-medium">파일을 놓으면 첨부됩니다</p>
        </div>
      )}
    </div>
  );
}

export default MessageInput;
