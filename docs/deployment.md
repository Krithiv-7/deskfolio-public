# Building & Deployment Guide

This document provides guidelines for building the Deskfolio Next.js application for production and notes on deploying it.

## Building the Application

Before deploying your application, you need to create an optimized production build. This process transforms your development code (including TypeScript, JSX, and Tailwind CSS) into highly optimized static assets (HTML, CSS, JavaScript) and server-side code that can be served efficiently.

1.  **Ensure Dependencies are Installed:**
    Make sure you have run the installation command as described in the [Installation Guide](./installation.md).
    ```bash
    npm install # or yarn install / pnpm install
    ```

2.  **Create Production Build:**
    Run one of the following commands in your project's root directory:

    *   **Using npm:**
        ```bash
        npm run build
        ```

    *   **Using Yarn:**
        ```bash
        yarn build
        ```

    *   **Using pnpm:**
        ```bash
        pnpm build
        ```

    *   **What it does:** This command executes the `build` script defined in `package.json`, which is typically `next build`. The `next build` command performs several crucial steps:
        *   **Compiles Code:** Transpiles TypeScript and JSX into JavaScript that browsers can understand.
        *   **Optimizes Assets:** Minifies JavaScript and CSS code, optimizes images (if using `next/image` with a configured loader), and performs code splitting to reduce initial load times.
        *   **Bundles Code:** Creates optimized JavaScript bundles for different parts of the application.
        *   **Static Site Generation (SSG) / Server-Side Rendering (SSR):** Pre-renders pages where possible (for SSG) or prepares server-side code for pages requiring SSR or using Server Components.
        *   **Generates Output:** Creates the production-ready application in the `.next` directory. This directory contains everything needed to run the application in production.

3.  **Build Output:**
    After a successful build, the `.next` directory will be populated. You should generally **not** commit the `.next` directory to version control (it's usually included in `.gitignore`). This output is what deployment platforms use to serve your application.

## Starting the Production Server (Locally)

While not a deployment method itself, you can test the production build locally after running `npm run build`:

*   **Using npm:**
    ```bash
    npm run start
    ```
*   **Using Yarn:**
    ```bash
    yarn start
    ```
*   **Using pnpm:**
    ```bash
    pnpm start
    ```
*   **What it does:** This runs the `next start` command, which starts a Node.js server optimized for serving the production build located in the `.next` directory. By default, it usually runs on port 3000, but this can be configured. This simulates how the application would run in a Node.js hosting environment.

## Deployment Platforms

Deskfolio, being a standard Next.js application, can be deployed to various platforms that support Node.js or static site hosting (though dynamic features like Server Components and potentially future API routes require a Node.js environment or specific platform adapters).

### Recommended Platforms:

1.  **Vercel:** (Highly Recommended)
    *   Developed by the creators of Next.js, Vercel offers seamless integration and automatic optimization for Next.js projects.
    *   Connect your Git repository (GitHub, GitLab, Bitbucket) for automatic builds and deployments on every push to your main branch.
    *   Handles the build process (`next build`), serverless functions, edge functions, and CDN distribution automatically.
    *   **How it works:** Vercel detects your project is Next.js, runs `npm run build` (or equivalent), and deploys the output from `.next` to its global infrastructure.
    *   [Vercel Deployment Guide for Next.js](https://vercel.com/docs/frameworks/nextjs)

2.  **Netlify:**
    *   Another popular platform with strong support for Next.js.
    *   Offers automatic Git-based deployments, serverless functions, and more.
    *   Typically requires installing the Netlify adapter for Next.js (`@netlify/plugin-nextjs`) for full feature support.
    *   **How it works:** Similar to Vercel, Netlify builds your project using the specified build command and deploys the results. The adapter helps handle Next.js-specific features like SSR and image optimization.
    *   [Netlify Deployment Guide for Next.js](https://docs.netlify.com/integrations/frameworks/next-js/)

3.  **Cloud Platforms (AWS, Google Cloud, Azure):**
    *   **AWS:** Deploy using Amplify, EC2 + PM2, Elastic Beanstalk, Fargate, or container services (ECS/EKS) with CloudFront for CDN. Tools like OpenNext can simplify deployment to AWS Lambda (serverless).
    *   **Google Cloud:** Deploy using Cloud Run (containerized), App Engine, or Google Kubernetes Engine (GKE) with Cloud CDN.
    *   **Azure:** Deploy using App Service, Azure Functions, Azure Container Instances, or Azure Kubernetes Service (AKS) with Azure CDN.
    *   **How it works:** These platforms offer more control but require more configuration. You typically need to configure a pipeline (e.g., GitHub Actions, GitLab CI, Jenkins) to run `npm run build`, and then set up the infrastructure (servers, containers, serverless functions) to run `npm run start` or serve the built assets appropriately.

4.  **Traditional Node.js Server:**
    *   You can run the production build on any server with Node.js installed.
    *   **Steps:**
        1.  Build the application: `npm run build`.
        2.  Copy the entire project directory (including `.next`, `node_modules`, `package.json`, etc., *excluding* source code if desired for security/size) to your server. *Alternatively*, only copy `package.json`, `.next`, and `public`, then run `npm install --production` on the server.
        3.  Start the server: `npm run start`.
    *   You will likely need a process manager like `pm2` to keep the application running reliably (handling crashes, restarts) and potentially a reverse proxy like Nginx or Apache to handle HTTPS termination, load balancing, and routing.

## Environment Variables

If your application requires environment variables (e.g., API keys for future features), ensure they are configured correctly on your deployment platform *before* the build process if they are needed during the build, or at runtime if needed by the server.

*   **Vercel/Netlify:** Use their respective dashboards to set environment variables. They are typically available during both build and runtime.
*   **Cloud Platforms/Node.js Server:** Configure environment variables according to the platform's standard methods (e.g., `.env` files - ensure they are *not* committed if sensitive, system environment variables, secrets management services). Consult your platform's documentation.

Remember to **never** commit sensitive information like API keys directly into your Git repository. Use environment variables.

## Considerations

*   **Static Assets:** Ensure any assets placed in the `public` directory (like `resume.pdf` or favicons) are correctly referenced in the code (e.g., `/resume/resume.pdf`). Paths starting with `/` are relative to the `public` directory.
*   **Image Optimization:** Next.js's built-in image optimization (`next/image`) works best on platforms like Vercel or requires specific configuration (like installing `sharp`) on self-hosted environments. The current use of `picsum.photos` doesn't heavily rely on this, but keep it in mind if adding local images.
*   **Server Components/Actions:** The application uses Next.js App Router features. Ensure the deployment target fully supports these features (most modern Node.js-based platforms do). Static hosting platforms without a Node.js runtime will not support Server Components or Server Actions.