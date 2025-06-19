"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { UserRoles, APP_ROUTES } from "@/lib/authConstants";
import { LayoutDashboard, UserCircle2, Map, Edit3, LogOut, Settings, Bike } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

const navItems = [
  { href: APP_ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard, roles: [UserRoles.ADMIN, UserRoles.RIDER, UserRoles.CLIENT] },
  { href: APP_ROUTES.PROFILE, label: "My Profile", icon: UserCircle2, roles: [UserRoles.RIDER] },
  { href: APP_ROUTES.MAP, label: "Live Map", icon: Map, roles: [UserRoles.ADMIN, UserRoles.RIDER] },
  { href: APP_ROUTES.DISPATCH, label: "Dispatch Tool", icon: Edit3, roles: [UserRoles.ADMIN] },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <Sidebar collapsible="icon" side="left" variant="sidebar" className="border-r shadow-sm">
      <SidebarHeader className="p-4 border-b">
         <Logo size="md"/>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {navItems.map((item) =>
            item.roles.includes(user.role) && (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (item.href !== APP_ROUTES.DASHBOARD && pathname.startsWith(item.href))}
                    tooltip={item.label}
                    className="justify-start"
                  >
                    <a>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarContent>
      <Separator className="my-2"/>
      <SidebarFooter className="p-2">
        <SidebarMenu>
            <SidebarMenuItem>
                 <SidebarMenuButton tooltip="Settings" className="justify-start" disabled>
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={() => logout()} tooltip="Logout" className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive focus:text-destructive focus:bg-destructive/10">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
