"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { Logo } from "@/components/shared/Logo";
import { useAuth } from "@/hooks/useAuth";

export function AppHeader() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 shadow-sm">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="hidden md:block">
        <Logo size="md" />
      </div>
      <div className="flex-1 md:hidden"> {/* Mobile Logo centered */}
        <div className="flex justify-center">
           <Logo size="sm" />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-4">
        {user && <UserProfileDropdown user={user} />}
      </div>
    </header>
  );
}
