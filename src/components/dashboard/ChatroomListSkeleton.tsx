export const ChatroomListSkeleton = () => {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="relative p-3 sm:p-4 rounded-lg border animate-pulse"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div 
                className="h-4 sm:h-5 rounded mb-2"
                style={{ 
                  backgroundColor: 'var(--border)',
                  width: `${Math.random() * 40 + 40}%`
                }}
              />
              <div 
                className="h-3 sm:h-4 rounded"
                style={{ 
                  backgroundColor: 'var(--border)',
                  width: '30%'
                }}
              />
            </div>
            
            <div className="ml-2">
              <div 
                className="w-4 h-4 sm:w-5 sm:h-5 rounded"
                style={{ backgroundColor: 'var(--border)' }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 