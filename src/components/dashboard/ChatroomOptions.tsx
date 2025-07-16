'use client';

import { useRef, useEffect } from 'react';
import { useChatroomStore } from '@/store/chatroom';
import { toast } from 'react-hot-toast';

interface ChatroomOptionsProps {
  chatroomId: string;
  chatroomTitle: string;
  onRename: () => void;
  onClose: () => void;
}

export const ChatroomOptions = ({ 
  chatroomId, 
  chatroomTitle, 
  onRename, 
  onClose 
}: ChatroomOptionsProps) => {
  const { deleteChatroom } = useChatroomStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleDelete = () => {
    // Show confirmation toast
    toast((t) => (
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: 'var(--primary-text)' }}>
            Delete &quot;{chatroomTitle}&quot;?
          </p>
          <p className="text-xs" style={{ color: 'var(--secondary-text)' }}>
            This action cannot be undone.
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              deleteChatroom(chatroomId);
              toast.dismiss(t.id);
              toast.success('Chatroom deleted successfully');
              onClose();
            }}
            className="px-3 py-1 text-xs font-medium text-white rounded"
            style={{ backgroundColor: 'var(--error)' }}
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-xs font-medium rounded"
            style={{ 
              backgroundColor: 'var(--border)', 
              color: 'var(--primary-text)' 
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      style: {
        background: 'var(--card-bg)',
        border: `1px solid var(--border)`,
        padding: '12px',
        borderRadius: '8px',
        maxWidth: '400px',
      }
    });
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-8 z-10 w-32 rounded-lg shadow-lg border"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="py-1">
        <button
          onClick={() => {
            onRename();
            onClose();
          }}
          className="w-full px-3 py-2 text-left text-sm hover:bg-opacity-80 flex items-center space-x-2"
          style={{ 
            color: 'var(--primary-text)',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Rename</span>
        </button>
        
        <button
          onClick={handleDelete}
          className="w-full px-3 py-2 text-left text-sm hover:bg-opacity-80 flex items-center space-x-2"
          style={{ 
            color: 'var(--error)',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}; 