# Components Documentation

This document describes the main React components used in the Deskfolio application.

## Core UI Components

### `/app/page.tsx` (DesktopFolio)

*   **Purpose:** The main component that orchestrates the entire desktop experience.
*   **Responsibilities:**
    *   Manages the overall application state (`booting`, `login`, `desktop`, `shuttingDown`, `restarting`).
    *   Manages authentication state (`isAuthenticated`).
    *   Detects mobile view using the `use-mobile.tsx` hook (`isMobile` state).
    *   Initializes and manages desktop icon positions (`desktopIcons` state).
    *   Handles drag-and-drop logic for desktop icons (`draggingIconId`, `dragOffset`, event handlers).
    *   Uses the `useWindowManager` hook to manage window states.
    *   Fetches and displays the desktop wallpaper.
    *   Renders `DesktopIcon`, `Window`, and `Taskbar` components, passing `isMobile` prop where needed.
    *   Defines the content for each window (`initialWindowsConfig`).

### `/components/desktop/DesktopIcon.tsx`

*   **Purpose:** Represents an icon on the desktop.
*   **Features:**
    *   Displays an icon (from `lucide-react`) and a label.
    *   Triggers the `openWindow` function from `useWindowManager` when single-clicked.
    *   Supports drag-and-drop functionality initiated by `onMouseDown` or `onTouchStart`.
    *   Styled with Tailwind CSS, including text shadow for visibility against wallpapers.
    *   Position is controlled by the parent (`DesktopFolio`) via `style` prop.
    *   Adapts size and text size based on the `isMobile` state (via className in `DesktopFolio`).

### `/components/desktop/Window.tsx`

*   **Purpose:** Simulates a draggable, closable, minimizable, and maximizable application window. Adapts to fullscreen on mobile.
*   **Features:**
    *   Displays a title bar with minimize (desktop only), maximize/restore (desktop only), and close buttons.
    *   Content area displays the children passed to it (defined in `initialWindowsConfig`).
    *   Uses `ScrollArea` internally within content definitions (like in `SkillsContent`) for overflow.
    *   State (isOpen, isMinimized, isMaximized, zIndex) is controlled by `useWindowManager`.
    *   Position and size are managed internally, influenced by `initialPosition`, `initialSize`, `isMaximized`, and `isMobile`.
    *   Handles dragging via the title bar (`handleMouseDown`, `handleMouseMove`, `handleMouseUp`), disabled on mobile or when maximized.
    *   Calls `onFocus` when clicked (outside buttons) to bring the window to the front.
    *   Applies specific styles when maximized or on mobile (fullscreen-like).
    *   Styled with Tailwind CSS and custom gradients (`title-bar-gradient`, `window-gradient`) on desktop.

### `/components/desktop/Taskbar.tsx`

*   **Purpose:** Simulates the desktop taskbar.
*   **Features:**
    *   Displays buttons for currently open windows (desktop only). Clicking a button interacts with `useWindowManager` (minimize, restore, focus).
    *   Includes buttons for:
        *   Fullscreen toggle.
        *   Theme toggle (light/dark).
        *   Restart.
        *   Home (Minimize/Restore All).
        *   Shutdown.
    *   Displays the current date and time, updated periodically.
    *   Adapts layout for mobile (hides window buttons, adjusts spacing).
    *   Styled with Tailwind CSS, using `secondary` colors for a neutral look. Center control buttons use `card` background.

## Simulation Components

### `/components/boot/BootScreen.tsx`

*   **Purpose:** Simulates a PC boot sequence.
*   **Features:**
    *   Displays a series of boot messages.
    *   Shows a progress bar.
    *   Has a fixed duration (approx. 5 seconds) before calling the `onComplete` callback.
    *   Styled with a black background and green text for a classic terminal look.

### `/components/login/LoginScreen.tsx`

*   **Purpose:** Simulates a login screen.
*   **Features:**
    *   Displays a welcome message and a user icon.
    *   Includes a "Username" field (pre-filled and read-only as "Guest").
    *   Provides a "Login" button (no password required).
    *   Simulates a login delay upon clicking the button before calling `onLoginSuccess`.
    *   Uses the current wallpaper as its background.
    *   Styled using ShadCN `Card` components with backdrop blur for a frosted glass effect.

### `/components/shutdown/ShutdownScreen.tsx`

*   **Purpose:** Simulates a PC shutdown sequence.
*   **Features:**
    *   Displays a series of shutdown messages.
    *   Has a fixed duration (approx. 4 seconds) before calling the `onComplete` callback (which redirects the user to `about:blank`).
    *   Styled with a black background and blue text.

