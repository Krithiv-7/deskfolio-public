# Styling Documentation

Deskfolio uses a combination of Tailwind CSS, ShadCN UI, and custom CSS (primarily through `globals.css`) to achieve its desktop-like appearance.

## Core Principles

*   **Tailwind CSS:** Utility classes are used for the majority of layout, spacing, typography, and general styling. This promotes consistency and rapid development.
*   **ShadCN UI:** Pre-built components (Button, Card, Dialog, etc.) are used for common UI elements. These components are built with Radix UI primitives and styled with Tailwind CSS.
*   **CSS Variables (Theme):** The application theme (colors, border radius) is defined using HSL CSS variables in `src/app/globals.css`. This allows for easy theming and supports light/dark modes.
*   **`cn` Utility:** The `cn` function from `src/lib/utils.ts` (which combines `clsx` and `tailwind-merge`) is used to conditionally apply Tailwind classes and merge potentially conflicting classes.
*   **Custom CSS:** Minimal custom CSS is used, primarily for:
    *   Defining the CSS variables for the theme.
    *   Applying base styles (e.g., default font, body background).
    *   Implementing custom gradients (`title-bar-gradient`, `window-gradient`).
    *   Text shadow utilities.
    *   Animation keyframes (`pulse` for loading states).

## Theme (`globals.css`)

The `src/app/globals.css` file is central to the application's look and feel.

*   **`@tailwind base/components/utilities;`**: Imports Tailwind's base styles, component classes, and utility classes.
*   **`:root` and `.dark` Selectors:** Define CSS variables for light and dark themes respectively.
    *   `--background`, `--foreground`: Base page colors.
    *   `--card`, `--card-foreground`: Window/Card background and text.
    *   `--popover`, `--popover-foreground`: Popover background and text.
    *   `--primary`, `--primary-foreground`: Accent color (e.g., window title bars) and its text.
    *   `--secondary`, `--secondary-foreground`: Secondary color (e.g., taskbar) and its text.
    *   `--muted`, `--muted-foreground`: Muted elements and text.
    *   `--accent`, `--accent-foreground`: Secondary accent color and its text.
    *   `--destructive`, `--destructive-foreground`: Destructive actions (e.g., shutdown button focus) and text.
    *   `--border`, `--input`, `--ring`: Border, input field, and focus ring colors.
    *   `--radius`: Base border radius.
    *   `--chart-*`: Colors for charts (if used).
    *   `--sidebar-*`: Specific variables for the sidebar component (if used).
*   **Base Layer (`@layer base`)**: Applies default styles to `*` (all elements) and `body`. Sets `overflow: hidden` on the body to prevent main page scroll.
*   **Custom Gradients**: Defines `.title-bar-gradient` and `.window-gradient` classes using `linear-gradient`.
*   **Text Shadow Utilities (`@layer utilities`)**: Defines `.text-shadow-*` classes for applying text shadows, crucial for text visibility on varying backgrounds.
*   **Animation Utilities (`@layer utilities`)**: Defines the `pulse` animation keyframes.

## Component Styling

*   Components generally use Tailwind utility classes directly via the `className` prop.
*   ShadCN components accept `className` to allow further customization with Tailwind.
*   The `cn` utility is used frequently to merge default component styles with custom overrides or conditional classes (e.g., `cn('base-styles', isDragging && 'dragging-styles')`).
*   Colors are typically applied using the theme variables (e.g., `bg-primary`, `text-foreground`, `border-border`) rather than hardcoded Tailwind color classes (like `bg-blue-500`) to ensure theme consistency.

This approach allows for a flexible and maintainable styling system that leverages the strengths of Tailwind CSS while providing a consistent theme via CSS variables and reusable components from ShadCN UI.