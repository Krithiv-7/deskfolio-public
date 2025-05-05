
'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ShutdownScreenProps {
  onComplete: () => void;
}

const shutdownMessages = [
  'Saving your settings...',
  'Closing applications...',
  'Shutting down network connections...',
  'Windows is shutting down...',
  'Goodbye!',
];

export function ShutdownScreen({ onComplete }: ShutdownScreenProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const totalDuration = 4000; // Total shutdown time in ms (e.g., 4 seconds)
    const messageInterval = totalDuration / shutdownMessages.length;

    const messageTimer = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= shutdownMessages.length) {
          clearInterval(messageTimer); // Stop changing messages
          // Start fade out after the last message
          setTimeout(() => setFadeOut(true), messageInterval / 2); // Short delay before fading
          // Call onComplete after fade out animation
          setTimeout(onComplete, messageInterval / 2 + 500); // Delay + fade duration
          return prevIndex; // Keep the last message index
        }
        return nextIndex;
      });
    }, messageInterval);

    return () => {
      clearInterval(messageTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onComplete]); // Dependency array includes onComplete

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-blue-300 font-mono transition-opacity duration-500 ease-out', // Similar styling to boot screen but different text color
        fadeOut ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div className="text-center space-y-4 w-full max-w-md px-4">
        <p className="text-xl animate-pulse">{shutdownMessages[currentMessageIndex]}</p>
        {/* Optional: A simple spinner or icon */}
        {/* <Spinner className="mx-auto mt-4 text-blue-400" /> */}
      </div>
    </div>
  );
}

// Optional basic Spinner component if needed:
// const Spinner = ({ className }: { className?: string }) => (
//   <svg
//     className={cn("animate-spin h-8 w-8", className)}
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//   >
//     <circle
//       className="opacity-25"
//       cx="12"
//       cy="12"
//       r="10"
//       stroke="currentColor"
//       strokeWidth="4"
//     ></circle>
//     <path
//       className="opacity-75"
//       fill="currentColor"
//       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//     ></path>
//   </svg>
// );

