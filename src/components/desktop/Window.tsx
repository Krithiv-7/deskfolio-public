
"use client";

import React, { useState, useRef, useEffect, type ReactNode } from 'react';
import { X, Minimize2, Minus, Square } from 'lucide-react'; // Removed Maximize2 as Square is used
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// import { ScrollArea } from '@/components/ui/scroll-area'; // Removed ScrollArea import

interface WindowProps {
  id: string;
  title: string;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  children: ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  isMobile?: boolean; // Add isMobile prop
}

export function Window({
  id,
  title,
  initialPosition = { x: 10, y: 10 }, // Adjusted default position for mobile
  initialSize = { width: 400, height: 300 },
  children,
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  isMobile, // Use the isMobile prop
}: WindowProps) {
  // Use state based on initial props, adjusting for mobile if necessary
  const [position, setPosition] = useState(isMobile ? { x: 0, y: 0 } : initialPosition);
  // Adjust initial size for mobile - make it full screen
  const [size, setSize] = useState(
    isMobile
      ? { width: typeof window !== 'undefined' ? window.innerWidth : 300, height: typeof window !== 'undefined' ? window.innerHeight - 40 : 400 } // Full width, height minus taskbar
      : initialSize
  );

  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Adjust position and size if isMobile state changes
  useEffect(() => {
      setPosition(isMobile ? { x: 0, y: 0 } : initialPosition);
      setSize(
        isMobile
          ? { width: typeof window !== 'undefined' ? window.innerWidth : 300, height: typeof window !== 'undefined' ? window.innerHeight - 40 : 400 } // Full width, height minus taskbar
          : initialSize
      );
  }, [isMobile, initialPosition, initialSize]); // Simplified dependencies


  // Handle maximizing based on isMaximized or isMobile
  useEffect(() => {
     if (isMaximized || isMobile) { // Maximize if explicitly maximized OR if on mobile
        setPosition({ x: 0, y: 0 });
        // Size is handled by CSS classes for maximized/mobile state
     } else if (!isMaximized && !isMobile) { // Restore only if NOT maximized and NOT mobile
        // Check if the element currently has maximized styles applied
        if(windowRef.current?.classList.contains('mobile-maximized') || windowRef.current?.classList.contains('desktop-maximized')) {
            setPosition(initialPosition);
            setSize(initialSize);
        }
     }
     // No else needed, position/size should remain as is if not maximizing/restoring
  }, [isMaximized, isMobile, initialPosition.x, initialPosition.y, initialSize.width, initialSize.height]); // Dependencies updated


  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (isMaximized || isMobile) return; // Don't drag if maximized or on mobile

    onFocus(id); // Focus when starting drag
    const target = e.target as HTMLElement;
    // Prevent dragging if clicking on title bar buttons
    if (target.closest('button')) {
      return;
    }

    const isTouchEvent = 'touches' in e;
    const clientX = isTouchEvent ? e.touches[0].clientX : e.clientX;
    const clientY = isTouchEvent ? e.touches[0].clientY : e.clientY;

    setIsDragging(true);
    const windowRect = windowRef.current?.getBoundingClientRect();
    if (windowRect) {
      dragOffset.current = {
        x: clientX - windowRect.left,
        y: clientY - windowRect.top,
      };
    }

    if (isTouchEvent) {
        document.addEventListener('touchmove', handleMouseMove as unknown as EventListener);
        document.addEventListener('touchend', handleMouseUp as unknown as EventListener);
    } else {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }
    e.preventDefault(); // Prevent text selection and default touch behaviors
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || isMaximized || isMobile) return; // Don't drag if maximized or on mobile

    const isTouchEvent = 'touches' in e;
    const clientX = isTouchEvent ? e.touches[0].clientX : e.clientX;
    const clientY = isTouchEvent ? e.touches[0].clientY : e.clientY;


    // Calculate potential new position
    let newX = clientX - dragOffset.current.x;
    let newY = clientY - dragOffset.current.y;

    // Boundary checks (keep window within viewport, considering taskbar)
    const taskbarHeight = 40; // Assume taskbar height is 40px
    const windowWidth = size.width; // Use current size state
    const windowHeight = size.height; // Use current size state

    newX = Math.max(0, Math.min(window.innerWidth - windowWidth, newX));
    newY = Math.max(0, Math.min(window.innerHeight - windowHeight - taskbarHeight, newY));

    setPosition({ x: newX, y: newY });
  };


  const handleMouseUp = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    const isTouchEvent = 'touches' in e;
     if (isTouchEvent) {
         document.removeEventListener('touchmove', handleMouseMove as unknown as EventListener);
         document.removeEventListener('touchend', handleMouseUp as unknown as EventListener);
     } else {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
  };

  // Focus window when clicking anywhere inside it (except title bar buttons)
  const handleWindowClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
     // Don't focus if it was a drag-related event on mobile that bubbles up
     if (isDragging && isMobile) return;
     // Focus only if not clicking on a button within the title bar
     const target = e.target as HTMLElement;
     if (!target.closest('.title-bar button')) {
        onFocus(id);
     }
  };

  const handleClose = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); // Prevent triggering window focus/drag
    onClose(id);
  };

  const handleMinimize = (e: React.MouseEvent | React.TouchEvent) => {
     e.stopPropagation(); // Prevent triggering window focus/drag
     onMinimize(id);
   };

   const handleMaximize = (e: React.MouseEvent | React.TouchEvent) => {
     e.stopPropagation(); // Prevent triggering window focus/drag
     // Maximize/Restore logic remains, but CSS handles the visual change on mobile
     onMaximize(id);
   };

  // If window is closed or minimized, don't render it
  if (!isOpen || isMinimized) {
    return null;
  }

  // Determine if window should appear maximized (explicitly or due to mobile view)
  const effectivelyMaximized = isMaximized || isMobile;

  return (
    <div
      ref={windowRef}
      className={cn(
        "absolute flex flex-col bg-card text-card-foreground border border-border overflow-hidden transition-all duration-100 ease-out",
        // Conditional styles for desktop vs mobile/maximized
        isMobile ?
            "mobile-maximized inset-0 bottom-10 rounded-none border-0 shadow-none" // Mobile: fullscreen-like, no border/shadow/rounding
          : effectivelyMaximized ?
            "desktop-maximized inset-0 !bottom-10 !w-auto !h-auto !top-0 !left-0 rounded-none border-0 shadow-lg" // Desktop Maximized: uses important flags
          : "rounded-md shadow-lg", // Desktop Normal: default styles
        isDragging ? "cursor-grabbing select-none" : "cursor-default", // Add select-none while dragging
        (!isOpen || isMinimized) && "hidden" // Handled above, but keep for clarity
      )}
      style={
        effectivelyMaximized
          ? { zIndex } // Only zIndex is needed when maximized/mobile
          : {
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: `${size.width}px`,
              height: `${size.height}px`,
              zIndex,
            }
      }
      onClick={handleWindowClick} // Use the click handler for focusing
      onTouchStart={handleWindowClick} // Also focus on touch start
    >
      {/* Title Bar - Draggable Area */}
      <div
        className={cn(
            "title-bar flex items-center justify-between px-2 py-1 text-primary-foreground title-bar-gradient select-none flex-shrink-0",
            // Cursor based on state
             isDragging ? "cursor-grabbing" : (isMobile || isMaximized ? "cursor-default" : "cursor-grab"),
             // Add touch-action: none to prevent scrolling while dragging title bar
             "touch-action-none"
        )}
        onMouseDown={handleMouseDown} // Attach mouse down listener here
        onTouchStart={handleMouseDown} // Attach touch start listener here
      >
         {/* Adjust title size for mobile */}
        <span className="font-semibold text-xs md:text-sm truncate pr-2 pointer-events-none">{title}</span>
        <div className="flex items-center space-x-0.5 md:space-x-1"> {/* Reduced spacing on mobile */}
          {/* Buttons - stopPropagation used in handlers */}
          {/* Hide Minimize button on mobile */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0 text-primary-foreground hover:bg-white/20 focus-visible:bg-white/30"
              onClick={handleMinimize}
              onTouchEnd={handleMinimize} // Use onTouchEnd for tap
              aria-label="Minimize"
            >
              <Minus size={14} />
            </Button>
           )}
           {/* Hide Maximize/Restore button on mobile */}
           {!isMobile && (
            <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0 text-primary-foreground hover:bg-white/20 focus-visible:bg-white/30"
                onClick={handleMaximize}
                onTouchEnd={handleMaximize}
                aria-label={isMaximized ? "Restore" : "Maximize"}
            >
                 {/* Use Minimize2 for restore icon */}
                {isMaximized ? <Minimize2 size={14} /> : <Square size={14} />}
            </Button>
           )}
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 p-0 text-primary-foreground hover:bg-destructive/80 hover:text-destructive-foreground focus-visible:bg-destructive/90 focus-visible:text-destructive-foreground"
            onClick={handleClose}
            onTouchEnd={handleClose}
            aria-label="Close"
          >
            <X size={14} />
          </Button>
        </div>
      </div>

      {/* Content Area - Adjust padding for mobile */}
      {/* Use window-gradient for desktop, plain background for mobile */}
      {/* Removed outer ScrollArea wrapper */}
      <div className={cn(
            "flex-grow overflow-hidden", // Use overflow-hidden here to prevent double scrollbars
            isMobile ? "p-2 bg-card" : "p-2 md:p-4 window-gradient" // Mobile has less padding and plain bg
        )}>
         {children}
      </div>

      {/* Resizing Handles (Hidden when maximized or mobile) */}
      {!effectivelyMaximized && (
        <>
          {/* Add resize handles here if implementing resizing - Requires significant additional logic */}
          {/* Example: <div className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize"></div> */}
        </>
      )}
    </div>
  );
}
