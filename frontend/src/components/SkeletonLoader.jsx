import React from 'react';

export const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
          <div className="flex space-x-4">
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
