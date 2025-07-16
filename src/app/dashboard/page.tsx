'use client';

import { useState, useEffect } from 'react';
import { useChatroomStore } from '@/store/chatroom';
import { ChatroomList } from '@/components/dashboard/ChatroomList';
import { DarkModeToggle } from '@/components/dashboard/DarkModeToggle';
import { toast, Toaster } from 'react-hot-toast';

export default function DashboardPage() {
  const { addChatroom, initializeSampleChats } = useChatroomStore();
  const [searchValue, setSearchValue] = useState('');

  // Initialize sample chats on mount
  useEffect(() => {
    initializeSampleChats();
  }, [initializeSampleChats]);

  const handleCreateChat = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = searchValue.trim();
    
    if (!trimmedValue) {
      toast.error('Please enter a message to start a conversation');
      return;
    }

    addChatroom(trimmedValue);
    setSearchValue('');
    toast.success('New conversation created!');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
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
            <div className="relative">
              <input
                type="text"
                placeholder="What do you want to know?"
                value={searchValue}
                onChange={handleInputChange}
                className="w-full px-6 py-4 rounded-2xl border-2 text-lg focus:outline-none focus:border-2 transition-colors"
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
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors"
                style={{
                  backgroundColor: searchValue.trim() ? 'var(--accent)' : 'var(--border)',
                  color: searchValue.trim() ? 'white' : 'var(--secondary-text)',
                }}
                disabled={!searchValue.trim()}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
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