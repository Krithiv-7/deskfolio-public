# Deskfolio Documentation

Welcome to the documentation for the Deskfolio application. This documentation aims to explain the structure, components, core logic, and how to get started with the application.

## Table of Contents

*   [Architecture](./architecture.md): High-level overview of the application structure.
*   [Components](./components.md): Detailed explanation of the main UI components and how to modify their content.
*   [State Management](./state-management.md): How application state (windows, icons) is managed.
*   [Styling](./styling.md): Approach to styling using Tailwind CSS and ShadCN.
*   [Installation](./installation.md): How to install project dependencies.
*   [Development](./development.md): How to run the application locally for development.
*   [Building & Deployment](./deployment.md): How to build the application for production and deployment notes.

## Project Structure

```
.
├── public/              # Static assets (images, favicon.ico, resume/resume.pdf etc.)
├── src/
│   ├── app/             # Next.js App Router pages and layout
│   │   ├── globals.css  # Global styles and Tailwind directives
│   │   ├── layout.tsx   # Root layout component
│   │   └── page.tsx     # Main desktop page component
│   ├── components/      # Reusable UI components
│   │   ├── boot/        # Boot screen component
│   │   ├── desktop/     # Desktop-related components (Icon, Window, Taskbar)
│   │   ├── login/       # Login screen component
│   │   ├── restart/     # Restart screen component
│   │   ├── shutdown/    # Shutdown screen component
│   │   ├── ui/          # ShadCN UI components
│   │   └── theme-provider.tsx # Theme management
│   ├── hooks/           # Custom React hooks
│   │   ├── use-mobile.tsx # Hook to detect mobile devices
│   │   ├── use-toast.ts # Hook for toast notifications
│   │   └── useWindowManager.ts # Hook for managing window state
│   └── lib/             # Utility functions
│       └── utils.ts     # General utility functions (e.g., cn)
├── docs/                # Project documentation (you are here)
├── .env.local           # Environment variables (optional, for API keys etc.)
├── components.json      # ShadCN UI configuration
├── next.config.ts       # Next.js configuration (note: it's .ts, not .mjs)
├── package.json         # Project dependencies and scripts
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

This structure follows standard Next.js conventions with clear separation for components, hooks, and utility functions.
```