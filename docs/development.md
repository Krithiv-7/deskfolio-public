# Development Guide

This guide explains how to run the Deskfolio application locally on your machine for development purposes. This allows you to see changes live as you edit the code.

## Prerequisites

Ensure you have completed the steps in the [Installation Guide](./installation.md) and have all project dependencies installed.

## Starting the Development Server

1.  **Navigate to Project Directory:**
    Open your terminal or command prompt and navigate to the root directory of the Deskfolio project (the one containing `package.json`).

2.  **Run the Development Command:**
    Execute one of the following commands based on your package manager:

    *   **Using npm:**
        ```bash
        npm run dev
        ```

    *   **Using Yarn:**
        ```bash
        yarn dev
        ```

    *   **Using pnpm:**
        ```bash
        pnpm dev
        ```

    *   **What it does:** These commands execute the `dev` script defined in the `package.json` file. For this project, the script is:
        ```json
        "dev": "next dev --turbopack -p 9002"
        ```
        *   `next dev`: This is the standard command to start the Next.js development server. It compiles the application, starts a local web server, and watches your project files for changes.
        *   `--turbopack`: This flag enables Turbopack, an experimental, high-performance bundler developed by Vercel for faster development builds and updates (Hot Module Replacement - HMR).
        *   `-p 9002`: This specifies the port number on which the development server will run. If port 9002 is already in use, Next.js might prompt you to use a different port.

3.  **Access the Application:**
    Once the server starts successfully, you'll typically see output in your terminal similar to this:

    ```
    ✓ Ready in XXX ms
    ➜ Local:   http://localhost:9002
    ```

    Open your web browser and navigate to the URL provided (usually `http://localhost:9002`).

## Development Workflow

*   **Hot Module Replacement (HMR):** The development server uses HMR. When you save changes to a file (e.g., a React component, CSS file), the application will automatically update in your browser *without* requiring a full page reload, preserving application state where possible. This significantly speeds up the development feedback loop.
*   **Error Reporting:** If you introduce errors in your code, they will often be displayed directly in the browser (an overlay) and in the terminal console where the server is running, helping you debug issues quickly.
*   **Console Output:** Server-side logs (`console.log` in Server Components or Server Actions) will appear in the terminal where you ran `npm run dev`. Client-side logs will appear in your browser's developer console.

## Stopping the Development Server

To stop the development server, go back to the terminal window where it's running and press `Ctrl+C`.