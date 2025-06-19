
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/useAuth';
import type { User, StoredUser, UserRole } from '@/types';
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

    // Case 1: localStorage has the key and it's valid JSON array
    if (usersJson !== null) {
      try {
        const parsedData = JSON.parse(usersJson);
        if (Array.isArray(parsedData)) {
          // Basic validation: check if items in array look like StoredUser objects
          const isValidData = parsedData.every(u =>
            typeof u === 'object' && u !== null &&
            'id' in u && typeof u.id === 'string' &&
            'name' in u && typeof u.name === 'string' &&
            'email' in u && typeof u.email === 'string' &&
            'password' in u && typeof u.password === 'string' && // Check password existence for StoredUser
            'role' in u && typeof u.role === 'string' && Object.values(UserRoles).includes(u.role as UserRoles) &&
            'avatarUrl' in u && typeof u.avatarUrl === 'string'
          );

          if (isValidData) {
              console.log("LoginForm: Successfully loaded users from localStorage:", parsedData);
              return parsedData as StoredUser[];
          } else {
              console.warn("LoginForm: Stored user data contains invalid user objects. Clearing and populating defaults.");
              localStorage.removeItem(USERS_STORAGE_KEY);
              // Fall through to default population
          }
        } else {
          console.warn("LoginForm: Stored user data is not an array. Clearing and populating defaults.");
          localStorage.removeItem(USERS_STORAGE_KEY);
          // Fall through to default population
        }
      } catch (parseError) {
        console.error("LoginForm: Failed to parse users from localStorage. Clearing and populating defaults.", parseError);
        localStorage.removeItem(USERS_STORAGE_KEY);
        // Fall through to default population
      }
    } else {
        console.log("LoginForm: No users key found in localStorage. Will populate defaults.");
        // Key doesn't exist, fall through to default population
    }

    // Case 2: Populate and return default users (if key didn't exist or data was invalid)
    console.log("LoginForm: Populating default users into localStorage.");
    const defaultUsers: StoredUser[] = [
      { id: "RIDER_001", name: "Alex Rider", email: "rider@example.com", password: "password", role: UserRoles.RIDER, avatarUrl: "https://placehold.co/100x100.png" },
      { id: "ADMIN_001", name: "Chris Admin", email: "admin@example.com", password: "password", role: UserRoles.ADMIN, avatarUrl: "https://placehold.co/100x100.png" },
      { id: "CLIENT_001", name: "Sam Client", email: "client@example.com", password: "password", role: UserRoles.CLIENT, avatarUrl: "https://placehold.co/100x100.png" },
    ];
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
      return defaultUsers;
    } catch (saveError) {
      console.error("Failed to save default users to localStorage in LoginForm.", saveError);
      return []; // Fallback if saving defaults also fails
    }
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
        let userRole: UserRole = UserRoles.RIDER; 
        if (Object.values(UserRoles).includes(foundUser.role as UserRoles)) {
            userRole = foundUser.role as UserRoles;
        }
        
        const avatar = foundUser.avatarUrl || `https://placehold.co/100x100.png?text=${email.substring(0,2).toUpperCase()}`;
        
        const userToLogin: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: userRole, 
          avatarUrl: avatar,
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
