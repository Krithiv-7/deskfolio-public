

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Home, Expand, Shrink, Sun, Moon, PowerOff, RefreshCw } from 'lucide-react'; // Removed FileText
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WindowState } from '@/hooks/useWindowManager'; // Assuming type export
import { format } from 'date-fns'; // Import date-fns for formatting
import { useTheme } from "next-themes"; // Import useTheme hook

interface TaskbarProps {
  windows: Record<string, WindowState>;
  onTaskbarClick: (id: string) => void;
  activeWindowId: string | null;
  onHomeClick?: () => void; // Add optional prop for home button click
  onShutdownClick?: () => void; // Add optional prop for shutdown button click
  onRestartClick?: () => void; // Add optional prop for restart button click
  isMobile?: boolean; // Add isMobile prop
}

export function Taskbar({ windows, onTaskbarClick, activeWindowId, onHomeClick, onShutdownClick, onRestartClick, isMobile }: TaskbarProps) {
  const openWindows = Object.values(windows).filter(w => w.isOpen);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false); // State to track component mount
  const { theme, setTheme } = useTheme();

  // --- Fullscreen Logic ---
  const handleFullscreenChange = useCallback(() => {
     // Ensure document exists before checking fullscreenElement
     if (typeof document !== 'undefined') {
        setIsFullscreen(!!document.fullscreenElement);
     }
  }, []);


  useEffect(() => {
    setMounted(true); // Component is mounted on the client

    // Client-side only checks and operations
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      // Date/Time Update
      const updateDateTime = () => {
        const now = new Date();
        setCurrentTime(format(now, 'h:mm a')); // Format time (e.g., 10:00 AM)
        setCurrentDate(format(now, 'M/d/yyyy')); // Format date (e.g., 7/28/2024)
      };

      updateDateTime(); // Initial update
      const intervalId = setInterval(updateDateTime, 60000); // Update every minute

      // Fullscreen Listener
      document.addEventListener('fullscreenchange', handleFullscreenChange);

      // Set initial fullscreen state
       handleFullscreenChange(); // Call handler initially to set state correctly

      // Cleanup
      return () => {
        clearInterval(intervalId); // Cleanup interval on component unmount
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
      };
    }
  }, [handleFullscreenChange]);

  const toggleFullscreen = async () => {
     if (typeof document === 'undefined') return; // Guard against SSR

    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        // No need to manually set state, listener will handle it
      } catch (err) {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      }
    } else {
      try {
        await document.exitFullscreen();
         // No need to manually set state, listener will handle it
      } catch (err) {
        console.error(`Error attempting to disable full-screen mode: ${err.message} (${err.name})`);
      }
    }
  };
  // --- End Fullscreen Logic ---

  // --- Theme Toggle Logic ---
   const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
   // --- End Theme Toggle Logic ---


   // Avoid rendering theme toggle until mounted to prevent hydration mismatch
   if (!mounted) {
    // Render a placeholder or null during SSR/hydration phase
     return (
        <div className="fixed bottom-0 left-0 right-0 h-10 bg-secondary text-secondary-foreground flex items-center justify-between px-1 md:px-2 shadow-inner z-50 border-t border-border">
            {/* Placeholder content or simplified taskbar */}
             <div className="flex items-center space-x-1 overflow-x-auto flex-1 min-w-0">
                 {/* Minimal placeholders */}
                <div className="h-8 w-8 flex-shrink-0 mr-1"></div>
                 <div className="h-8 w-8 flex-shrink-0 mr-1"></div>
            </div>
            {/* Conditional rendering for center controls might be complex here, keep minimal */}
            <div className="flex-shrink-0 flex items-center justify-end space-x-1 md:space-x-2 text-xs px-1 md:px-2 min-w-[80px] md:min-w-[120px]">
                 <span className="opacity-50">...</span>
            </div>
        </div>
    );
  }


  return (
    // Use secondary background and foreground for a neutral taskbar
    // Adjust padding for mobile
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-secondary text-secondary-foreground flex items-center justify-between px-1 md:px-2 shadow-inner z-50 border-t border-border">
       {/* Left Section: Toggle Buttons & Window Buttons */}
       {/* Adjusted spacing for mobile */}
      <div className="flex items-center space-x-0.5 md:space-x-1 overflow-x-auto flex-1 min-w-0">
         {/* Fullscreen Toggle Button */}
         <Button
           variant="ghost"
           className="h-8 w-8 p-0 text-secondary-foreground hover:bg-muted/50 focus-visible:bg-muted/70 flex-shrink-0 mr-0.5 md:mr-1" // Always show fullscreen button now
           onClick={toggleFullscreen}
           aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
           title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
         >
           {isFullscreen ? <Shrink size={18} /> : <Expand size={18} />}
         </Button>

          {/* Theme Toggle Button */}
         <Button
           variant="ghost"
           className="h-8 w-8 p-0 text-secondary-foreground hover:bg-muted/50 focus-visible:bg-muted/70 flex-shrink-0 mr-0.5 md:mr-1" // Consistent margin
           onClick={toggleTheme}
           aria-label={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
           title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
         >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
         </Button>

        {/* Window Buttons - Hide on mobile */}
        {!isMobile && openWindows.map((win) => (
          <Button
            key={win.id}
            variant="ghost"
            className={cn(
              "h-8 px-2 md:px-3 text-xs md:text-sm truncate max-w-[80px] md:max-w-[150px] text-secondary-foreground hover:bg-muted/50 focus-visible:bg-muted/70", // Adjusted padding/size/max-width
              win.id === activeWindowId && !win.isMinimized ? "bg-muted font-semibold" : "", // Use muted for active
              win.isMinimized ? "opacity-70" : ""
            )}
            onClick={() => onTaskbarClick(win.id)}
            title={win.title} // Add tooltip for truncated titles
          >
            {win.title}
          </Button>
        ))}
      </div>

       {/* Center Section: Controls */}
       {/* Center alignment needs flex-1 on left/right or absolute positioning */}
       <div className={cn(
            "absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-1 md:space-x-2",
            // isMobile && "hidden sm:flex" // Keep showing on mobile
        )}>
         {/* Restart Button */}
         <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-primary bg-card hover:bg-primary/10 focus-visible:bg-primary/20 rounded-sm shadow-md border border-border"
            aria-label="Restart"
            onClick={onRestartClick}
            title="Restart"
          >
            <RefreshCw size={18} />
          </Button>
        {/* Home Button */}
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-secondary-foreground bg-card hover:bg-accent/10 focus-visible:bg-accent/20 rounded-sm shadow-md border border-border"
          aria-label="Home / Minimize All"
          onClick={onHomeClick}
          title="Home / Minimize All"
        >
          <Home size={18} />
        </Button>
        {/* Shutdown Button */}
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-destructive bg-card hover:bg-destructive/10 focus-visible:bg-destructive/20 rounded-sm shadow-md border border-border"
          aria-label="Shutdown"
          onClick={onShutdownClick}
          title="Shutdown"
        >
          <PowerOff size={18} />
        </Button>
      </div>

       {/* Right Section: Date and Time */}
       {/* Reduced min-width and padding for mobile */}
      <div className="flex-shrink-0 flex items-center justify-end space-x-1 md:space-x-2 text-xs px-1 md:px-2 min-w-[80px] md:min-w-[120px]">
        {/* Removed Resume Button */}

         {/* Date and Time */}
         {currentTime && (
            <>
                 {/* Time */}
                 <span className="inline">{currentTime}</span>
                {/* Date - Hide on smaller screens */}
                 <span className="hidden md:inline">{currentDate}</span>
            </>
         )}
         {!currentTime && <span className="opacity-50">...</span>}
      </div>
    </div>
  );
}
