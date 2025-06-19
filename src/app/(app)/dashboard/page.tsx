"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { UserRoles } from "@/lib/authConstants";
import { BarChart, Users, Truck, AlertTriangle } from "lucide-react";
import type { Metadata } from 'next';

// Cannot export metadata from client component. This should be handled at layout or page level if it's a server component.
// export const metadata: Metadata = {
//   title: 'Dashboard | MobilityLink MVP',
// };

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null; // Or a loading state

  const commonStats = [
    { title: "Active Riders", value: "42", icon: Users, color: "text-green-500", dataAiHint: "team working" },
    { title: "Vehicles Online", value: "38", icon: Truck, color: "text-blue-500", dataAiHint: "delivery van" },
    { title: "Pending Tasks", value: "12", icon: BarChart, color: "text-yellow-500", dataAiHint: "to-do list" },
    { title: "Alerts", value: "3", icon: AlertTriangle, color: "text-red-500", dataAiHint: "warning sign" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome, ${user.name}!`}
        description={`Here's what's happening with MobilityLink today. Your role: ${user.role}`}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {commonStats.map((stat) => (
          <Card key={stat.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300" data-ai-hint={stat.dataAiHint}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground pt-1">
                +5.2% from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {user.role === UserRoles.RIDER && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Rider Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Access your profile, punch in/out, and view your current tasks.</p>
            {/* Add Link buttons here later */}
          </CardContent>
        </Card>
      )}

      {user.role === UserRoles.ADMIN && (
         <Card className="shadow-lg" data-ai-hint="operations center">
          <CardHeader>
            <CardTitle>Admin Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Manage riders, oversee dispatch operations, and monitor fleet health.</p>
            {/* Add Link buttons here later */}
             <img src="https://placehold.co/800x300.png" alt="Admin dashboard graph placeholder" className="mt-4 rounded-md" data-ai-hint="business graph"/>
          </CardContent>
        </Card>
      )}
       <div className="mt-8 p-6 bg-card rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-foreground mb-4">Stay Updated</h3>
          <p className="text-muted-foreground">
            MobilityLink is an open-source B2B mobility solution. This MVP demonstrates core functionalities like authentication, rider profiles, real-time map placeholders, vehicle telemetry display, punch in/out, and an AI-powered suggested rider tool.
          </p>
          <p className="text-muted-foreground mt-2">
            Explore the sidebar to navigate through different features based on your role.
          </p>
        </div>
    </div>
  );
}
