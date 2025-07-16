'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatroomStore } from '@/store/chatroom';
import { toast } from 'react-hot-toast';

interface RenameModalProps {
  chatroomId: string;
  currentTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const RenameModal = ({ 
  chatroomId, 
  currentTitle, 
  isOpen, 
  onClose 
}: RenameModalProps) => {
  const { renameChatroom } = useChatroomStore();
  const [newTitle, setNewTitle] = useState(currentTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  // Reset title when modal opens
  useEffect(() => {
    if (isOpen) {
      setNewTitle(currentTitle);
    }
  }, [isOpen, currentTitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedTitle = newTitle.trim();
    
    if (!trimmedTitle) {
      toast.error('Title cannot be empty');
      return;
    }
    
    if (trimmedTitle === currentTitle) {
      onClose();
      return;
    }
    
    renameChatroom(chatroomId, trimmedTitle);
    toast.success('Chatroom renamed successfully');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--primary-text)' }}>
            Rename Chatroom
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            style={{ color: 'var(--secondary-text)' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="title" 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--primary-text)' }}
            >
              Chatroom Title
            </label>
            <input
              ref={inputRef}
              id="title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border)',
                color: 'var(--primary-text)',
              }}
              placeholder="Enter chatroom title"
              maxLength={100}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg border transition-colors"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'var(--border)',
                color: 'var(--secondary-text)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
              style={{
                backgroundColor: 'var(--accent)',
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 