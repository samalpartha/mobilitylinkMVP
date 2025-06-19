
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/useAuth';
import type { User, StoredUser } from '@/types';
import { UserRoles, APP_ROUTES, USERS_STORAGE_KEY } from '@/lib/authConstants';
import { LogIn, Mail, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('rider@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getStoredUsers = (): StoredUser[] => {
    if (typeof window === 'undefined') return [];

    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    let usersToReturn: StoredUser[] | null = null;

    if (usersJson) {
      try {
        const parsedData = JSON.parse(usersJson);
        if (Array.isArray(parsedData)) {
          usersToReturn = parsedData; // Use the data if it's an array (even empty)
        } else {
          // Data is not an array, implies corruption or unexpected format
          console.warn("Stored user data is not an array. Resetting to defaults.");
          localStorage.removeItem(USERS_STORAGE_KEY); // Clear invalid data
        }
      } catch (e) {
        // JSON parsing failed, implies corruption
        console.error("Failed to parse users from localStorage. Resetting to defaults.", e);
        localStorage.removeItem(USERS_STORAGE_KEY); // Clear corrupted data
      }
    }

    // If usersToReturn is still null, it means:
    // 1. localStorage item didn't exist (usersJson was null)
    // 2. Stored data was corrupted and cleared
    if (usersToReturn === null) {
      const defaultUsers: StoredUser[] = [
        { id: "RIDER_001", name: "Alex Rider", email: "rider@example.com", password: "password", role: UserRoles.RIDER, avatarUrl: "https://placehold.co/100x100.png" },
        { id: "ADMIN_001", name: "Chris Admin", email: "admin@example.com", password: "password", role: UserRoles.ADMIN, avatarUrl: "https://placehold.co/100x100.png" },
        { id: "CLIENT_001", name: "Sam Client", email: "client@example.com", password: "password", role: UserRoles.CLIENT, avatarUrl: "https://placehold.co/100x100.png" },
      ];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
      usersToReturn = defaultUsers;
    }

    return usersToReturn;
  };


  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError('Email and password are required.');
        return; 
      }

      const users = getStoredUsers(); 
      const foundUser = users.find(u => u.email === email);

      if (foundUser && foundUser.password === password) {
        const userToLogin: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role, 
          avatarUrl: foundUser.avatarUrl || "https://placehold.co/100x100.png",
        };
        login(userToLogin, APP_ROUTES.DASHBOARD);
      } else {
        setError('Invalid email or password. Please check your credentials or register.');
      }
    } catch (e) {
      console.error("Login submission error:", e);
      setError("An unexpected error occurred during login. Please try again.");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-center">Welcome Back!</CardTitle>
          <CardDescription className="text-center">Sign in to access your MobilityLink dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="pl-10"
                  aria-describedby={error ? "email-error" : undefined}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
               <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="pl-10"
                  aria-describedby={error ? "password-error" : undefined}
                  disabled={isLoading}
                />
              </div>
            </div>
            {error && <p id="login-error" className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 rounded-lg shadow-md hover:shadow-lg transition-shadow" disabled={isLoading}>
             {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" /> Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm text-muted-foreground space-y-2">
          <p>Don't have an account? <Link href={APP_ROUTES.REGISTER} className="text-primary hover:underline">Register here</Link></p>
          <p>Part of the MobilityLink Open Source Suite.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
