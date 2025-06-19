"use client"; 

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { APP_ROUTES } from '@/lib/authConstants';
import { Toaster } from '@/components/ui/toaster';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(APP_ROUTES.LOGIN);
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    // You can render a loading spinner here
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center">
          {/* Optional: Add a nice loading spinner or logo */}
          <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-muted-foreground">Loading your experience...</p>
        </div>
      </div>
    );
  }
  
  return (
    <SidebarProvider defaultOpen={true}>
        <div className="flex h-full w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <AppHeader />
                <SidebarInset className="flex-1 overflow-y-auto bg-background">
                  <main className="p-4 md:p-6 lg:p-8">
                    {children}
                  </main>
                </SidebarInset>
            </div>
        </div>
        <Toaster />
    </SidebarProvider>
  );
}
