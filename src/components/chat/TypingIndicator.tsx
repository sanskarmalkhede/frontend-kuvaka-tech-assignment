'use client';

export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[70%]">
        <div className="bg-[var(--llm-bubble)] px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[var(--primary-text)]">Gemini is typing</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-[var(--secondary-text)] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[var(--secondary-text)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-[var(--secondary-text)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 