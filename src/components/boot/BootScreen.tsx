
'use client';

import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface BootScreenProps {
  onComplete: () => void;
}

const bootMessages = [
  'Initializing Deskfolio...',
  'Loading system components...',
  'Mounting virtual drives...',
  'Establishing network connection...',
  'Loading user profile...',
  'Applying personalization settings...',
  'Starting desktop environment...',
  'Almost there...',
];

export function BootScreen({ onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const totalDuration = 5000; // Total boot time in ms (e.g., 5 seconds)
    const messageInterval = totalDuration / bootMessages.length;
    const progressIncrement = 100 / bootMessages.length;

    const messageTimer = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= bootMessages.length) {
          clearInterval(messageTimer); // Stop changing messages
          return prevIndex; // Keep the last message index
        }
        // Update progress roughly with message changes
        setProgress((prevProgress) => Math.min(100, prevProgress + progressIncrement));
        return nextIndex;
      });
    }, messageInterval);

    // More granular progress update
    const progressTimer = setInterval(() => {
      setProgress((prevProgress) => {
        const nextProgress = prevProgress + 1;
        if (nextProgress >= 100) {
          clearInterval(progressTimer);
          // Start fade out after a short delay
          setTimeout(() => setFadeOut(true), 300);
          // Call onComplete after fade out animation
          setTimeout(onComplete, 800); // 500ms for fade out + 300ms delay
          return 100;
        }
        return nextProgress;
      });
    }, totalDuration / 100); // Update progress every %

    // Blinking cursor effect
    const blinkTimer = setInterval(() => {
      setShowMessage((prev) => !prev);
    }, 500); // Blink speed

    return () => {
      clearInterval(messageTimer);
      clearInterval(progressTimer);
      clearInterval(blinkTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onComplete]); // Dependency array includes onComplete

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-green-400 font-mono transition-opacity duration-500 ease-out',
        fadeOut ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div className="text-center space-y-4 w-full max-w-md px-4">
        {/* Optional: BIOS-like info */}
        <div className="text-sm text-left mb-8 text-gray-500">
          <p>Deskfolio BIOS v1.0</p>
          <p>Copyright (C) 2024 Krithiv Jayaprakash</p>
          <p>CPU: Emulated Web Processor @ 3.0GHz</p>
          <p>Memory Check: 65536K OK</p>
          <br />
        </div>

        <div className="h-6"> {/* Fixed height container for message */}
          {showMessage && (
             <p className="text-lg animate-pulse">{bootMessages[currentMessageIndex]}_</p>
          )}
           {!showMessage && (
             <p className="text-lg opacity-0">{bootMessages[currentMessageIndex]}_</p>
           )}
        </div>

        <Progress value={progress} className="w-full h-2 bg-gray-700 [&>div]:bg-green-500" />

        {/* Optional: ASCII Art */}
        {/* <pre className="text-xs text-green-300 opacity-50">
          {`
             .--""--.
            /        \\
           |  O    O  |
           \\   ><   /
            \`------'\`
          `}
        </pre> */}
      </div>
    </div>
  );
}
