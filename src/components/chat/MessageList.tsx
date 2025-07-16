'use client';

import { useEffect, useRef, useState } from 'react';
import { Message } from '@/store/chatroom';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { LoadingSkeletons, PaginationSkeleton } from './LoadingSkeletons';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  isPaginationLoading: boolean;
  isTyping: boolean;
  hasMoreMessages: boolean;
  onLoadMore: () => void;
}

export function MessageList({ 
  messages, 
  isLoading, 
  isPaginationLoading, 
  isTyping, 
  hasMoreMessages,
  onLoadMore 
}: MessageListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, shouldAutoScroll]);

  // Maintain scroll position after pagination
  useEffect(() => {
    if (isPaginationLoading === false && prevScrollHeight > 0 && scrollContainerRef.current) {
      const newScrollHeight = scrollContainerRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeight;
      scrollContainerRef.current.scrollTop = scrollDiff;
      setPrevScrollHeight(0);
    }
  }, [isPaginationLoading, prevScrollHeight]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    
    // Check if user is at the bottom (within 100px)
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldAutoScroll(isAtBottom);

    // Check if user scrolled to top and load more messages
    if (scrollTop === 0 && hasMoreMessages && !isPaginationLoading) {
      setPrevScrollHeight(scrollHeight);
      onLoadMore();
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <LoadingSkeletons count={8} />
      </div>
    );
  }

  return (
    <div 
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 space-y-1"
    >
      {/* Pagination Loading */}
      {isPaginationLoading && <PaginationSkeleton />}

      {/* Load More Hint */}
      {hasMoreMessages && !isPaginationLoading && (
        <div className="flex justify-center py-4">
          <div className="text-sm text-[var(--secondary-text)] bg-[var(--card-bg)] px-4 py-2 rounded-full border border-[var(--border)] shadow-sm">
            Scroll to top to load older messages
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="space-y-1">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      {/* Typing Indicator */}
      {isTyping && <TypingIndicator />}

      {/* Auto-scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
} 