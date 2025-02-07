import React from "react";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-6 lg:mb-8">
          <div className="w-24 h-6 bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
        </div>

        <article>
          <div className="overflow-hidden border-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-lg">
            {/* Skeleton Hero Section */}
            <div className="relative aspect-[21/9] bg-gray-300 dark:bg-gray-700 animate-pulse" />

            {/* Content Section */}
            <div className="p-6 sm:p-8 lg:p-12 space-y-6 lg:space-y-8">
              {/* Title */}
              <div className="h-10 bg-gray-300 dark:bg-gray-700 animate-pulse rounded w-3/4" />

              {/* Meta Information */}
              <div className="h-4 bg-gray-300 dark:bg-gray-700 animate-pulse rounded w-1/2" />

              {/* Content */}
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 animate-pulse rounded w-full" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 animate-pulse rounded w-5/6" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 animate-pulse rounded w-3/4" />
              </div>

              {/* Video Embed Placeholder */}
              <div className="mt-8 h-48 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-lg" />

              {/* Author & Keywords */}
              <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 animate-pulse rounded w-1/3" />
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
                  <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
                  <div className="h-6 w-14 bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
