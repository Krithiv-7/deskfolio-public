
'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RestartScreenProps {
  onComplete: () => void;
}

const restartMessages = [
  'Saving your settings...',
  'Closing applications...',
  'Restarting...',
  'Please wait...', // Simple message during the brief pause before boot
];

export function RestartScreen({ onComplete }: RestartScreenProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const totalDuration = 3000; // Total restart "shutdown" time in ms (e.g., 3 seconds before boot starts)
    const messageInterval = totalDuration / restartMessages.length;

    const messageTimer = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= restartMessages.length) {
          clearInterval(messageTimer); // Stop changing messages
          // Start fade out after the last message
          setTimeout(() => setFadeOut(true), messageInterval / 2); // Short delay before fading
          // Call onComplete after fade out animation to trigger the boot sequence
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
        'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-blue-300 font-mono transition-opacity duration-500 ease-out', // Similar styling to shutdown
        fadeOut ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div className="text-center space-y-4 w-full max-w-md px-4">
        <p className="text-xl animate-pulse">{restartMessages[currentMessageIndex]}</p>
        {/* Optional: A simple spinner or icon */}
        {/* <Spinner className="mx-auto mt-4 text-blue-400" /> */}
      </div>
    </div>
  );
}

// Optional basic Spinner component if needed (reuse from shutdown if applicable)
// const Spinner = ({ className }: { className?: string }) => ( ... );
