
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type React from 'react'; // Import React for MouseEvent and TouchEvent types

interface DesktopIconProps {
  id: string; // Add id prop
  icon: LucideIcon;
  label: string;
  onClick?: () => void; // Changed from onDoubleClick to onClick
  onMouseDown?: (event: React.MouseEvent | React.TouchEvent, id: string) => void; // Add mouse down/touch start handler prop
  onTouchStart?: (event: React.TouchEvent, id: string) => void; // Add touch start handler prop (optional, can combine logic in onMouseDown)
  style?: React.CSSProperties; // Add style prop for positioning
  isDragging?: boolean; // Add prop to indicate dragging state
  className?: string;
}


export function DesktopIcon({
    id,
    icon: Icon,
    label,
    onClick,
    onMouseDown, // Receive handler for mouse down
    onTouchStart, // Receive handler for touch start
    style, // Receive style
    isDragging, // Receive dragging state
    className
}: DesktopIconProps) {

  const handleMouseDownOrTouchStart = (e: React.MouseEvent | React.TouchEvent) => {
      // Call the appropriate handler passed via props
      if ('touches' in e) {
           onTouchStart?.(e, id);
      } else {
           onMouseDown?.(e, id);
      }
      // Alternatively, could combine logic into a single prop handler if preferred
      // onMouseDown?.(e, id);
  };


  return (
    <div // Changed from button to div for better dragging control (prevent button default behaviors)
      data-icon-id={id} // Add data attribute for identification in drag handlers
      className={cn(
        'flex flex-col items-center justify-start pt-2 text-center rounded-md hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-ring focus:bg-primary/30 select-none overflow-hidden', // Added overflow-hidden
        // Use white text and apply a text shadow for contrast
        'text-white text-shadow-md', // Apply text shadow class
        isDragging ? 'opacity-75 cursor-grabbing z-50' : 'cursor-grab', // Style while dragging
        className // Apply dynamic classes (e.g., for mobile size)
      )}
      style={style} // Apply dynamic style for positioning
      onMouseDown={handleMouseDownOrTouchStart} // Attach combined handler for mouse down
      onTouchStart={handleMouseDownOrTouchStart} // Attach combined handler for touch start
      onClick={(e) => {
          // Prevent click if dragging (simple check, might need refinement)
          // A more robust check might involve comparing position on down vs up
          if (isDragging) {
              e.stopPropagation(); // Stop propagation if dragging
              return;
          }
           onClick?.();
      }}
      aria-label={`Open ${label}`}
    >
      {/* Adjust icon size based on parent className (set in page.tsx) */}
      <Icon className="w-8 h-8 md:w-10 md:h-10 mb-1 drop-shadow-md pointer-events-none flex-shrink-0" strokeWidth={1.5} />
      {/* Allow label to wrap slightly if needed, adjust line height */}
      <span className="w-full pointer-events-none leading-tight px-1">{label}</span>
    </div>
  );
}
