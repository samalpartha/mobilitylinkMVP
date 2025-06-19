
"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UserRole, StoredUser } from '@/types';
import { UserRoles, APP_ROUTES, USERS_STORAGE_KEY } from '@/lib/authConstants';
import { UserPlus, Mail, KeyRound, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { useToast } from '@/hooks/use-toast';

export function RegistrationForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRoles.RIDER);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getStoredUsers = (): StoredUser[] => {
    if (typeof window === 'undefined') return [];
    try {
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
      if (usersJson) {
        const parsedData = JSON.parse(usersJson);
        if (Array.isArray(parsedData)) {
          return parsedData;
        } else {
          console.warn("Stored user data in RegistrationForm is not an array. Clearing and starting fresh.");
          localStorage.removeItem(USERS_STORAGE_KEY);
          return [];
        }
      }
      return [];
    } catch (e) {
      console.error("Failed to parse users from localStorage in RegistrationForm. Clearing and starting fresh.", e);
      localStorage.removeItem(USERS_STORAGE_KEY);
      return [];
    }
  };

  const saveStoredUsers = (users: StoredUser[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    if (!name || !email || !password) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    const users = getStoredUsers();
    if (users.find(u => u.email === email)) {
      setError('Email already registered. Please try logging in.');
      setIsLoading(false);
      return;
    }
    
    const userId = email; 
    const avatarUrl = `https://placehold.co/100x100.png?text=${name.substring(0,2).toUpperCase()}`;

    const newUser: StoredUser = {
      id: userId,
      name,
      email,
      password, 
      role,
      avatarUrl,
    };

    users.push(newUser);
    saveStoredUsers(users);
    setIsLoading(false);

    toast({
      title: "Registration Successful!",
      description: `You can now log in. A confirmation email has been sent to ${email}.`,
    });
    router.push(APP_ROUTES.LOGIN);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-center">Create Account</CardTitle>
          <CardDescription className="text-center">Join MobilityLink today.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Your Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
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
                  placeholder="•••••••• (min. 6 characters)" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role (For Demo)</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)} disabled={isLoading}>
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRoles.RIDER}>Rider</SelectItem>
                  <SelectItem value={UserRoles.ADMIN}>Admin/Dispatcher</SelectItem>
                  <SelectItem value={UserRoles.CLIENT}>Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 rounded-lg shadow-md hover:shadow-lg transition-shadow" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" /> Register
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm text-muted-foreground space-y-2">
          <p>Already have an account? <Link href={APP_ROUTES.LOGIN} className="text-primary hover:underline">Sign In</Link></p>
          <p>Part of the MobilityLink Open Source Suite.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
