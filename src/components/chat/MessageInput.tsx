'use client';

import { useState, useRef } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string, type: 'text' | 'image', imageUrl?: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (imageFile && imagePreview) {
      onSendMessage(message.trim() || 'Image', 'image', imagePreview);
      setImagePreview(null);
      setImageFile(null);
      setMessage('');
    } else if (message.trim()) {
      onSendMessage(message.trim(), 'text');
      setMessage('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if it's an image
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        
        // Create preview URL using FileReader (base64)
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file');
      }
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  return (
    <div>
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-4 relative inline-block">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="max-w-32 max-h-32 rounded-lg shadow-sm"
          />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div 
          className="flex items-center gap-2 w-full border rounded-2xl px-3 py-2 bg-transparent transition-colors"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* File Upload Button - Left side */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-2 text-[var(--secondary-text)] hover:text-[var(--primary-text)] hover:bg-[var(--hover-bg)] rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 focus:outline-none"
            title="Attach image"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          {/* Text Input */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={disabled}
            className="flex-1 bg-transparent border-none outline-none resize-none text-[var(--primary-text)] placeholder-[var(--secondary-text)] disabled:opacity-50 disabled:cursor-not-allowed py-2 focus:outline-none"
            rows={3}
            style={{ minHeight: '48px', maxHeight: '160px' }}
          />

          {/* Send Button - Right side */}
          <button
            type="submit"
            disabled={disabled || (!message.trim() && !imagePreview)}
            className="p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 focus:outline-none"
            style={{
              backgroundColor: (message.trim() || imagePreview) ? 'var(--accent)' : 'var(--border)',
              color: (message.trim() || imagePreview) ? 'white' : 'var(--secondary-text)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
            </svg>
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </form>
    </div>
  );
} 