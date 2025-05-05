# Installation Guide

This guide explains how to install the necessary dependencies to run the Deskfolio project locally.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1.  **Node.js:** Deskfolio is a Node.js application. We recommend using the latest LTS (Long Term Support) version. You can download it from [nodejs.org](https://nodejs.org/). Node.js comes bundled with npm (Node Package Manager).
2.  **Package Manager (npm, Yarn, or pnpm):** You need a package manager to install the project's dependencies.
    *   **npm:** Comes with Node.js.
    *   **Yarn:** Can be installed via npm: `npm install --global yarn`. ([Yarn installation guide](https://classic.yarnpkg.com/en/docs/install))
    *   **pnpm:** Can be installed via npm: `npm install --global pnpm`. ([pnpm installation guide](https://pnpm.io/installation))

## Installation Steps

1.  **Clone the Repository (if applicable):**
    If you haven't already, clone the project repository from your source control (e.g., GitHub) to your local machine.
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install Dependencies:**
    Navigate to the root directory of the project in your terminal (the directory containing the `package.json` file). Run one of the following commands based on your preferred package manager:

    *   **Using npm:**
        ```bash
        npm install
        ```
        *   **What it does:** This command reads the `package.json` file, which lists all the project's direct and indirect dependencies (libraries and tools like React, Next.js, Tailwind CSS, etc.). It then downloads these dependencies from the npm registry and installs them into a folder named `node_modules` within your project directory. It also creates or updates a `package-lock.json` file, which records the exact versions of the installed dependencies to ensure consistency across different environments.

    *   **Using Yarn:**
        ```bash
        yarn install
        # or simply
        yarn
        ```
        *   **What it does:** Similar to `npm install`, Yarn reads `package.json`, downloads dependencies from the registry, and stores them in `node_modules`. It uses a `yarn.lock` file to lock down dependency versions for consistency and often provides faster installation times due to caching mechanisms.

    *   **Using pnpm:**
        ```bash
        pnpm install
        ```
        *   **What it does:** pnpm also reads `package.json` and installs dependencies. Its key difference is efficiency; it stores dependencies in a global store on your machine and uses hard links or reflinks to link them into your project's `node_modules` folder. This saves significant disk space and can speed up installation, especially across multiple projects using the same dependencies. It uses a `pnpm-lock.yaml` file for version locking.

## Troubleshooting

*   **Permissions Errors (EACCES):** If you encounter permission errors, especially on Linux or macOS, you might need to adjust npm's default directory permissions or use `sudo` (use `sudo` with caution). Refer to the [npm documentation on fixing permissions](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally).
*   **Network Issues:** Ensure you have a stable internet connection. Firewalls or proxies might sometimes interfere with downloading packages.
*   **Incomplete Installation:** If the installation seems stuck or incomplete, try deleting the `node_modules` folder and the lock file (`package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`) and running the install command again.
    ```bash
    rm -rf node_modules
    rm package-lock.json # or yarn.lock / pnpm-lock.yaml
    npm install # or yarn install / pnpm install
    ```

Once the installation completes without errors, you are ready to run the application in development mode. See the [Development Guide](./development.md) for the next steps.