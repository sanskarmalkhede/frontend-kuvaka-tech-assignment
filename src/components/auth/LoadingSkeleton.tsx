export const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex space-x-3">
        {/* Country Code Selector Skeleton */}
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        {/* Phone Input Skeleton */}
        <div className="flex-2">
          <div className="h-4 bg-gray-200 rounded mb-2 w-28"></div>
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      
      {/* Send OTP Button Skeleton */}
      <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}; 