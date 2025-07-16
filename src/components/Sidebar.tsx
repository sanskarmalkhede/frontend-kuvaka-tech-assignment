'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChatroomStore } from '@/store/chatroom';
import { useDebounce } from '@/hooks/useDebounce';
import { ChatroomList } from '@/components/dashboard/ChatroomList';
import { DarkModeToggle } from '@/components/dashboard/DarkModeToggle';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const router = useRouter();
  const [chatroomSearchQuery, setChatroomSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(chatroomSearchQuery, 300);
  const [isLoading, setIsLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { initializeSampleChats } = useChatroomStore();

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      initializeSampleChats();
      setIsLoading(false);
    };
    
    initializeData();
  }, [initializeSampleChats]);

  const handleChatroomSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatroomSearchQuery(e.target.value);
  };

  const handleChatroomSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setChatroomSearchQuery('');
      e.currentTarget.blur();
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full transform transition-all duration-300 ease-in-out z-50 lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-16' : 'w-80'}`}
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        <div className="flex flex-col h-full border-r border-[var(--border)]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <div className="flex items-center space-x-3">
              {!isCollapsed && (
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center space-x-2 hover:bg-[var(--hover-bg)] p-2 rounded-lg transition-colors focus:outline-none"
                >
                  <svg 
                    className="w-6 h-6" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    style={{ color: 'var(--primary-text)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-text)' }}>
                    Kuvaka
                  </span>
                </button>
              )}
              {isCollapsed && (
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center justify-center hover:bg-[var(--hover-bg)] p-2 rounded-lg transition-colors focus:outline-none"
                  title="Kuvaka"
                >
                  <svg 
                    className="w-6 h-6" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    style={{ color: 'var(--primary-text)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {!isCollapsed && <DarkModeToggle />}
              
              {/* Collapse/Expand Button - Desktop only - Only show when not collapsed */}
              {!isCollapsed && (
                <button
                  onClick={toggleCollapse}
                  className="hidden lg:flex p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors focus:outline-none"
                  style={{ color: 'var(--secondary-text)' }}
                  title="Collapse sidebar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              
              {/* Close Button - Mobile only */}
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors lg:hidden focus:outline-none"
                style={{ color: 'var(--secondary-text)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {!isCollapsed && (
            <>
              {/* New Chat Button */}
              <div className="p-4 border-b border-[var(--border)]">
                <button
                  onClick={() => {
                    router.push('/');
                    onClose();
                  }}
                  className="w-full px-4 py-3 rounded-lg border-2 border-dashed transition-colors hover:bg-[var(--hover-bg)] focus:outline-none"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--primary-text)',
                  }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>New Chat</span>
                  </div>
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-[var(--border)]">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-[var(--secondary-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={chatroomSearchQuery}
                    onChange={handleChatroomSearchChange}
                    onKeyDown={handleChatroomSearchKeyDown}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border outline-none transition-colors text-sm focus:outline-none"
                    style={{
                      backgroundColor: 'var(--primary-bg)',
                      borderColor: 'var(--border)',
                      color: 'var(--primary-text)',
                    }}
                  />
                  {chatroomSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setChatroomSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--secondary-text)] hover:text-[var(--primary-text)] transition-colors focus:outline-none"
                      title="Clear search"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <h2 
                    className="text-sm font-semibold mb-3 uppercase tracking-wide"
                    style={{ color: 'var(--secondary-text)' }}
                  >
                    {debouncedSearchQuery ? `Search Results` : 'Recent Conversations'}
                  </h2>
                  <ChatroomList searchQuery={debouncedSearchQuery} isLoading={isLoading} />
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-[var(--border)]">
                <button
                  onClick={() => {
                    router.push('/auth');
                    onClose();
                  }}
                  className="w-full px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 hover:scale-105 focus:outline-none"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'var(--border)',
                    color: 'var(--primary-text)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = 'var(--accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--primary-text)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  Sign Up
                </button>
              </div>
            </>
          )}

          {/* Collapsed State Content */}
          {isCollapsed && (
            <>
              {/* Collapsed Content */}
              <div className="flex-1 flex flex-col items-center space-y-4 p-4">
                {/* New Chat Button - Collapsed */}
                <button
                  onClick={() => {
                    router.push('/');
                    onClose();
                  }}
                  className="p-3 rounded-lg border-2 border-dashed transition-colors hover:bg-[var(--hover-bg)] focus:outline-none"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--primary-text)',
                  }}
                  title="New Chat"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>

                {/* Dark Mode Toggle - Collapsed */}
                <DarkModeToggle />

                {/* Sign Up Button - Collapsed */}
                <button
                  onClick={() => {
                    router.push('/auth');
                    onClose();
                  }}
                  className="p-3 rounded-lg border transition-colors hover:bg-[var(--hover-bg)] focus:outline-none"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'var(--border)',
                    color: 'var(--primary-text)',
                  }}
                  title="Sign Up"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>

              {/* Expand Button - Bottom of collapsed sidebar */}
              <div className="p-4 border-t border-[var(--border)]">
                <button
                  onClick={toggleCollapse}
                  className="w-full p-3 rounded-lg hover:bg-[var(--hover-bg)] transition-colors focus:outline-none"
                  style={{ color: 'var(--secondary-text)' }}
                  title="Expand sidebar"
                >
                  <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}; 