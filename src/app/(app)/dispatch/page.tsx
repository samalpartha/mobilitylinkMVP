"use client"; // This page uses client components

import { PageHeader } from "@/components/shared/PageHeader";
import { SuggestRiderForm } from "@/components/dispatch/SuggestRiderForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, Users, Route } from "lucide-react";

// Mock data for dispatch overview
const dispatchStats = [
  { title: "Active Tasks", value: "23", icon: ListChecks, dataAiHint:"clipboard checklist" },
  { title: "Available Riders", value: "15", icon: Users, dataAiHint:"team group" },
  { title: "Avg. Delivery Time", value: "28 min", icon: Route, dataAiHint:"road map" },
];

export default function DispatchPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dispatch Center"
        description="Assign tasks and manage your fleet efficiently using AI-powered suggestions."
      />

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {dispatchStats.map((stat) => (
          <Card key={stat.title} className="shadow-md hover:shadow-lg transition-shadow" data-ai-hint={stat.dataAiHint}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center">
        <SuggestRiderForm />
      </div>

       <Card className="mt-8 bg-card shadow-lg" data-ai-hint="dispatch control">
          <CardHeader>
            <CardTitle className="text-xl font-headline">How it Works</CardTitle>
            <CardDescription>
              The "Suggest Closest Rider" tool uses GenAI to simulate finding an optimal rider based on the provided task location.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Enter the task's geographical coordinates (latitude, longitude).</li>
              <li>Click "Find Rider".</li>
              <li>The AI will process this information and suggest an available rider, including their ID, name, and current location.</li>
              <li>This is a demonstration and uses a mock AI flow. In a real system, it would integrate with live rider data.</li>
            </ol>
            <div className="mt-4 p-3 bg-secondary rounded-md border border-border">
                <p className="text-sm text-foreground">
                    <strong>Example:</strong> Inputting <code>34.0522,-118.2437</code> (Los Angeles) might suggest a rider currently near that area.
                </p>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
