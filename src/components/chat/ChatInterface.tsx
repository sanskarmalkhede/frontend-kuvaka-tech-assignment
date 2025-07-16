'use client';

import { useEffect, useRef } from 'react';
import { useChatroomStore } from '@/store/chatroom';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface ChatInterfaceProps {
  chatroomId: string;
}

export function ChatInterface({ chatroomId }: ChatInterfaceProps) {
  const {
    messages,
    loadingStates,
    loadMessages,
    loadMoreMessages,
    addMessage,
    simulateAIResponse,
  } = useChatroomStore();

  const chatroomMessages = messages[chatroomId] || [];
  const loadingState = loadingStates[chatroomId] || {
    isLoadingMessages: false,
    isLoadingPagination: false,
    isTyping: false,
    hasMoreMessages: false,
    loadedCount: 0,
  };

  const throttleRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial messages when component mounts
  useEffect(() => {
    loadMessages(chatroomId);
  }, [chatroomId, loadMessages]);

  const handleSendMessage = (content: string, type: 'text' | 'image', imageUrl?: string) => {
    // Add user message immediately
    addMessage(chatroomId, content, type, imageUrl);
    
    // Throttle AI responses to prevent spam
    if (throttleRef.current) {
      clearTimeout(throttleRef.current);
    }
    
    throttleRef.current = setTimeout(() => {
      simulateAIResponse(chatroomId);
    }, 100);
  };

  const handleLoadMore = () => {
    loadMoreMessages(chatroomId);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--primary-bg)]">
      {/* Messages List */}
      <MessageList
        messages={chatroomMessages}
        isLoading={loadingState.isLoadingMessages}
        isPaginationLoading={loadingState.isLoadingPagination}
        isTyping={loadingState.isTyping}
        hasMoreMessages={loadingState.hasMoreMessages}
        onLoadMore={handleLoadMore}
      />

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={loadingState.isLoadingMessages}
      />
    </div>
  );
} 