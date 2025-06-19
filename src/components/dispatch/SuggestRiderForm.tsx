"use client";

import { useState, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { suggestRider, type SuggestRiderInput, type SuggestRiderOutput } from '@/ai/flows/suggest-rider';
import { Loader2, MapPin, UserCheck, Navigation } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SuggestRiderForm() {
  const [taskLocation, setTaskLocation] = useState('37.7749,-122.4194'); // Default example
  const [suggestedRider, setSuggestedRider] = useState<SuggestRiderOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuggestedRider(null);

    if (!taskLocation.trim()) {
        setError("Task location cannot be empty.");
        setIsLoading(false);
        return;
    }
    // Basic validation for geocode format (e.g., "lat,lng")
    if (!/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(taskLocation.trim())) {
        setError("Invalid location format. Please use 'latitude,longitude' (e.g., 37.7749,-122.4194).");
        setIsLoading(false);
        return;
    }

    try {
      const input: SuggestRiderInput = { taskLocation: taskLocation.trim() };
      const result = await suggestRider(input);
      setSuggestedRider(result);
      toast({
        title: "Rider Suggested",
        description: `${result.riderName} is the closest available rider.`,
      });
    } catch (e: any) {
      console.error("Failed to suggest rider:", e);
      const errorMessage = e.message || "An unknown error occurred.";
      setError(`Failed to get suggestion: ${errorMessage}`);
      toast({
        title: "Error Suggesting Rider",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center">
          <Navigation className="mr-2 h-6 w-6 text-primary" />
          Suggest Closest Rider
        </CardTitle>
        <CardDescription>Enter the task location (latitude,longitude) to find the nearest available rider.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="taskLocation" className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              Task Location (Lat,Lng)
            </Label>
            <Input
              id="taskLocation"
              type="text"
              placeholder="e.g., 37.7749,-122.4194"
              value={taskLocation}
              onChange={(e) => setTaskLocation(e.target.value)}
              disabled={isLoading}
              aria-describedby={error ? "location-error" : undefined}
            />
          </div>
          {error && (
             <Alert variant="destructive" id="location-error">
                <AlertTitle>Input Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full text-lg py-3" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Suggesting...
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-5 w-5" />
                Find Rider
              </>
            )}
          </Button>
        </form>

        {suggestedRider && (
          <Card className="mt-6 bg-secondary border-primary/20 shadow-inner">
            <CardHeader>
              <CardTitle className="text-xl font-headline flex items-center text-primary">
                <UserCheck className="mr-2 h-5 w-5" />
                Suggested Rider
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Name:</strong> {suggestedRider.riderName}</p>
              <p><strong>ID:</strong> {suggestedRider.riderId}</p>
              <p><strong>Current Location:</strong> {suggestedRider.riderLocation}</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
