

"use client";

import { useState, useCallback, useRef } from 'react';

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  initialPosition: { x: number; y: number }; // Ensure initialPosition is part of the state
  initialSize: { width: number; height: number };
}

// Define the type for the initial configuration passed to the hook
// Now includes initialPosition as optional (will be managed by DesktopFolio if not provided)
export type InitialWindowsConfig = Record<string, Omit<WindowState, 'zIndex' | 'isOpen' | 'isMinimized' | 'isMaximized'>>;

const initializeWindows = (config: InitialWindowsConfig): Record<string, WindowState> => {
    const initialisedWindows: Record<string, WindowState> = {};
    Object.entries(config).forEach(([id, win], index) => {
      initialisedWindows[id] = {
        ...win,
        // Use provided initialPosition or fallback, though DesktopFolio manages this now
        initialPosition: win.initialPosition || { x: 100 + index * 20, y: 100 + index * 20 },
        isOpen: false, // Windows start closed by default
        isMinimized: false,
        isMaximized: false,
        zIndex: index + 1, // Initial stacking order based on definition order
      };
    });
    return initialisedWindows;
};

export function useWindowManager(initialWindowsConfig: InitialWindowsConfig) {
  const [windows, setWindows] = useState<Record<string, WindowState>>(() => initializeWindows(initialWindowsConfig));
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  // Keep track of windows that were minimized by 'minimize all'
  const minimizedByHome = useRef<Set<string>>(new Set());

   // Function to reset windows to their initial state
  const resetWindows = useCallback(() => {
    setWindows(initializeWindows(initialWindowsConfig));
    setActiveWindowId(null);
    minimizedByHome.current.clear();
  }, [initialWindowsConfig]); // Depends on the initial config


  const bringToFront = useCallback((id: string) => {
    setWindows((prevWindows) => {
      const maxZIndex = Math.max(0, ...Object.values(prevWindows).map(w => w.zIndex));
      const targetWindow = prevWindows[id];

      if (!targetWindow) return prevWindows; // Safety check
      // Prevent bringing to front if minimized
      if (targetWindow.isMinimized) {
         // No setActiveWindowId(null) here, let the caller handle focus logic
         return prevWindows;
      }
      if (targetWindow.zIndex === maxZIndex) {
         // No setActiveWindowId(id) here, let the caller handle focus logic
         return prevWindows; // Already in front
      }

      const updatedWindows = { ...prevWindows };
      // Shift z-indexes of windows above the target window down
      Object.keys(updatedWindows).forEach(key => {
        if (updatedWindows[key].zIndex > targetWindow.zIndex) {
          updatedWindows[key] = { ...updatedWindows[key], zIndex: updatedWindows[key].zIndex - 1 };
        }
      });
      // Bring the target window to the front
      updatedWindows[id] = { ...targetWindow, zIndex: maxZIndex };
      return updatedWindows;
    });
     // Set active ID outside the state setter to avoid race conditions
     setWindows(currentWindows => {
         const windowState = currentWindows[id];
         if(windowState && !windowState.isMinimized) {
            setActiveWindowId(id);
         }
          return currentWindows; // Return unchanged state as activeId is managed separately
     });
  }, []); // Removed activeWindowId dependency

  const openWindow = useCallback((id: string) => {
    let wasJustOpened = false;
    setWindows((prevWindows) => {
      const targetWindow = prevWindows[id];
      if (!targetWindow) return prevWindows; // Safety check

      // If already open and not minimized, just bring to front (no state change needed here)
      if (targetWindow.isOpen && !targetWindow.isMinimized) {
          return prevWindows;
      }

      // Otherwise, set to open and ensure not minimized
      wasJustOpened = true; // Flag that we are opening it now
      const updatedWindow = {
        ...targetWindow,
        isOpen: true,
        isMinimized: false, // Explicitly set to not minimized
      };
      // Clear from minimizedByHome set if opened
      minimizedByHome.current.delete(id);
      return { ...prevWindows, [id]: updatedWindow };
    });
    // Always bring to front when opening or clicking the icon
     // Delay bringToFront slightly if it was just opened, to ensure state update completes
     // This might not be strictly necessary depending on React's batching, but can prevent edge cases
    // setTimeout(() => bringToFront(id), 0);
    bringToFront(id);

  }, [bringToFront]);


  const closeWindow = useCallback((id: string) => {
    let closedWindowZIndex = 0;
    setWindows((prevWindows) => {
      if (!prevWindows[id]) return prevWindows;
      closedWindowZIndex = prevWindows[id].zIndex; // Store zIndex before closing
      const updatedWindow = {
        ...prevWindows[id],
        isOpen: false,
        isMinimized: false, // Reset state on close
        isMaximized: false // Reset state on close
      };
       minimizedByHome.current.delete(id); // Clear on close
       const remainingWindows = { ...prevWindows, [id]: updatedWindow };

        // Adjust z-indices of windows that were above the closed one
        Object.keys(remainingWindows).forEach(key => {
            if (remainingWindows[key].zIndex > closedWindowZIndex) {
                remainingWindows[key] = { ...remainingWindows[key], zIndex: remainingWindows[key].zIndex - 1 };
            }
        });

      return remainingWindows;
    });

    // If the closed window was active, find the next highest window to activate
    if (activeWindowId === id) {
       // Get the latest state inside the callback
        setWindows(currentWindows => {
             const nextActive = Object.values(currentWindows)
               .filter(w => w.isOpen && !w.isMinimized) // Filter currently open & non-minimized windows
               .sort((a, b) => b.zIndex - a.zIndex) // Sort by zIndex descending
               [0]; // Get the one with the highest zIndex
             setActiveWindowId(nextActive ? nextActive.id : null);
             return currentWindows; // No change needed to windows state itself here
        })
    }
  }, [activeWindowId]); // Removed windows dependency as it's accessed via callback

   const minimizeWindow = useCallback((id: string, byHome: boolean = false) => { // Added optional flag
    let minimizedWindowZIndex = 0;
    setWindows((prevWindows) => {
      if (!prevWindows[id] || !prevWindows[id].isOpen || prevWindows[id].isMinimized) return prevWindows; // Don't do anything if not open or already minimized
       minimizedWindowZIndex = prevWindows[id].zIndex;
      const updatedWindow = {
          ...prevWindows[id],
          isMinimized: true,
          isMaximized: false // Cannot be maximized and minimized
      };
       if (byHome) {
         minimizedByHome.current.add(id); // Track if minimized by home button
       } else {
          minimizedByHome.current.delete(id); // Clear if minimized individually
       }

       const updatedWindows = { ...prevWindows, [id]: updatedWindow };

       // Adjust z-indices of windows that were above the minimized one
       // Object.keys(updatedWindows).forEach(key => {
       //     if (updatedWindows[key].zIndex > minimizedWindowZIndex) {
       //         updatedWindows[key] = { ...updatedWindows[key], zIndex: updatedWindows[key].zIndex - 1 };
       //     }
       // });
       // Actually, minimizing shouldn't affect z-index of others

      return updatedWindows;
    });

     // If the minimized window was active, find the next highest window to activate
     if (activeWindowId === id) {
        // Get the latest state inside the callback
        setWindows(currentWindows => {
            const nextActive = Object.values(currentWindows)
            .filter(w => w.isOpen && !w.isMinimized) // Filter only open and non-minimized
            .sort((a, b) => b.zIndex - a.zIndex)[0];
           setActiveWindowId(nextActive ? nextActive.id : null);
           return currentWindows; // No change needed to windows state itself here
        });
      }
  }, [activeWindowId]); // Removed windows dependency

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prevWindows) => {
      if (!prevWindows[id] || !prevWindows[id].isOpen) return prevWindows;
      const isCurrentlyMaximized = prevWindows[id].isMaximized;
      const updatedWindow = {
        ...prevWindows[id],
        isMaximized: !isCurrentlyMaximized,
        isMinimized: false // Ensure not minimized when maximizing/restoring
       };
        minimizedByHome.current.delete(id); // Clear on maximize/restore
      return { ...prevWindows, [id]: updatedWindow };
    });
     // Bring to front only if restoring from maximized or maximizing initially
     setWindows(currentWindows => {
         if(currentWindows[id]?.isOpen && !currentWindows[id]?.isMinimized){
            bringToFront(id); // This will update state again, maybe consolidate logic later
         }
         return currentWindows;
     })
  }, [bringToFront]);

  // This function handles restoring from minimize or focusing an already open window
  const restoreWindow = useCallback((id: string, byHome: boolean = false) => { // Added optional flag
     setWindows(prevWindows => {
         const targetWindow = prevWindows[id];
         // Only restore if it's currently minimized
         if (!targetWindow || !targetWindow.isOpen || !targetWindow.isMinimized) {
             return prevWindows;
         }
         // Restore from minimized state
         const newState = {
             ...prevWindows,
             [id]: { ...targetWindow, isMinimized: false }
         };
         // If restored by home, remove from the set
         if (byHome) {
           minimizedByHome.current.delete(id);
         }
          return newState;
     });
     // Always bring to front when restoring
     bringToFront(id);
  }, [bringToFront]);

   // Toggle minimize all windows based on whether any were minimized by the home button
  const toggleMinimizeAll = useCallback(() => {
      const shouldRestore = minimizedByHome.current.size > 0;
      setWindows(prevWindows => {
          const updatedWindows = { ...prevWindows };
          let changed = false;
          let lastRestoredId: string | null = null; // Track last restored for focus
          Object.keys(updatedWindows).forEach(id => {
              if (updatedWindows[id].isOpen) {
                   if (shouldRestore) {
                       // Only restore windows minimized by home
                       if (minimizedByHome.current.has(id)) {
                            updatedWindows[id] = { ...updatedWindows[id], isMinimized: false };
                            minimizedByHome.current.delete(id);
                            lastRestoredId = id; // Keep track of the last one
                            changed = true;
                       }
                   } else {
                       // Minimize all open, non-minimized windows
                       if (!updatedWindows[id].isMinimized) {
                            updatedWindows[id] = { ...updatedWindows[id], isMinimized: true, isMaximized: false };
                            minimizedByHome.current.add(id); // Track as minimized by home
                            changed = true;
                       }
                   }
              }
          });
           // If minimizing all, clear active window ID
           if (!shouldRestore && changed) {
               setActiveWindowId(null);
           }
           // If restoring, try to activate the last restored window
           else if (shouldRestore && lastRestoredId && changed) {
                // We need to bringToFront, but that happens outside this setter
           }

          return changed ? updatedWindows : prevWindows;
      });

        // After state update, if restoring, bring the last restored window to front
        if(shouldRestore) {
             const lastRestored = Array.from(minimizedByHome.current).pop(); // This might not work as intended due to state update timing
             // A more robust way might be needed if immediate focus after restore is critical.
             // For simplicity, let's rely on the user clicking the taskbar icon if needed.
             // Or potentially find the highest z-index among the *just* restored windows.
             setWindows(currentWindows => {
                 const restoredWindows = Object.values(currentWindows).filter(w => w.isOpen && !w.isMinimized && !minimizedByHome.current.has(w.id)); // Find windows that are now open and not minimized by home
                 if (restoredWindows.length > 0) {
                     restoredWindows.sort((a,b) => b.zIndex - a.zIndex);
                     bringToFront(restoredWindows[0].id);
                 } else {
                     setActiveWindowId(null); // No windows left to activate
                 }
                 return currentWindows;
             })
        }

  }, [bringToFront]);


  const handleFocus = useCallback((id: string) => {
     // Only bring to front if it's not already the active window AND not minimized
     setWindows(currentWindows => { // Read latest state
        const windowState = currentWindows[id];
         if (windowState && windowState.isOpen && !windowState.isMinimized && activeWindowId !== id) {
             bringToFront(id); // This will update state again, maybe consolidate logic later
         } else if (windowState && windowState.isOpen && !windowState.isMinimized && activeWindowId === id) {
             // If it's already active and focused, do nothing extra.
         }
         return currentWindows; // No state change here directly
     })
  }, [activeWindowId, bringToFront]); // Include dependencies


   const handleTaskbarClick = useCallback((id: string) => {
        setWindows(currentWindows => { // Use callback form to get latest state
           const targetWindow = currentWindows[id];
           if (!targetWindow || !targetWindow.isOpen) return currentWindows; // Window isn't open, do nothing

           if (targetWindow.isMinimized) {
                // If minimized by home button, clear the flag - restoreWindow handles this now
               // const wasMinimizedByHome = minimizedByHome.current.has(id);
               restoreWindow(id); // Pass flag to restore (will cause another state update)
           } else if (activeWindowId === id) {
               minimizeWindow(id, false); // Minimize individually (will cause another state update)
           } else {
               bringToFront(id); // Bring to front if inactive but open and not minimized (will cause another state update)
           }
            return currentWindows; // Return current state, subsequent updates handle changes
        });
   }, [activeWindowId, restoreWindow, minimizeWindow, bringToFront]);


  return {
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    handleFocus,
    handleTaskbarClick,
    toggleMinimizeAll,
    resetWindows, // Expose the reset function
    // restoreWindow // Expose if needed directly, but handleTaskbarClick covers the main case
  };
}

