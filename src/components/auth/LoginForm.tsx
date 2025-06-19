"use client";

import { useState, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/hooks/useAuth';
import type { User, UserRole } from '@/types';
import { UserRoles, APP_ROUTES } from '@/lib/authConstants';
import { LogIn, Mail, KeyRound } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('rider@example.com');
  const [password, setPassword] = useState('password');
  const [role, setRole] = useState<UserRole>(UserRoles.RIDER);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    // Mock authentication logic
    let userName = "Demo User";
    let avatar = "/assets/avatars/avatar-1.png"; // Default avatar

    if (email.includes('rider')) {
        userName = "Alex Rider";
        avatar = "https://placehold.co/100x100.png"; // data-ai-hint="male portrait"
    } else if (email.includes('admin')) {
        userName = "Chris Admin";
        avatar = "https://placehold.co/100x100.png"; // data-ai-hint="female portrait"
    } else if (email.includes('client')) {
        userName = "Sam Client";
        avatar = "https://placehold.co/100x100.png"; // data-ai-hint="person smiling"
    }
    
    const mockUser: User = {
      id: Date.now().toString(),
      name: userName,
      email: email,
      role: role,
      avatarUrl: avatar,
    };

    login(mockUser, APP_ROUTES.DASHBOARD);
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
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role (For Demo)</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
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
            {error && <p id="email-error" className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <LogIn className="mr-2 h-5 w-5" /> Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p>Part of the MobilityLink Open Source Suite.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
