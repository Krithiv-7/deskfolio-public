# State Management

State management in Deskfolio primarily relies on React's built-in state management (`useState`, `useRef`) and custom hooks.

## 1. Window State (`useWindowManager`)

The core of the desktop simulation relies on managing the state of multiple windows. This is handled by the custom hook `useWindowManager` located in `src/hooks/useWindowManager.ts`.

*   **`windows` State:** An object where keys are window IDs and values are `WindowState` objects containing:
    *   `id`, `title`
    *   `isOpen`, `isMinimized`, `isMaximized` (booleans)
    *   `zIndex` (number for stacking order)
    *   `initialPosition`, `initialSize` (base geometry, used for placement and restoring on desktop)
*   **`activeWindowId` State:** A string holding the ID of the currently focused window, or `null`.
*   **`minimizedByHome` Ref:** A `Set` to track which windows were minimized specifically by the "Minimize All" (Home) button, allowing `toggleMinimizeAll` to restore only those windows.
*   **Functions:** The hook exposes functions to manipulate window state:
    *   `openWindow(id)`: Opens or focuses a window. Ensures it's not minimized.
    *   `closeWindow(id)`: Closes a window and handles focusing the next available window.
    *   `minimizeWindow(id, byHome?)`: Minimizes a window. Optionally tracks if minimized by the Home button. Handles focus change.
    *   `maximizeWindow(id)`: Toggles the maximized state of a window (desktop only). Ensures it's not minimized.
    *   `bringToFront(id)`: Increases a window's z-index and sets it as active.
    *   `restoreWindow(id, byHome?)`: Restores a window from a minimized state.
    *   `handleFocus(id)`: Called when a window receives focus (e.g., by clicking). Triggers `bringToFront`.
    *   `handleTaskbarClick(id)`: Logic for clicking a window's button on the taskbar (minimize/restore/focus).
    *   `toggleMinimizeAll()`: Minimizes all open windows or restores those specifically minimized by this action. Handles focus changes.
    *   `resetWindows()`: Resets all window states to their initial configuration (used during restart).

## 2. Desktop Icon Positions (`DesktopFolio`)

The positions of icons on the desktop are managed directly within the main `DesktopFolio` component (`src/app/page.tsx`).

*   **`desktopIcons` State:** An object where keys are icon IDs (matching window IDs) and values are `{ x: number, y: number }` objects representing the top-left coordinates.
*   **`draggingIconId` State:** A string holding the ID of the icon currently being dragged, or `null`.
*   **`dragOffset` Ref:** Stores the offset between the mouse/touch point and the top-left corner of the icon being dragged.
*   **Initialization:** Icon positions are initialized in a grid layout within a `useEffect` hook, considering mobile view.
*   **Drag-and-Drop:**
    *   `handleIconMouseDown`: Initiates dragging when an icon is clicked or touched. Stores the initial offset and sets `draggingIconId`. Attaches move/up listeners.
    *   `handleIconMouseMove`: Updates the `desktopIcons` state with the new position during dragging, performing boundary checks.
    *   `handleIconMouseUp`: Finalizes the drag operation, clears `draggingIconId`, and removes listeners.

## 3. Application Lifecycle State (`DesktopFolio`)

The overall state of the application (whether it's booting, showing the login screen, running the desktop, or shutting down/restarting) is managed by the `appState` state variable within `DesktopFolio`.

*   **`appState` State:** A string that can be `'booting'`, `'login'`, `'desktop'`, `'shuttingDown'`, or `'restarting'`.
*   **Transitions:** Callback functions (`handleBootComplete`, `handleLoginSuccess`, `handleShutdownClick`, `handleRestartClick`, `handleShutdownComplete`, `handleRestartComplete`) trigger changes in `appState`, causing different components (`BootScreen`, `LoginScreen`, `DesktopFolio`, `ShutdownScreen`, `RestartScreen`) to render conditionally.

## 4. Authentication State (`DesktopFolio`)

*   **`isAuthenticated` State:** A boolean flag set after successful login (`handleLoginSuccess`), used as an additional condition to render the main desktop UI. Reset on restart.

## 5. Mobile View State (`DesktopFolio`)

*   **`isMobile` State:** A boolean flag derived from the `use-mobile.tsx` hook. It's updated on mount and window resize. Used to conditionally render UI elements (like window styling, taskbar buttons, icon sizes).

## 6. Theme State (`ThemeProvider`, `useTheme`)

The light/dark theme is managed using the `next-themes` library.

*   **`ThemeProvider`:** Wraps the application in `src/app/layout.tsx` to provide theme context.
*   **`useTheme` Hook:** Used in the `Taskbar` component to get the current theme (`theme`) and the function to change it (`setTheme`). The theme toggle button calls `setTheme` to switch between 'light' and 'dark'.

This combination of local component state, custom hooks, and external libraries provides a structured way to manage the different aspects of the application's state, including UI interactions, application flow, and responsiveness.
```