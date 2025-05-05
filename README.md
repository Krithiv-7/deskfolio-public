# Deskfolio - Desktop Style Portfolio

This is a Next.js application designed to simulate a desktop environment in the browser, serving as an interactive portfolio.

## What it does

*   **Simulates a Desktop:** Provides a familiar desktop interface with icons, draggable windows, and a taskbar.
*   **Showcases Information:** Displays user information like "About Me", "Skills", "Projects", "Education", "Certifications", and "Contact" details within individual windows.
*   **Interactive Experience:** Allows users to open, close, minimize, maximize, and drag windows, as well as rearrange desktop icons.
*   **Boot & Login Simulation:** Includes simulated boot, login, shutdown, and restart sequences for a more immersive feel.
*   **Dynamic Wallpaper:** Fetches a random wallpaper on load.
*   **Theme Switching:** Supports light and dark themes.
*   **Responsive Design:** Adapts the layout for mobile devices, presenting windows fullscreen.

## Technologies Used

*   **Framework:** Next.js (with App Router)
*   **UI Library:** React
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** ShadCN UI (built on Radix UI and Tailwind)
*   **Icons:** Lucide Icons (`lucide-react`)
*   **Date/Time:** `date-fns`
*   **State Management:** React Hooks (`useState`, `useRef`, custom hooks like `useWindowManager`)
*   **Theme:** `next-themes`

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```
2.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
3.  Open [http://localhost:9002](http://localhost:9002) (or the specified port) in your browser.

## Building the Application

To create a production build of the application, run the following command:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

This will generate an optimized build in the `.next` directory. You can then start the production server using `npm run start`, `yarn start`, or `pnpm start`.

## Project Structure & Documentation

For details on the project structure, architecture, components, and how to modify content, please refer to the documentation in the `/docs` directory or [Wiki](https://github.com/krithiv-7/deskfolio-public/wiki).

