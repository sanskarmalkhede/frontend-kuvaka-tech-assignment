'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChatroomStore } from '@/store/chatroom';
import { useThemeStore } from '@/store/theme';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { Sidebar } from '@/components/Sidebar';

interface ChatPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const router = useRouter();
  const { chatrooms, initializeSampleChats } = useChatroomStore();
  const { isDarkMode, setDarkMode } = useThemeStore();
  const [isLoading, setIsLoading] = useState(true);
  const [chatroom, setChatroom] = useState<{ id: string; title: string; createdAt: string } | null>(null);
  const [chatroomId, setChatroomId] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Apply theme on mount
    setDarkMode(isDarkMode);
    
    // Initialize sample chats if needed
    initializeSampleChats();
    
    // Resolve params and find the chatroom
    params.then(resolvedParams => {
      const foundChatroom = chatrooms.find(room => room.id === resolvedParams.id);
      setChatroomId(resolvedParams.id);
      
      if (foundChatroom) {
        setChatroom(foundChatroom);
      } else if (chatrooms.length > 0) {
        // Chatroom not found, redirect to dashboard
        router.push('/dashboard');
        return;
      }
      
      setIsLoading(false);
    });
  }, [params, chatrooms, router, isDarkMode, setDarkMode, initializeSampleChats]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--primary-bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
          <p className="text-[var(--secondary-text)]">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!chatroom) {
    return (
      <div className="min-h-screen bg-[var(--primary-bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-xl font-semibold text-[var(--primary-text)] mb-2">
            Chatroom not found
          </h1>
          <p className="text-[var(--secondary-text)] mb-6">
            The chatroom you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--primary-bg)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-[var(--card-bg)] border-b border-[var(--border)] px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 sm:p-2 text-[var(--secondary-text)] hover:text-[var(--primary-text)] hover:bg-[var(--hover-bg)] rounded-full transition-colors lg:hidden"
                title="Open sidebar"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => router.push('/')}
                className="p-1.5 sm:p-2 text-[var(--secondary-text)] hover:text-[var(--primary-text)] hover:bg-[var(--hover-bg)] rounded-full transition-colors lg:hidden"
                title="Back to Home"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg font-semibold text-[var(--primary-text)] truncate">
                  {chatroom.title}
                </h1>
                <p className="text-xs sm:text-sm text-[var(--secondary-text)]">
                  AI Assistant
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden flex justify-center">
          <div className="w-full max-w-4xl">
            <ChatInterface chatroomId={chatroomId} />
          </div>
        </div>
      </div>
    </div>
  );
}