'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChatroomStore } from '@/store/chatroom';
import { useThemeStore } from '@/store/theme';
import { ChatInterface } from '@/components/chat/ChatInterface';

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
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--primary-bg)]">
      {/* Header */}
      <header className="bg-[var(--card-bg)] border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 text-[var(--secondary-text)] hover:text-[var(--primary-text)] hover:bg-[var(--hover-bg)] rounded-full transition-colors"
              title="Back to Dashboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-semibold text-[var(--primary-text)]">
                {chatroom.title}
              </h1>
              <p className="text-sm text-[var(--secondary-text)]">
                AI Assistant
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-[var(--secondary-text)]">Online</span>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="h-[calc(100vh-73px)]">
        <ChatInterface chatroomId={chatroomId} />
      </div>
    </div>
  );
}