'use client';

import { useState } from 'react';
import { Message } from '@/store/chatroom';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [showCopy, setShowCopy] = useState(false);
  const [copied, setCopied] = useState(false);
  const { content, sender, timestamp, type, imageUrl } = message;
  
  const isUser = sender === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      onMouseEnter={() => setShowCopy(true)}
      onMouseLeave={() => setShowCopy(false)}
    >
      <div className={`max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`
            relative px-4 py-3 rounded-2xl shadow-sm
            ${isUser 
              ? 'bg-[var(--user-bubble)] text-[var(--primary-text)] rounded-br-md' 
              : 'bg-[var(--llm-bubble)] text-[var(--primary-text)] rounded-bl-md'
            }
          `}
        >
          {/* Copy Button */}
          {showCopy && (
            <button
              onClick={handleCopy}
              className={`
                absolute -top-2 ${isUser ? '-left-2' : '-right-2'}
                bg-[var(--card-bg)] border border-[var(--border)]
                rounded-full p-1.5 shadow-lg opacity-0 hover:opacity-100
                transition-opacity duration-200 group
                ${showCopy ? 'opacity-100' : ''}
              `}
              title={copied ? 'Copied!' : 'Copy message'}
            >
              {copied ? (
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-[var(--secondary-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          )}

          {/* Message Content */}
          {type === 'image' && imageUrl && (
            <div className="mb-2">
              <img 
                src={imageUrl} 
                alt="Uploaded" 
                className="max-w-full h-auto rounded-lg shadow-sm"
                style={{ maxHeight: '300px' }}
              />
            </div>
          )}
          
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </div>

          {/* Timestamp */}
          <div 
            className={`
              text-xs text-[var(--secondary-text)] mt-1 
              ${isUser ? 'text-right' : 'text-left'}
            `}
          >
            {formatTime(timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
} 