### `/components/restart/RestartScreen.tsx`

*   **Purpose:** Simulates a PC restart sequence.
*   **Features:**
    *   Displays a series of restart messages.
    *   Has a fixed duration (approx. 3 seconds) before calling the `onComplete` callback (which resets the app state to 'booting').
    *   Styled similarly to the shutdown screen.

## Utility Components

### `/components/ui/*`

*   These are standard ShadCN UI components (Button, Card, Badge, ScrollArea, Separator, etc.) used throughout the application. They are styled according to the theme defined in `globals.css`.

### `/components/theme-provider.tsx`

*   Wrapper component using `next-themes` to enable light/dark theme switching.

## Modifying Window Content

The content displayed inside each desktop window (like "About Me", "Skills", "Projects", "Education", "Certifications", "Blog", "Contact") is defined within the `initialWindowsConfig` constant in the main page component:

*   **File:** `src/app/page.tsx`

Inside this file, look for the `initialWindowsConfig` object. Each key in this object represents a window (e.g., `aboutMe`, `skills`, `projects`). The `content` property for each window entry contains the React JSX that will be rendered inside that window's content area.

**Example Structure:**

```javascript
// Inside src/app/page.tsx

const initialWindowsConfig = {
  aboutMe: { // Window ID
    id: 'aboutMe',
    title: 'About Me', // Window Title
    icon: User,          // Desktop Icon
    initialSize: { width: 600, height: 550 },
    content: (           // <<< --- Modify this JSX to change window content
      <ScrollArea className="h-full w-full p-1">
        <div className="space-y-4 md:space-y-6">
            <Card className="border-none shadow-none bg-transparent">
                {/* CardHeader, CardContent with text, etc. */}
                <p className="text-muted-foreground mb-4">
                  Hello! I’m Krithiv Jayaprakash...
                  {/* More content here */}
                </p>
            </Card>
            {/* More components like Separator, other Cards, etc. */}
        </div>
      </ScrollArea>
    ),
  },
  skills: { // Example for Skills
    id: 'skills',
    title: 'Skills',
    icon: Brain,
    initialSize: { width: 700, height: 500 },
    // Note: SkillsContent component handles its own internal layout and data fetching/display
    content: <SkillsContent />, // <<< --- Often uses a separate component like SkillsContent
  },
  projects: { // Example for Projects
    id: 'projects',
    title: 'Projects',
    icon: Briefcase,
    initialSize: { width: 650, height: 500 },
    content: (
        <ScrollArea className="h-full w-full p-1">
            <div className="space-y-4 md:space-y-6">
                {/* Project details using Cards, Badges, etc. */}
            </div>
        </ScrollArea>
    ),
  },
  // ... other window configurations (education, certifications, blog, contact)
};

// Component definition for SkillsContent (usually nearby or imported)
const SkillsContent = () => {
    // ... state and logic for displaying skills ...
    return (
        <div className="flex flex-col md:flex-row h-full p-1 gap-4">
            {/* Left Panel (Scrollable List) */}
            <ScrollArea className="w-full md:w-1/3 border-r pr-4 mb-4 md:mb-0 h-full">
                {/* Skill categories and badges */}
            </ScrollArea>
            {/* Right Panel (Details) */}
            <div className="w-full md:w-2/3 flex flex-col items-center justify-start pt-4 md:pt-8">
                {/* Selected skill details */}
            </div>
        </div>
    );
};
```

To change what appears in a specific window:

1.  Navigate to `src/app/page.tsx`.
2.  Locate the `initialWindowsConfig` constant.
3.  Find the corresponding entry for the window you want to edit (e.g., `aboutMe`, `projects`, `skills`, `education`, `certifications`, `blog`, `contact`).
4.  Modify the JSX within the `content:` property for that entry.
    *   You can directly change text, add/remove HTML elements, update Tailwind CSS classes, or adjust component usage (e.g., change `<Card>` structure).
    *   Ensure content is wrapped appropriately, often within a `<ScrollArea>` if it might exceed the window height, especially for text-heavy sections.
    *   For more complex content (like the "Skills" window), the `content` renders a separate component (e.g., `<SkillsContent />`). In these cases, you would need to find and edit that component's definition, likely still within `src/app/page.tsx` or imported nearby. The data for these components (like `skillsData`) is usually defined near the component itself.

Remember that the content is standard React JSX, so you can use components (like `<Card>`, `<Button>`, `<Badge>`, `<Separator>`), text, images, and any valid HTML structure. Keep your changes within the `content: (...)` block or the associated content component for the specific window.
```