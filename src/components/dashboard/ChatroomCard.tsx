'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Chatroom } from '@/store/chatroom';
import { ChatroomOptions } from './ChatroomOptions';
import { RenameModal } from './RenameModal';

interface ChatroomCardProps {
  chatroom: Chatroom;
}

export const ChatroomCard = ({ chatroom }: ChatroomCardProps) => {
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the options button
    if ((e.target as HTMLElement).closest('.options-button')) {
      return;
    }
    router.push(`/chat/${chatroom.id}`);
  };

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  return (
    <>
      <div
        className="relative p-4 rounded-lg border cursor-pointer transition-colors group"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border)',
        }}
        onClick={handleCardClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--card-bg)';
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 
              className="font-medium text-sm truncate"
              style={{ color: 'var(--primary-text)' }}
            >
              {chatroom.title}
            </h3>
            <p 
              className="text-xs mt-1"
              style={{ color: 'var(--secondary-text)' }}
            >
              {formatDate(chatroom.createdAt)}
            </p>
          </div>
          
          <button
            className="options-button ml-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleOptionsClick}
            style={{
              color: 'var(--secondary-text)',
            }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>

        {showOptions && (
          <ChatroomOptions
            chatroomId={chatroom.id}
            chatroomTitle={chatroom.title}
            onRename={() => setShowRenameModal(true)}
            onClose={() => setShowOptions(false)}
          />
        )}
      </div>

      <RenameModal
        chatroomId={chatroom.id}
        currentTitle={chatroom.title}
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
      />
    </>
  );
}; 