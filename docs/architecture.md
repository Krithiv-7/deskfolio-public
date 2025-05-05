# Application Architecture

Deskfolio is built using Next.js with the App Router, React, TypeScript, and Tailwind CSS. It simulates a desktop environment within the browser.

## Core Technologies

*   **Next.js (App Router):** Framework for server-rendered React applications. The App Router is used for routing and layout management.
*   **React:** Library for building user interfaces. Functional components and hooks are used extensively.
*   **TypeScript:** Superset of JavaScript adding static types for better code quality and maintainability.
*   **Tailwind CSS:** Utility-first CSS framework for styling.
*   **ShadCN UI:** Collection of reusable UI components built with Radix UI and Tailwind CSS, customized for the application's theme.
*   **Lucide Icons:** Icon library used throughout the application.
*   **date-fns:** Library for date/time formatting (used in the Taskbar).

## High-Level Flow

1.  **Boot Sequence (`/components/boot/BootScreen.tsx`):** When the application loads, it first displays a boot screen simulation for a set duration.
2.  **Login (`/components/login/LoginScreen.tsx`):** After booting, a login screen is presented. Currently, it allows login as "Guest" without a password.
3.  **Desktop (`/app/page.tsx`):** Upon successful login, the main `DesktopFolio` component renders the desktop interface.
    *   It detects if the user is on a mobile device using `use-mobile.tsx`.
    *   It fetches a dynamic wallpaper from Picsum Photos.
    *   It renders `DesktopIcon` components based on `initialWindowsConfig`.
    *   It manages the state of open/closed/minimized/maximized windows using the `useWindowManager` hook.
    *   It manages the position of desktop icons using state and drag-and-drop handlers.
    *   It renders `Window` components for each open, non-minimized window, adapting their appearance for mobile.
    *   It renders the `Taskbar` component at the bottom, which also adapts for mobile.
4.  **Window Management (`/hooks/useWindowManager.ts`):** This custom hook centralizes the logic for managing window states (open, minimized, maximized, z-index). It provides functions to open, close, minimize, maximize, focus, and minimize/restore all windows.
5.  **Icon Management (`/app/page.tsx`):** The main page component manages the position of desktop icons using React state (`desktopIcons`). It handles drag-and-drop functionality for these icons.
6.  **Taskbar (`/components/desktop/Taskbar.tsx`):** Displays currently open windows (on desktop), provides controls for theme toggling, fullscreen, restarting, shutting down, and minimizing all windows (Home button). It also shows the current date and time. Adapts its layout for mobile.
7.  **Shutdown/Restart (`/components/shutdown/*`, `/components/restart/*`):** These components simulate the shutdown and restart processes with animations before either redirecting the user (shutdown) or reloading the application state (restart).

## State Management

*   **Window State:** Managed primarily by the `useWindowManager` hook.
*   **Desktop Icon Positions:** Managed by local state (`desktopIcons`) within the `DesktopFolio` component (`/app/page.tsx`), along with drag state (`draggingIconId`).
*   **Application Lifecycle State (`appState`):** Managed by local state within `DesktopFolio`, tracking whether the app is `booting`, `login`, `desktop`, `shuttingDown`, or `restarting`.
*   **Authentication State (`isAuthenticated`):** A boolean flag managed in `DesktopFolio`, set after login.
*   **Mobile State (`isMobile`):** A boolean flag managed in `DesktopFolio`, derived from the `use-mobile.tsx` hook.
*   **Theme State:** Managed by `next-themes` via the `ThemeProvider`.

This architecture prioritizes component isolation and uses hooks for reusable logic, adhering to modern React practices.
```