'use client';

import { useChatroomStore } from '@/store/chatroom';
import { ChatroomCard } from './ChatroomCard';

export const ChatroomList = () => {
  const { chatrooms } = useChatroomStore();

  // Sort chatrooms by creation date (newest first)
  const sortedChatrooms = [...chatrooms].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (sortedChatrooms.length === 0) {
    return (
      <div className="text-center py-8">
        <svg 
          className="w-16 h-16 mx-auto mb-4 opacity-50" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          style={{ color: 'var(--secondary-text)' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p 
          className="text-lg font-medium mb-2"
          style={{ color: 'var(--primary-text)' }}
        >
          No conversations yet
        </p>
        <p 
          className="text-sm"
          style={{ color: 'var(--secondary-text)' }}
        >
          Start a new conversation by typing in the search box above
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sortedChatrooms.map((chatroom) => (
        <ChatroomCard key={chatroom.id} chatroom={chatroom} />
      ))}
    </div>
  );
}; 