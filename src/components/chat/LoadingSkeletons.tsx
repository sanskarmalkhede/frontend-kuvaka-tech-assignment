'use client';

interface LoadingSkeletonsProps {
  count?: number;
}

export function LoadingSkeletons({ count = 5 }: LoadingSkeletonsProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <MessageSkeleton key={index} isUser={index % 2 === 0} />
      ))}
    </div>
  );
}

function MessageSkeleton({ isUser }: { isUser: boolean }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className="max-w-[70%]">
        <div
          className={`
            px-4 py-3 rounded-2xl shadow-sm animate-pulse
            ${isUser 
              ? 'bg-[var(--user-bubble)] rounded-br-md' 
              : 'bg-[var(--llm-bubble)] rounded-bl-md'
            }
          `}
        >
          <div className="space-y-2">
            <div className="h-4 bg-[var(--border)] rounded w-3/4"></div>
            <div className="h-4 bg-[var(--border)] rounded w-1/2"></div>
            <div className="h-3 bg-[var(--border)] rounded w-1/4 mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PaginationSkeleton() {
  return (
    <div className="flex justify-center py-4">
      <div className="flex items-center space-x-2 px-4 py-2 bg-[var(--card-bg)] rounded-full shadow-sm animate-pulse">
        <div className="w-4 h-4 bg-[var(--border)] rounded-full"></div>
        <div className="h-4 bg-[var(--border)] rounded w-24"></div>
      </div>
    </div>
  );
} 