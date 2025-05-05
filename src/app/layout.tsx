import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a good modern sans-serif alternative
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster" // Import Toaster
import { ThemeProvider } from "@/components/theme-provider"; // Import ThemeProvider

// Using Inter font - a clean sans-serif suitable for UI
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});


export const metadata: Metadata = {
  title: 'Deskfolio', // Updated title
  description: 'My Portfolio - Desktop Style',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Ensure no whitespace is rendered directly inside <html> */}
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased", // Use the font variable
        inter.variable
      )}>
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster /> {/* Add Toaster component here */}
        </ThemeProvider>
      </body>
    </html>
  );
}
