"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PlayCircle, PauseCircle, Clock } from "lucide-react";
import type { RiderProfileData } from '@/types';

interface PunchClockProps {
  initialStatus: RiderProfileData['punchStatus'];
  initialLastPunchTime?: string;
  onPunchChange: (newStatus: RiderProfileData['punchStatus'], punchTime: string) => void;
}

export function PunchClock({ initialStatus, initialLastPunchTime, onPunchChange }: PunchClockProps) {
  const [punchStatus, setPunchStatus] = useState(initialStatus);
  const [lastPunchTime, setLastPunchTime] = useState<string | undefined>(initialLastPunchTime);
  const { toast } = useToast();

  // Effect to handle hydration mismatch for Date
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);


  const handlePunch = () => {
    const newStatus = punchStatus === 'Punched In' ? 'Punched Out' : 'Punched In';
    const punchTime = new Date().toISOString();
    
    setPunchStatus(newStatus);
    setLastPunchTime(punchTime);
    onPunchChange(newStatus, punchTime);

    toast({
      title: `Successfully ${newStatus === 'Punched In' ? 'Punched In' : 'Punched Out'}!`,
      description: `Your status has been updated. Time: ${new Date(punchTime).toLocaleTimeString()}`,
      variant: "default",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl">
      <CardHeader className="text-center">
        <Clock className="mx-auto h-12 w-12 text-primary mb-2" />
        <CardTitle className="text-2xl font-headline">Time Clock</CardTitle>
        {currentTime && <CardDescription>Current Time: {currentTime}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div className="text-lg">
          Your current status:
          <span className={`font-semibold ml-2 ${punchStatus === 'Punched In' ? 'text-green-600' : 'text-red-600'}`}>
            {punchStatus}
          </span>
        </div>
        {lastPunchTime && (
          <p className="text-sm text-muted-foreground">
            Last activity: {new Date(lastPunchTime).toLocaleString()}
          </p>
        )}
        <Button
          onClick={handlePunch}
          size="lg"
          className={`w-full text-lg py-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
            punchStatus === 'Punched In' 
            ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
            : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
          aria-label={punchStatus === 'Punched In' ? 'Punch Out' : 'Punch In'}
        >
          {punchStatus === 'Punched In' ? (
            <PauseCircle className="mr-2 h-6 w-6" />
          ) : (
            <PlayCircle className="mr-2 h-6 w-6" />
          )}
          {punchStatus === 'Punched In' ? 'Punch Out' : 'Punch In'}
        </Button>
      </CardContent>
    </Card>
  );
}
