
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserCircle, KeyRound, LogIn } from 'lucide-react'; // Icons for login - Keep LogIn, remove KeyRound if not used elsewhere
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  wallpaperUrl?: string | null; // Optional wallpaper prop
}

export function LoginScreen({ onLoginSuccess, wallpaperUrl }: LoginScreenProps) {
  // Mock login - just need to click the button
  const [username, setUsername] = useState('Guest'); // Default to Guest
  // const [password, setPassword] = useState(''); // Removed password state
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(''); // Removed error state

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // setError(''); // Removed error handling

    // Simulate login delay
    setTimeout(() => {
        // No password check needed
        onLoginSuccess();
        // No need for else block or setIsLoading(false) here as success always happens
    }, 1000); // 1 second delay
  };

  const backgroundStyle = wallpaperUrl
    ? { backgroundImage: `url(${wallpaperUrl})` }
    : {};

  return (
    <div
      className={cn(
        "fixed inset-0 z-[90] flex items-center justify-center bg-background bg-cover bg-center transition-opacity duration-500 ease-in-out",
        // Apply background only if URL exists
        wallpaperUrl ? '' : 'bg-gray-700' // Fallback background color
      )}
      style={backgroundStyle}
       data-ai-hint="desktop background abstract nature" // Reuse hint
    >
      <Card className="w-full max-w-sm bg-card/80 backdrop-blur-sm border-border/50 shadow-xl">
        <CardHeader className="text-center">
          {/* Placeholder User Icon */}
           <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-muted flex items-center justify-center border">
              <UserCircle className="h-12 w-12 text-muted-foreground" />
            </div>
          <CardTitle>Welcome!</CardTitle>
          <CardDescription>Click Login to access Deskfolio as Guest.</CardDescription> {/* Updated description */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-1.5">
                 <UserCircle className="w-4 h-4 text-muted-foreground"/> Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Allow changing if needed, or keep readOnly
                readOnly // Keep Guest read-only for simplicity
                className="bg-input/80 cursor-not-allowed"
              />
            </div>
            {/* Removed Password Field */}
            {/*
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-1.5">
                 <KeyRound className="w-4 h-4 text-muted-foreground"/> Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password (any)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input/80"
                 autoFocus // Focus password field on load
              />
            </div>
            */}
            {/* {error && <p className="text-sm text-destructive text-center">{error}</p>} */}
             <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : (
                <>
                   <LogIn className="mr-2 h-4 w-4" /> Login
                </>
              )}
            </Button>
          </form>
        </CardContent>
         <CardFooter className="text-center text-xs text-muted-foreground justify-center">
           {/* Updated footer message */}
           <p>Click the Login button to continue.</p>
         </CardFooter>
      </Card>
    </div>
  );
}

