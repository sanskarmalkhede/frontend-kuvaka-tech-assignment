'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useChatroomStore } from '@/store/chatroom';
import { ChatroomList } from '@/components/dashboard/ChatroomList';
import { DarkModeToggle } from '@/components/dashboard/DarkModeToggle';
import { toast, Toaster } from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { addChatroom, addMessage, simulateAIResponse, initializeSampleChats } = useChatroomStore();
  const [searchValue, setSearchValue] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize sample chats on mount
  useEffect(() => {
    initializeSampleChats();
  }, [initializeSampleChats]);

  const handleCreateChat = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = searchValue.trim();
    
    if (!trimmedValue && !imageFile) {
      toast.error('Please enter a message or select an image to start a conversation');
      return;
    }

    // Create chatroom with appropriate title
    const chatroomTitle = trimmedValue || 'Image conversation';
    const chatroomId = addChatroom(chatroomTitle);
    
    // Add initial message to the chatroom
    if (imageFile && imagePreview) {
      addMessage(chatroomId, trimmedValue || 'Image', 'image', imagePreview);
    } else {
      addMessage(chatroomId, trimmedValue, 'text');
    }
    
    // Trigger AI response to the initial message
    simulateAIResponse(chatroomId);
    
    // Reset form
    setSearchValue('');
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast.success('New conversation created!');
    
    // Redirect to the newly created chatroom after a brief delay
    // This allows the AI response to be initiated before navigation
    setTimeout(() => {
      router.push(`/chat/${chatroomId}`);
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateChat(e as React.FormEvent);
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
        toast.error('Please select an image file');
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

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-end mb-8">
          <DarkModeToggle />
        </div>

        {/* Grok Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <svg 
              className="w-12 h-12 mr-3" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{ color: 'var(--primary-text)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h1 
              className="text-4xl font-bold"
              style={{ color: 'var(--primary-text)' }}
            >
              Grok
            </h1>
          </div>
        </div>

        {/* Search/Input Box */}
        <div className="mb-8">
          <form onSubmit={handleCreateChat}>
            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4 relative inline-block">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-w-32 max-h-32 rounded-lg shadow-sm"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            )}

            <div className="relative">
              {/* File Upload Button - Left side */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 text-[var(--secondary-text)] hover:text-[var(--primary-text)] hover:bg-[var(--hover-bg)] rounded-full transition-colors"
                title="Attach image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>

              <input
                type="text"
                placeholder="What do you want to know?"
                value={searchValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full pl-14 pr-14 py-4 rounded-2xl border-2 text-lg focus:outline-none focus:border-2 transition-colors"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border)',
                  color: 'var(--primary-text)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                }}
              />

              {/* Send Button - Right side */}
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors"
                style={{
                  backgroundColor: (searchValue.trim() || imageFile) ? 'var(--accent)' : 'var(--border)',
                  color: (searchValue.trim() || imageFile) ? 'white' : 'var(--secondary-text)',
                }}
                disabled={!searchValue.trim() && !imageFile}
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

        {/* Chatroom List */}
        <div className="mb-8">
          <h2 
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--primary-text)' }}
          >
            Recent Conversations
          </h2>
          <ChatroomList />
        </div>
      </div>

      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--card-bg)',
            color: 'var(--primary-text)',
            border: `1px solid var(--border)`,
          },
        }}
      />
    </div>
  );
}